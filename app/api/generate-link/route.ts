import { NextRequest, NextResponse } from "next/server";
import { buildShopeeAffiliateLink } from "@/lib/shopee-affiliate";
import { fetchShpeeCc } from "@/lib/shpee-cc";

const AFFILIATE_ID = process.env.SHOPEE_AFFILIATE_ID || "";

function createTrackingId() {
  return `cb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function applyTrackingIdToAffiliateLink(link: string, trackingId: string) {
  try {
    const url = new URL(link);
    url.searchParams.set("sub_id", trackingId);
    return url.toString();
  } catch {
    return link;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productUrl } = await req.json();

    if (typeof productUrl !== "string" || !productUrl.trim())
      return NextResponse.json({ error: "Vui lòng nhập link sản phẩm" }, { status: 400 });

    let parsedUrl: URL;
    try { parsedUrl = new URL(productUrl.trim()); }
    catch { return NextResponse.json({ error: "Link sản phẩm không hợp lệ" }, { status: 400 }); }
    if (!['http:', 'https:'].includes(parsedUrl.protocol) || !(parsedUrl.hostname === 'shopee.vn' || parsedUrl.hostname.endsWith('.shopee.vn') || parsedUrl.hostname === 'shope.ee')) {
      return NextResponse.json(
        { error: "Vui lòng nhập link sản phẩm Shopee hợp lệ" },
        { status: 400 }
      );
    }

    // Use shpee.cc API - returns full product info + affiliate link instantly
    const trackingId = createTrackingId();
    const shpeeCcResult = await fetchShpeeCc(productUrl.trim(), AFFILIATE_ID, trackingId);

    if (!shpeeCcResult || !shpeeCcResult.productInfo) {
      return NextResponse.json(
        { error: "Không lấy được thông tin sản phẩm. Vui lòng thử link khác." },
        { status: 400 }
      );
    }

    const p = shpeeCcResult.productInfo;
    const productName = p.productName;
    const productImage = p.imageUrl;
    const productPrice = p.price;
    const productSales = p.sales;
    const productRating = p.rating;
    const shopName = p.shopName;
    const itemId = String(p.itemId);
    const shopIdMatch = p.productLink.match(/\/product\/(\d+)\/(\d+)/);
    const shopId = shopIdMatch ? shopIdMatch[1] : "";

    const rawAffShortUrl =
      shpeeCcResult.affiliateLinks?.[0]?.affiliate_link ||
      buildShopeeAffiliateLink(shopId, itemId, trackingId);
    const affShortUrl = applyTrackingIdToAffiliateLink(rawAffShortUrl, trackingId);

    return NextResponse.json({
      success: true,
      trackingId,
      productName,
      productImage,
      productPrice,
      productSales,
      productRating,
      shopName,
      affShortUrl,
      affLongUrl: affShortUrl,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
