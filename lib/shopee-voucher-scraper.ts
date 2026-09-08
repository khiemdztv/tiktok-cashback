import type { Page } from "puppeteer";
import { createHash } from "crypto";
import { prisma } from "./prisma";
import { buildShopeeCampaignAffiliateLink, isShopeeUrl } from "./shopee-affiliate";
import { getShopeeBrowser } from "./shopee-scraper";
import { invalidateVoucherCache } from "./shopee-voucher-cache";

export const SHOPEE_CAMPAIGN_URLS: Record<string, string> = {
  "hang-ngay": "https://shopee.vn/m/ma-giam-gia",
  "9-9": "https://shopee.vn/m/9-9",
  "10-10": "https://shopee.vn/m/10-10",
  "11-11": "https://shopee.vn/m/11-11",
  "12-12": "https://shopee.vn/m/12-12",
  "flash-sale": "https://shopee.vn/flash_sale",
};

export type ScrapedVoucher = {
  shopeeVoucherId: string;
  code: string | null;
  title: string;
  discount: string;
  discountValue: number;
  discountType: "fixed" | "percent" | "freeship";
  minSpend: number;
  maxDiscount: number;
  campaign: string;
  category: string | null;
  claimUrl: string;
  imageUrl: string | null;
  endDate: Date | null;
};

const moneyNumber = (text: string) => {
  const value = text.replace(/[^\d]/g, "");
  return value ? Number(value) : 0;
};

function parseEndDate(text: string): Date | null {
  const match = text.match(/(?:hạn|đến|hết hạn)\s*(?:dùng)?\s*[:：]?\s*(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?/i);
  if (!match) return null;
  const now = new Date();
  let year = match[3] ? Number(match[3]) : now.getFullYear();
  if (year < 100) year += 2000;
  const month = String(Number(match[2])).padStart(2, "0");
  const day = String(Number(match[1])).padStart(2, "0");
  const date = new Date(`${year}-${month}-${day}T23:59:59+07:00`);
  if (!match[3] && date.getTime() < now.getTime() - 86_400_000) date.setUTCFullYear(year + 1);
  return Number.isNaN(date.getTime()) ? null : date;
}

const campaignDates: Record<string, [number, number]> = {
  "9-9": [9, 9], "10-10": [10, 10], "11-11": [11, 11], "12-12": [12, 12],
};

function vietnamDateParts(now = new Date()) {
  const shifted = new Date(now.getTime() + 7 * 3_600_000);
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate() };
}

function campaignEndDate(campaign: string, now = new Date()) {
  const saleDate = campaignDates[campaign];
  if (!saleDate) return null;
  const current = vietnamDateParts(now);
  let year = current.year;
  const todayNumber = Date.UTC(current.year, current.month - 1, current.day);
  let campaignNumber = Date.UTC(year, saleDate[0] - 1, saleDate[1]);
  if (campaignNumber < todayNumber - 4 * 86_400_000) {
    year += 1;
    campaignNumber = Date.UTC(year, saleDate[0] - 1, saleDate[1]);
  }
  return new Date(Date.UTC(year, saleDate[0] - 1, saleDate[1], 16, 59, 59));
}

export function activeShopeeCampaigns(now = new Date()) {
  const current = vietnamDateParts(now);
  const todayNumber = Date.UTC(current.year, current.month - 1, current.day);
  const campaignSlugs = Object.entries(campaignDates).flatMap(([slug, [month, day]]) => {
    const distance = Math.abs(Date.UTC(current.year, month - 1, day) - todayNumber) / 86_400_000;
    return distance <= 3 ? [slug] : [];
  });
  return ["hang-ngay", "flash-sale", ...campaignSlugs];
}

function parseVoucherText(rawText: string, href: string, campaign: string, sourceId?: string): ScrapedVoucher | null {
  const text = rawText.replace(/\s+/g, " ").trim();
  if (text.length < 8 || !/(giảm|freeship|miễn phí vận chuyển|voucher|₫|%)/i.test(text)) return null;

  const percent = text.match(/giảm\s*(\d{1,2})\s*%/i);
  const fixed = text.match(/giảm\s*(?:đến|tối đa)?\s*([\d.,]+)\s*(k|₫|đ|vnd)/i);
  const minSpend = text.match(/(?:đơn|min(?:imum)?)[^\d]{0,20}([\d.,]+)\s*(k|₫|đ|vnd)/i);
  const maxDiscount = text.match(/(?:tối đa|max)[^\d]{0,12}([\d.,]+)\s*(k|₫|đ|vnd)/i);
  const freeship = /(freeship|miễn phí vận chuyển)/i.test(text);
  const valueWithUnit = (match: RegExpMatchArray | null) => {
    if (!match) return 0;
    const value = moneyNumber(match[1]);
    return match[2]?.toLowerCase() === "k" ? value * 1000 : value;
  };

  const discountType = freeship ? "freeship" : percent ? "percent" : "fixed";
  const discountValue = freeship ? 0 : percent ? Number(percent[1]) : valueWithUnit(fixed);
  const discount = freeship ? "FREESHIP" : percent ? `GIẢM ${percent[1]}%` : fixed ? `GIẢM ${fixed[1]}${fixed[2].toUpperCase()}` : "MÃ SHOPEE";
  const codeMatch = text.match(/(?:mã|code)\s*[:：]?\s*([A-Z0-9]{4,20})/i);
  const title = text.slice(0, 180);
  const claimUrl = isShopeeUrl(href) ? href : SHOPEE_CAMPAIGN_URLS[campaign];
  const shopeeVoucherId = sourceId || createHash("sha1").update(`${campaign}|${title}|${claimUrl}`).digest("hex");

  return {
    shopeeVoucherId,
    code: codeMatch?.[1]?.toUpperCase() || null,
    title,
    discount,
    discountValue,
    discountType,
    minSpend: valueWithUnit(minSpend),
    maxDiscount: valueWithUnit(maxDiscount),
    campaign,
    category: null,
    claimUrl,
    imageUrl: null,
    endDate: parseEndDate(text),
  };
}

export async function parseVoucherCards(page: Page, campaign = "hang-ngay"): Promise<ScrapedVoucher[]> {
  const rawCards = await page.evaluate(() => {
    const selectors = [
      "[data-voucher-id]",
      "[data-campaign-voucher-id]",
      '[class*="voucher"]',
      '[class*="Voucher"]',
    ];
    const elements = Array.from(document.querySelectorAll(selectors.join(",")));
    return elements.slice(0, 300).map((element) => {
      const link = element.closest("a") || element.querySelector("a");
      const image = element.querySelector("img");
      return {
        text: (element as HTMLElement).innerText || element.textContent || "",
        href: link instanceof HTMLAnchorElement ? link.href : window.location.href,
        id:
          element.getAttribute("data-voucher-id") ||
          element.getAttribute("data-campaign-voucher-id") ||
          undefined,
        image: image?.getAttribute("src") || image?.getAttribute("data-src") || undefined,
      };
    });
  });

  const seen = new Set<string>();
  return rawCards.flatMap((raw) => {
    const parsed = parseVoucherText(raw.text, raw.href, campaign, raw.id);
    if (!parsed || seen.has(parsed.shopeeVoucherId)) return [];
    seen.add(parsed.shopeeVoucherId);
    if (raw.image?.startsWith("http")) parsed.imageUrl = raw.image;
    return [parsed];
  });
}

export async function scrapeShopeeVouchers(campaignSlug = "hang-ngay"): Promise<ScrapedVoucher[]> {
  const campaignUrl = SHOPEE_CAMPAIGN_URLS[campaignSlug];
  if (!campaignUrl) throw new Error("Campaign không được hỗ trợ.");

  const browser = await getShopeeBrowser();
  const page = await browser.newPage();
  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    );
    await page.setViewport({ width: 1440, height: 1200 });
    await page.goto(campaignUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    for (let index = 0; index < 5; index += 1) {
      await page.evaluate(() => window.scrollBy(0, Math.max(window.innerHeight, 900)));
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
    return parseVoucherCards(page, campaignSlug);
  } finally {
    await page.close().catch(() => undefined);
  }
}

export async function saveScrapedVouchers(vouchers: ScrapedVoucher[]) {
  let added = 0;
  let updated = 0;
  for (const voucher of vouchers) {
    const existing = await prisma.shopeeVoucher.findUnique({
      where: { shopeeVoucherId: voucher.shopeeVoucherId },
      select: { id: true },
    });
    const data = {
      ...voucher,
      endDate: voucher.endDate || campaignEndDate(voucher.campaign),
      affiliateUrl: buildShopeeCampaignAffiliateLink(voucher.claimUrl, `voucher-${voucher.campaign}`),
      source: "scraper",
      isActive: true,
    };
    await prisma.shopeeVoucher.upsert({
      where: { shopeeVoucherId: voucher.shopeeVoucherId },
      create: data,
      update: data,
    });
    existing ? updated += 1 : added += 1;
  }
  invalidateVoucherCache();
  return { added, updated };
}

export async function syncShopeeCampaign(campaign: string) {
  const vouchers = await scrapeShopeeVouchers(campaign);
  const saved = await saveScrapedVouchers(vouchers);
  let removed = 0;
  if (vouchers.length > 0) {
    const currentIds = vouchers.map((voucher) => voucher.shopeeVoucherId);
    const result = await prisma.shopeeVoucher.updateMany({
      where: {
        campaign,
        source: "scraper",
        isActive: true,
        shopeeVoucherId: { notIn: currentIds },
      },
      data: { isActive: false },
    });
    removed = result.count;
  }
  return { campaign, found: vouchers.length, ...saved, removed };
}

export async function deactivateExpiredVouchers() {
  const result = await prisma.shopeeVoucher.updateMany({
    where: { isActive: true, endDate: { lt: new Date() } },
    data: { isActive: false },
  });
  if (result.count) invalidateVoucherCache();
  return result.count;
}
