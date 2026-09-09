import type { ScrapedVoucher } from "./shopee-voucher-scraper";

type Offer = {
  id?: string | number;
  domain?: string;
  name?: string;
  link?: string;
  aff_link?: string;
  image?: string;
  start_time?: string;
  end_time?: string;
  coupons?: Array<{ coupon_code?: string; coupon_desc?: string }>;
};

function safeUrl(value?: string) {
  try {
    const url = new URL(value || "");
    return url.protocol === "https:" && !url.username && !url.password ? url : null;
  } catch { return null; }
}

function offerDate(value: string | undefined, end: boolean) {
  if (!value) return null;
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T${end ? "23:59:59.999" : "00:00:00"}+07:00`
    : value);
  return Number.isFinite(date.getTime()) ? date : null;
}

function amountAfter(text: string, label: string) {
  const match = text.match(new RegExp(`${label}\\s*([\\d.,]+)\\s*(triệu|tr|k|vnđ|vnd|₫|đ)`, "i"));
  if (!match) return 0;
  const unit = match[2].toLowerCase();
  const scaled = ["k", "tr", "triệu"].includes(unit);
  const value = Number(scaled ? match[1].replace(",", ".") : match[1].replace(/[.,]/g, ""));
  const result = Math.round(value * (unit === "k" ? 1000 : unit === "tr" || unit === "triệu" ? 1_000_000 : 1));
  return Number.isSafeInteger(result) && result >= 0 && result <= 2_147_483_647 ? result : 0;
}

export function parseAccessTradeOffers(payload: unknown, campaign: string, now = new Date()): ScrapedVoucher[] {
  const data = (payload as { data?: Offer[] } | null)?.data;
  if (!Array.isArray(data)) return [];
  const vouchers = new Map<string, ScrapedVoucher>();
  for (const offer of data) {
    const domain = offer.domain?.trim().toLowerCase();
    if (domain !== "shopee.vn" && !domain?.endsWith(".shopee.vn")) continue;
    const rawClaim = safeUrl(offer.link);
    const claim = rawClaim && (rawClaim.hostname === "shopee.vn" || rawClaim.hostname.endsWith(".shopee.vn"))
      ? rawClaim
      : new URL("https://shopee.vn/");
    const affiliate = safeUrl(offer.aff_link);
    const startDate = offerDate(offer.start_time, false);
    const endDate = offerDate(offer.end_time, true);
    if (!endDate || endDate <= now || (startDate && startDate > now)) continue;
    if (!Array.isArray(offer.coupons)) continue;
    for (const coupon of offer.coupons) {
      const code = coupon.coupon_code?.trim();
      if (!code || !offer.id) continue;
      const text = `${offer.name || ""} ${coupon.coupon_desc || ""}`.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      const percent = text.match(/giảm\s*([\d.,]+)\s*%/i);
      const freeship = /freeship|miễn phí vận chuyển/i.test(text);
      const discountType = freeship ? "freeship" : percent ? "percent" : "fixed";
      const discountValue = freeship ? 0 : percent ? Number(percent[1].replace(",", ".")) : amountAfter(text, "giảm");
      if ((!freeship && discountValue <= 0) || !Number.isInteger(discountValue) || (percent && discountValue > 100)) continue;
      const discount = freeship ? "FREESHIP" : percent ? `GIẢM ${discountValue}%` : `GIẢM ${discountValue.toLocaleString("vi-VN")}Đ`;
      const id = `accesstrade:${offer.id}:${code}`;
      vouchers.set(id, {
        shopeeVoucherId: id,
        code,
        title: (offer.name || coupon.coupon_desc || discount).replace(/<[^>]*>/g, " ").trim(),
        discount, discountType, discountValue,
        minSpend: amountAfter(text, "(?:đơn tối thiểu|đơn từ|tối thiểu)"),
        maxDiscount: amountAfter(text, "tối đa"),
        campaign, category: null,
        claimUrl: claim.href,
        affiliateUrl: affiliate?.href,
        imageUrl: safeUrl(offer.image)?.href || null,
        startDate, endDate,
        source: "accesstrade",
      });
    }
  }
  return Array.from(vouchers.values());
}

export async function fetchAccessTradeVouchers(campaign: string): Promise<ScrapedVoucher[]> {
  const key = process.env.ACCESSTRADE_API_KEY;
  if (!key) throw new Error("ACCESSTRADE_API_KEY chưa được cấu hình.");
  const vouchers = new Map<string, ScrapedVoucher>();
  for (let page = 1; page <= 3; page += 1) {
    const url = new URL("https://api.accesstrade.vn/v1/offers_informations");
    url.search = new URLSearchParams({ domain: "shopee.vn", status: "1", limit: "100", page: String(page) }).toString();
    const response = await fetch(url, {
      headers: { Authorization: `Token ${key}` },
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`AccessTrade voucher HTTP ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.data)) throw new Error("AccessTrade: cấu trúc dữ liệu voucher không hợp lệ.");
    for (const voucher of parseAccessTradeOffers(payload, campaign)) vouchers.set(voucher.shopeeVoucherId, voucher);
    if (payload.data.length < 100) break;
  }
  return Array.from(vouchers.values());
}
