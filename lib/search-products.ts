import {
  getCashbackForPlatform,
  platformDomains,
  storeBySlug,
  vouchers,
} from "@/src/data/mock";
import { effectivePrice } from "@/src/lib/format";
import type { SmartSearchResult, YouContentResult, YouSearchResult } from "@/lib/you-api";

type PriceCandidate = { value: number; score: number; index: number };

export function platformFromUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLocaleLowerCase("en").replace(/^www\./, "");
    for (const [slug, domains] of Object.entries(platformDomains)) {
      if (domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
        return slug;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function safeHttpUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function isLikelyEditorialUrl(value: string) {
  try {
    const path = new URL(value).pathname.toLocaleLowerCase("en");
    return /\/(tin-tuc|blog|blogs|news|article|articles|magazine|review)(\/|$)/.test(path);
  } catch {
    return true;
  }
}

function searchTokens(value: string) {
  const stopWords = new Set(["gia", "ban", "mua", "online", "viet", "nam", "cho", "tai", "tot"]);
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi")
    .split(/[^a-z0-9]+/)
    .filter((token) => (token.length >= 3 || /^\d{2,}$/.test(token)) && !stopWords.has(token));
}

export function isRelevantSearchResult(result: YouSearchResult, query: string) {
  const tokens = searchTokens(query);
  if (!tokens.length) return true;
  const titleAndUrl = `${result.title ?? ""} ${result.url ?? ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi");
  const matches = tokens.filter((token) => titleAndUrl.includes(token)).length;
  return matches >= Math.min(tokens.length, 2);
}

function isPlausiblePrice(price: number | null, query: string) {
  if (price === null) return false;
  const normalized = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi");
  const isAccessory = /op lung|case|phu kien|cu sac|sac du phong|day cap|cable/.test(normalized);
  if (!isAccessory && /iphone\s*(1[3-9]|\d{2})|macbook|galaxy\s*(s|z)\d/i.test(normalized)) {
    return price >= 2_000_000;
  }
  return true;
}

function numericPrice(raw: string) {
  const compact = raw.replace(/\s/g, "");
  const separators = compact.match(/[.,]/g)?.length ?? 0;
  const normalized =
    separators > 0 && /[.,]\d{3}(?:[.,]\d{3})*$/.test(compact)
      ? compact.replace(/[.,]/g, "")
      : compact.replace(/,/g, ".");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? Math.round(value) : null;
}

export function extractPriceFromText(text: string) {
  if (!text) return null;
  const normalized = text.replace(/\u00a0/g, " ").slice(0, 150_000);
  const candidates: PriceCandidate[] = [];

  const currencyPattern = /(?:₫\s*)?(\d{1,3}(?:[.,\s]\d{3}){1,3}|\d{4,12})(?:\s*(₫|đ|vnd))?/gi;
  let match: RegExpExecArray | null;
  while ((match = currencyPattern.exec(normalized)) !== null) {
    const value = numericPrice(match[1]);
    if (!value || value < 10_000 || value > 2_000_000_000) continue;

    const index = match.index ?? 0;
    const context = normalized.slice(Math.max(0, index - 80), index + match[0].length + 80);
    const hasCurrency = /₫|đ|vnd/i.test(match[0]);
    const hasGrouping = /[.,\s]\d{3}/.test(match[1]);
    let score = (hasCurrency ? 5 : 0) + (hasGrouping ? 2 : 0);
    if (/giá|price|chỉ còn|sale/i.test(context)) score += 3;
    if (/trả góp|tra[- ]?gop|mỗi tháng|\/tháng|dong[- /]?thang|discount|giảm|giam|tiết kiệm|trợ giá|ưu đãi|uu[- ]?dai|khuyến mãi|khuyen[- ]?mai/i.test(context)) score -= 8;
    if (/mã giảm|ma[- ]?giam|tặng|tang|hoàn tiền|hoan[- ]?tien|voucher|coupon|trả góp|tra[- ]?gop|mỗi tháng|\/tháng|dong[- /]?thang/i.test(context)) score -= 20;
    if (!hasCurrency && !hasGrouping) score -= 5;
    if (!hasCurrency && value < 100_000 && (match[1].match(/[.,\s]/g)?.length ?? 0) < 2) score -= 6;
    candidates.push({ value, score, index });
  }

  const millionPattern = /(\d{1,3}(?:[.,]\d{1,2})?)\s*(?:triệu|tr)(?:\s*(?:₫|đ|vnd))?/gi;
  while ((match = millionPattern.exec(normalized)) !== null) {
    const base = Number.parseFloat(match[1].replace(",", "."));
    const value = Math.round(base * 1_000_000);
    if (value >= 10_000 && value <= 2_000_000_000) {
      const index = match.index ?? 0;
      const context = normalized.slice(Math.max(0, index - 80), index + match[0].length + 80);
      const isDiscount = /giảm|giam|tiết kiệm|trợ giá|ưu đãi|uu[- ]?dai|hoàn tiền|khuyến mãi|khuyen[- ]?mai|trả góp|tra[- ]?gop/i.test(context);
      candidates.push({ value, score: isDiscount ? -3 : 6, index });
    }
  }

  candidates.sort((a, b) => b.score - a.score || a.index - b.index);
  return candidates[0]?.score >= 0 ? candidates[0].value : null;
}

export function extractPriceFromMetadata(metadata: Record<string, unknown> | undefined) {
  if (!metadata) return null;
  const candidates: Array<{ value: number; score: number }> = [];

  const visit = (value: unknown, depth: number) => {
    if (!value || depth > 6) return;
    if (Array.isArray(value)) {
      value.slice(0, 50).forEach((item) => visit(item, depth + 1));
      return;
    }
    if (typeof value !== "object") return;

    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const normalizedKey = key.toLocaleLowerCase("en");
      if (["price", "lowprice", "highprice", "sale_price", "saleprice"].includes(normalizedKey)) {
        const parsed =
          typeof child === "number"
            ? Math.round(child)
            : typeof child === "string"
              ? numericPrice(child.replace(/[^\d.,]/g, ""))
              : null;
        if (parsed && parsed >= 10_000 && parsed <= 2_000_000_000) {
          const score = normalizedKey === "price" || normalizedKey.includes("sale") ? 5 : 3;
          candidates.push({ value: parsed, score });
        }
      }
      visit(child, depth + 1);
    }
  };

  visit(metadata, 0);
  candidates.sort((a, b) => b.score - a.score || a.value - b.value);
  return candidates[0]?.value ?? null;
}

function extractRelevantContentPrice(text: string, query: string) {
  const tokens = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2);
  if (!tokens.length) return null;

  const requiredMatches = Math.min(tokens.length, 2);
  const relevantLines = text
    .split(/\r?\n/)
    .filter((line) => {
      const normalizedLine = line
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("vi");
      return tokens.filter((token) => normalizedLine.includes(token)).length >= requiredMatches;
    })
    .slice(0, 40)
    .map((line) => line.replace(/\]\([^)]*\)/g, "]").replace(/https?:\/\/\S+/g, ""))
    .join("\n");

  return extractPriceFromText(relevantLines);
}

function moneyFromLabel(label: string) {
  const thousand = label.match(/([\d.,]+)\s*k\b/i);
  if (thousand) return (numericPrice(thousand[1]) ?? 0) * 1_000;
  const dong = label.match(/([\d.,]+)\s*đ/i);
  return dong ? numericPrice(dong[1]) ?? 0 : 0;
}

function voucherMatchesQuery(title: string, query: string) {
  const normalizedTitle = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi");
  const normalizedQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi");
  const restrictions: Array<[RegExp, RegExp]> = [
    [/laptop/, /laptop|macbook|may tinh/],
    [/thoi trang/, /thoi trang|quan ao|giay|sneaker|nike|adidas/],
    [/lam dep|my pham/, /lam dep|my pham|skincare|makeup/],
    [/sneaker/, /giay|sneaker|nike|adidas/],
    [/khach san|dat phong/, /khach san|hotel|resort|homestay|dat phong/],
    [/combo du lich/, /du lich|khach san|ve may bay|combo/],
  ];
  return restrictions.every(([titlePattern, queryPattern]) => !titlePattern.test(normalizedTitle) || queryPattern.test(normalizedQuery));
}

function bestVoucher(platform: string, price: number | null, query: string) {
  if (!price) return { value: 0, label: "—" };
  let best = { value: 0, label: "Không có" };

  for (const voucher of vouchers.filter((item) => item.storeSlug === platform)) {
    if (!voucherMatchesQuery(voucher.title, query)) continue;
    const minimum = moneyFromLabel(voucher.minSpend);
    if (minimum > price) continue;

    const percent = voucher.discount.match(/(\d+(?:[.,]\d+)?)\s*%/);
    let value = percent ? Math.round((price * Number.parseFloat(percent[1].replace(",", "."))) / 100) : 0;
    if (!percent) value = moneyFromLabel(voucher.discount);

    const capMatch = voucher.title.match(/tối đa\s+([\d.,]+)\s*(k|đ)?/i);
    if (capMatch) {
      const cap = (numericPrice(capMatch[1]) ?? 0) * (capMatch[2]?.toLocaleLowerCase() === "k" ? 1_000 : 1);
      if (cap > 0) value = Math.min(value, cap);
    }

    value = Math.min(Math.max(value, 0), price);
    if (value > best.value) best = { value, label: voucher.code };
  }

  return best;
}

export function toSmartSearchResult(
  result: YouSearchResult,
  content: YouContentResult | undefined,
  id: string,
  query: string,
): SmartSearchResult | null {
  const originalUrl = safeHttpUrl(result.url);
  if (!originalUrl) return null;
  const platform = platformFromUrl(originalUrl);
  if (!platform) return null;

  const store = storeBySlug(platform);
  const searchText = [
    result.title,
    result.description,
    ...(result.snippets ?? []),
    ...(result.highlights ?? []),
    ...(result.contents?.highlights ?? []),
  ]
    .filter(Boolean)
    .join(" ");
  const contentText = content?.markdown ?? content?.html ?? "";
  const candidatePrice =
    extractPriceFromMetadata(content?.metadata) ??
    extractPriceFromText(searchText) ??
    extractRelevantContentPrice(contentText, query);
  const price = isPlausiblePrice(candidatePrice, query) ? candidatePrice : null;
  const voucher = bestVoucher(platform, price, query);
  const cashbackRate = getCashbackForPlatform(platform, query);
  const cashbackValue = price
    ? Math.round((Math.max(price - voucher.value, 0) * cashbackRate) / 100)
    : null;

  return {
    id,
    productName: result.title?.trim() || content?.title?.trim() || query,
    platform,
    platformName: store?.name ?? platform,
    price,
    voucherValue: voucher.value,
    voucherLabel: voucher.label,
    originalUrl,
    imageUrl: safeHttpUrl(result.thumbnail_url) ?? undefined,
    cashbackRate,
    cashbackValue,
    effectivePrice: price === null ? null : effectivePrice(price, voucher.value, cashbackRate),
    snippet: (result.description || result.snippets?.[0] || "").trim().slice(0, 280),
    source: "you_api",
  };
}
