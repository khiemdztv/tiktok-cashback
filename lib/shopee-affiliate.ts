import { parseShopeeUrl, expandShopeeUrl } from "./shopee-product";

const AFFILIATE_ID = process.env.SHOPEE_AFFILIATE_ID || "";

/**
 * Build Shopee affiliate link using Shopee's official an_redir endpoint.
 * Format: https://s.shopee.vn/an_redir?origin_link=URL&affiliate_id=ID&sub_id=SUB
 * No API/cookie needed.
 */
export function buildShopeeAffiliateLink(
  shopId: string | number,
  itemId: string | number,
  subId?: string
): string {
  const originLink = `https://shopee.vn/product/${shopId}/${itemId}`;
  const params = new URLSearchParams({
    origin_link: originLink,
    affiliate_id: AFFILIATE_ID,
  });
  if (subId) params.set("sub_id", subId);
  return `https://s.shopee.vn/an_redir?${params.toString()}`;
}

export async function convertToAffiliateLink(
  productUrl: string,
  subId?: string
): Promise<{ shortLink: string; longLink: string } | null> {
  if (!AFFILIATE_ID) {
    console.error("SHOPEE_AFFILIATE_ID not configured");
    return null;
  }
  try {
    const expandedUrl = await expandShopeeUrl(productUrl);
    const parsed = parseShopeeUrl(expandedUrl);
    if (!parsed) {
      console.error("Cannot parse shopId/itemId from URL:", expandedUrl);
      return null;
    }
    const link = buildShopeeAffiliateLink(parsed.shopId, parsed.itemId, subId);
    return { shortLink: link, longLink: link };
  } catch (e) {
    console.error("Shopee Affiliate convert error:", e);
    return null;
  }
}
