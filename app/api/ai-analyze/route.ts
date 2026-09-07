import { NextRequest, NextResponse } from "next/server";

import { consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limiter";
import { ANALYSIS_CACHE_TTL_MS, analysisCache } from "@/lib/search-cache";
import {
  answerQuestion,
  type AIAnalysisResponse,
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
  const cached = analysisCache.get<AIAnalysisResponse>(cacheKey);
  if (cached) return NextResponse.json({ ...cached, cached: true });

  const rateLimit = consumeRateLimit(clientIdentifier(request));
  const headers = rateLimitHeaders(rateLimit);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Bạn đã dùng hết lượt phân tích trong 24 giờ. Vui lòng thử lại sau.", code: "RATE_LIMITED" },
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
    const domains = Array.from(new Set(Object.values(platformDomains).flat()));
    const prompt = `So sánh giá ${query} trên các sàn thương mại điện tử tại Việt Nam. Hãy nêu lựa chọn đáng mua nhất, lưu ý độ tin cậy của giá, voucher và cashback. Trả lời ngắn gọn bằng tiếng Việt.`;
    const response = await answerQuestion(prompt, domains);
    const resultTitles = new Map(
      (response.results?.web ?? []).map((item) => [item.url, item.title]),
    );
    const seen = new Set<string>();
    const citations = (response.citations ?? []).flatMap((citation) => {
      const url = citation.source;
      if (!url || seen.has(url)) return [];
      try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) return [];
        seen.add(url);
        return [{
          url,
          title: resultTitles.get(url) || parsed.hostname.replace(/^www\./, ""),
          excerpt: citation.excerpts?.[0]?.slice(0, 240),
        }];
      } catch {
        return [];
      }
    });

    const data: AIAnalysisResponse = {
      query,
      answer: response.answer,
      citations,
      cached: false,
    };
    analysisCache.set(cacheKey, data, ANALYSIS_CACHE_TTL_MS);
    return NextResponse.json(data, { headers });
  } catch (error) {
    if (error instanceof YouApiError) {
      const status = [401, 402, 403].includes(error.status) ? 503 : error.status === 504 ? 504 : 502;
      return NextResponse.json(
        {
          error: status === 503 ? "Dịch vụ AI chưa sẵn sàng. Vui lòng thử lại sau." : error.message,
          code: "UPSTREAM_ERROR",
        },
        { status },
      );
    }
    console.error("ai-analyze failed", error);
    return NextResponse.json(
      { error: "Không thể hoàn tất phân tích lúc này.", code: "ANALYSIS_FAILED" },
      { status: 500 },
    );
  }
}
