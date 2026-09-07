export interface ShopeeProductInfo {
  name: string;
  image: string;
  price: number;       // VND (lowest)
  priceMax: number;    // VND (highest, for range)
  shopId: number;
  itemId: number;
  ratingStar: number;
  sold: number;
  stock: number;
}

/**
 * Parse shopId and itemId from Shopee URL
 * Formats:
 * - https://shopee.vn/product-name-i.SHOPID.ITEMID
 * - https://shopee.vn/product-name-i.SHOPID.ITEMID?sp_atk=...
 */
export function parseShopeeUrl(url: string): { shopId: number; itemId: number } | null {
  try {
    // Format 1: /product-name-i.SHOPID.ITEMID (standard product URL)
    let match = url.match(/i\.(\d+)\.(\d+)/);
    if (match) {
      return { shopId: parseInt(match[1]), itemId: parseInt(match[2]) };
    }
    // Format 2: /opaanlp/SHOPID/ITEMID (affiliate landing path)
    match = url.match(/\/(?:opaanlp|product|universal-link)\/(\d+)\/(\d+)/);
    if (match) {
      return { shopId: parseInt(match[1]), itemId: parseInt(match[2]) };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Expand short Shopee URLs (s.shopee.vn, shope.ee) to full URL
 */
export async function expandShopeeUrl(shortUrl: string): Promise<string> {
  if (shortUrl.includes("s.shopee.vn") || shortUrl.includes("shope.ee")) {
    try {
      const res = await fetch(shortUrl, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(8000),
      });
      if (res.url && res.url !== shortUrl) {
        return res.url;
      }
    } catch (e) {
      console.log("URL expand failed:", e);
    }
  }
  return shortUrl;
}

/**
 * Fetch product info from Shopee. Tries multiple strategies in order:
 * 1. Quick API v4 call (often blocked by anti-bot)
 * 2. OG tag scraping
 * 3. Puppeteer (slow ~3-5s, but reliable)
 */
function isGenericName(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    !name ||
    name === "Sản phẩm Shopee" ||
    lower.includes("shopee việt nam") ||
    lower.includes("mua và bán") ||
    lower.includes("ứng dụng di động") ||
    lower.startsWith("shopee |")
  );
}

export async function fetchShopeeProduct(
  shopId: number,
  itemId: number,
  originalUrl?: string
): Promise<ShopeeProductInfo | null> {
  // Strategy 1: Try direct API first (fast, but usually 403)
  const apiResult = await tryApiV4(shopId, itemId);
  if (apiResult && !isGenericName(apiResult.name)) return apiResult;

  // Strategy 2: Try OG scrape (also fast)
  const scrapeResult = await tryScrapeOG(shopId, itemId);
  if (scrapeResult && !isGenericName(scrapeResult.name)) return scrapeResult;

  // Strategy 3: Puppeteer (slow but reliable)
  try {
    const { scrapeShopeeProduct } = await import("./shopee-scraper");
    const puppeteer = await scrapeShopeeProduct(shopId, itemId, originalUrl);
    if (puppeteer && !isGenericName(puppeteer.name)) {
      return {
        name: puppeteer.name,
        image: puppeteer.image,
        price: puppeteer.price,
        priceMax: puppeteer.priceMax,
        shopId, itemId,
        ratingStar: puppeteer.ratingStar,
        sold: puppeteer.sold,
        stock: 0,
      };
    }
  } catch (e) {
    console.error("Puppeteer fallback failed:", e);
  }

  return null;
}

async function tryApiV4(shopId: number, itemId: number): Promise<ShopeeProductInfo | null> {
  try {
    const res = await fetch(
      `https://shopee.vn/api/v4/item/get?shopid=${shopId}&itemid=${itemId}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
          "Accept": "application/json",
          "Accept-Language": "vi-VN,vi;q=0.9",
          "Referer": `https://shopee.vn/product/${shopId}/${itemId}`,
          "X-Requested-With": "XMLHttpRequest",
          "X-API-SOURCE": "pc",
          "X-Shopee-Language": "vi",
        },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      console.log("Shopee API v4 failed:", res.status);
      return null;
    }

    const json = await res.json();
    const item = json?.data;
    if (!item) return null;

    const price = Math.floor((item.price || item.price_min || 0) / 100000);
    const priceMax = Math.floor((item.price_max || item.price || 0) / 100000);
    const imageHash = item.image || (item.images && item.images[0]) || "";
    const image = imageHash ? `https://down-vn.img.susercontent.com/file/${imageHash}` : "";

    return {
      name: item.name || "Sản phẩm Shopee",
      image, price, priceMax, shopId, itemId,
      ratingStar: item.item_rating?.rating_star || 0,
      sold: item.sold || item.historical_sold || 0,
      stock: item.stock || 0,
    };
  } catch (e) {
    console.log("Shopee API v4 error:", e);
    return null;
  }
}

async function tryScrapeOG(shopId: number, itemId: number): Promise<ShopeeProductInfo | null> {
  try {
    const res = await fetch(
      `https://shopee.vn/product/${shopId}/${itemId}`,
      {
        headers: {
          // Facebook bot UA gets pre-rendered OG meta tags
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "vi-VN,vi;q=0.9",
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) return null;

    const html = await res.text();

    // Extract OG meta tags
    const titleMatch = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i)
                    || html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:title["']/i);
    const imageMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i)
                    || html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i);
    const descMatch = html.match(/<meta\s+(?:property|name)=["']og:description["']\s+content=["']([^"']+)["']/i)
                    || html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:description["']/i);

    const name = titleMatch?.[1]?.trim() || "Sản phẩm Shopee";
    const image = imageMatch?.[1]?.trim() || "";

    // Try to extract price from description (e.g. "Giá: 250.000 VND")
    let price = 0;
    if (descMatch?.[1]) {
      const priceMatch = descMatch[1].match(/(\d{1,3}(?:[.,]\d{3})+|\d+)\s*(?:VND|đ|vnđ)/i);
      if (priceMatch) {
        price = parseInt(priceMatch[1].replace(/[.,]/g, "")) || 0;
      }
    }

    if (!name || name === "Sản phẩm Shopee") {
      return null; // No useful info extracted
    }

    return {
      name: name.replace(/\s*\|\s*Shopee.*$/, "").slice(0, 200),
      image, price, priceMax: price, shopId, itemId,
      ratingStar: 0, sold: 0, stock: 0,
    };
  } catch (e) {
    console.log("Shopee OG scrape error:", e);
    return null;
  }
}
