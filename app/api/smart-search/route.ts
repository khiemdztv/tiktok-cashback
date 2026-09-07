import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limiter";
import { SEARCH_CACHE_TTL_MS, searchCache } from "@/lib/search-cache";
import {
  extractPriceFromText,
  isLikelyEditorialUrl,
  isRelevantSearchResult,
  safeHttpUrl,
  toSmartSearchResult,
} from "@/lib/search-products";
import {
  fetchContents,
  searchWeb,
  type SmartSearchResponse,
  type YouContentResult,
  type YouSearchResult,
  YouApiError,
} from "@/lib/you-api";
import { platformDomains } from "@/src/data/mock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIdentifier(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local"
  );
}

function normalizedQuery(value: unknown) {
  if (typeof value !== "string") return null;
  const query = value.normalize("NFKC").trim().replace(/\s+/g, " ");
  return query.length >= 2 && query.length <= 120 ? query : null;
}

function resultId(url: string) {
  return createHash("sha256").update(url).digest("hex").slice(0, 16);
}

function searchDomainGroups(query: string) {
  const normalized = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi");
  const domainsFor = (slugs: string[]) => slugs.flatMap((slug) => platformDomains[slug] ?? []);

  if (/khach san|hotel|resort|homestay|ve may bay|du lich|agoda|booking|traveloka/.test(normalized)) {
    return [domainsFor(["agoda", "booking-com", "traveloka"])];
  }
  if (/canva/.test(normalized)) return [domainsFor(["canva"])];
  if (/grab|dat xe|giao do an/.test(normalized)) return [domainsFor(["grab"])];

  const marketplaces = domainsFor(["shopee", "lazada", "tiki", "tiktok-shop"]);
  if (/nike|adidas|giay|sneaker|thoi trang|quan ao/.test(normalized)) {
    return [marketplaces, domainsFor(["nike", "adidas"])];
  }
  if (/dien thoai|iphone|ipad|macbook|laptop|may tinh|tivi|tv|samsung|cong nghe/.test(normalized)) {
    return [marketplaces, domainsFor(["samsung", "fpt-shop"])];
  }

  return [marketplaces, domainsFor(["nike", "adidas", "samsung", "fpt-shop", "agoda", "booking-com", "traveloka", "canva", "grab"])];
}

function upstreamError(error: unknown) {
  if (error instanceof YouApiError) {
    if ([401, 402, 403, 503].includes(error.status)) {
      return NextResponse.json(
        { error: "Dịch vụ tìm kiếm chưa sẵn sàng. Vui lòng thử lại sau.", code: "UPSTREAM_AUTH" },
        { status: 503 },
      );
    }
    const status = error.status === 504 ? 504 : 502;
    return NextResponse.json(
      { error: error.message, code: "UPSTREAM_ERROR" },
      { status },
    );
  }
  console.error("smart-search failed", error);
  return NextResponse.json(
    { error: "Không thể hoàn tất tìm kiếm lúc này.", code: "SEARCH_FAILED" },
    { status: 500 },
  );
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu gửi lên không hợp lệ.", code: "INVALID_JSON" }, { status: 400 });
  }

  const query = normalizedQuery((payload as { query?: unknown })?.query);
  if (!query) {
    return NextResponse.json(
      { error: "Từ khóa cần có từ 2 đến 120 ký tự.", code: "INVALID_QUERY" },
      { status: 400 },
    );
  }

  const cacheKey = query.toLocaleLowerCase("vi");
  const cached = searchCache.get<SmartSearchResponse>(cacheKey);
  if (cached) return NextResponse.json({ ...cached, cached: true });

  const rateLimit = consumeRateLimit(clientIdentifier(request));
  const headers = rateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Bạn đã dùng hết lượt tìm kiếm trong 24 giờ. Vui lòng thử lại sau.", code: "RATE_LIMITED" },
      {
        status: 429,
        headers: {
          ...headers,
          "Retry-After": String(Math.max(Math.ceil((rateLimit.resetAt - Date.now()) / 1000), 1)),
        },
      },
    );
  }

  try {
    const responses = await Promise.all(
      searchDomainGroups(query).map((domains) =>
        searchWeb(`${query} giá bán mua online Việt Nam`, domains, 10),
      ),
    );
    const seenUrls = new Set<string>();
    const webResults = responses.flatMap((response) => response.results?.web ?? []).filter(
      (item): item is YouSearchResult & { url: string } => {
        const url = safeHttpUrl(item.url);
        if (!url || seenUrls.has(url) || isLikelyEditorialUrl(url) || !isRelevantSearchResult(item, query)) return false;
        seenUrls.add(url);
        return true;
      },
    );

    const needsContent = webResults
      .filter((item) => {
        const text = [item.title, item.description, ...(item.snippets ?? []), ...(item.contents?.highlights ?? [])].filter(Boolean).join(" ");
        return extractPriceFromText(text) === null;
      })
      .slice(0, 3)
      .map((item) => item.url);

    let contents: YouContentResult[] = [];
    if (needsContent.length) {
      try {
        contents = await fetchContents(needsContent);
      } catch (error) {
        // Search results remain useful when a marketplace blocks page extraction.
        console.warn("You.com Contents API could not enrich search results", error);
      }
    }
    const contentsByUrl = new Map(contents.map((item) => [safeHttpUrl(item.url), item]));

    const results = webResults
      .map((item) =>
        toSmartSearchResult(
          item,
          contentsByUrl.get(safeHttpUrl(item.url)),
          resultId(item.url),
          query,
        ),
      )
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => {
        if (a.effectivePrice === null) return 1;
        if (b.effectivePrice === null) return -1;
        return a.effectivePrice - b.effectivePrice;
      });

    const data: SmartSearchResponse = {
      query,
      results,
      cached: false,
      searchedAt: new Date().toISOString(),
    };
    searchCache.set(cacheKey, data, SEARCH_CACHE_TTL_MS);
    return NextResponse.json(data, { headers });
  } catch (error) {
    return upstreamError(error);
  }
}
