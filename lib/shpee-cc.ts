/**
 * Wrapper around short.shpee.cc - a public API that:
 * 1. Resolves any Shopee URL (short or long)
 * 2. Returns full product info (name, image, price, sales, rating, commission)
 * 3. Generates affiliate links for any affiliate_id we provide
 *
 * This is the same API used by hotdeal.voucher.io.vn and similar tools.
 */

export interface ShpeeCcProduct {
  itemId: number;
  productName: string;
  shopName: string;
  price: number;
  sales: number;
  imageUrl: string;
  productLink: string;
  rating: string;
  commission: number;
  capAfterRate: number;
}

export interface ShpeeCcResponse {
  success: boolean;
  url: string;
  affiliateLinks: Array<{ affiliate_id: string; affiliate_link: string }>;
  productInfo: ShpeeCcProduct;
}

export async function fetchShpeeCc(
  productUrl: string,
  affiliateId: string,
  subId?: string
): Promise<ShpeeCcResponse | null> {
  try {
    const params = new URLSearchParams({
      url: productUrl,
      affiliate_ids: affiliateId,
    });
    if (subId) params.set("sub_ids", subId);

    const res = await fetch(`https://short.shpee.cc/?${params.toString()}`, {
      method: "GET",
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest",
        referer: "https://short.shpee.cc/",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.error("shpee.cc error:", res.status);
      return null;
    }

    const json = (await res.json()) as ShpeeCcResponse;
    if (!json.success) return null;
    return json;
  } catch (e) {
    console.error("shpee.cc fetch error:", e);
    return null;
  }
}
