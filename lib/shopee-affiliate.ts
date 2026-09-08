import { parseShopeeUrl, expandShopeeUrl } from "./shopee-product";

function getAffiliateId() {
  return process.env.SHOPEE_AFFILIATE_ID || "";
}

export function isShopeeUrl(value: string): boolean {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return hostname === "shopee.vn" || hostname.endsWith(".shopee.vn") || hostname === "s.shopee.vn";
  } catch {
    return false;
  }
}

export function buildShopeeCampaignAffiliateLink(originLink: string, subId?: string): string {
  if (!isShopeeUrl(originLink)) throw new Error("Đường dẫn nhận mã phải thuộc Shopee Việt Nam.");
  const affiliateId = getAffiliateId();
  if (!affiliateId) return originLink;

  const params = new URLSearchParams({ origin_link: originLink, affiliate_id: affiliateId });
  if (subId) params.set("sub_id", subId);
  return `https://s.shopee.vn/an_redir?${params.toString()}`;
}

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
  return buildShopeeCampaignAffiliateLink(originLink, subId);
}

export async function convertToAffiliateLink(
  productUrl: string,
  subId?: string
): Promise<{ shortLink: string; longLink: string } | null> {
  if (!getAffiliateId()) {
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
