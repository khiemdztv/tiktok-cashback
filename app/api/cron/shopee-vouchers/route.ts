import { NextRequest, NextResponse } from "next/server";
import {
  activeShopeeCampaigns,
  deactivateExpiredVouchers,
  syncShopeeCampaign,
} from "@/lib/shopee-voucher-scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

let running = false;

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  // Vercel uses CRON_SECRET; an authenticated operator can verify a deployment
  // with the existing server-only admin credential without adding an admin UI.
  const isAuthorized = [process.env.CRON_SECRET, process.env.ADMIN_PASSWORD]
    .some((secret) => Boolean(secret) && authorization === `Bearer ${secret}`);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (request.nextUrl.searchParams.get("diagnostics") === "1") {
    const accessTradeKey = process.env.ACCESSTRADE_API_KEY;
    let provider: Record<string, unknown> = { configured: Boolean(accessTradeKey) };
    if (accessTradeKey) {
      try {
        const response = await fetch("https://api.accesstrade.vn/v1/offers_informations?domain=shopee.vn&status=1&limit=3", {
          headers: { Authorization: `Token ${accessTradeKey}` },
          signal: AbortSignal.timeout(15_000),
          cache: "no-store",
        });
        provider = { ...provider, status: response.status };
        if (response.ok) {
          const payload = await response.json();
          provider.fields = Object.keys(payload);
          const offers = Array.isArray(payload.data) ? payload.data : [];
          provider.count = offers.length;
          // Only public offer fields; never echo credentials or raw provider errors.
          provider.samples = offers.slice(0, 3).map((offer: Record<string, unknown>) => ({
            fields: Object.keys(offer), name: offer.name, coupons: offer.coupons,
            start_time: offer.start_time, end_time: offer.end_time,
          }));
        }
      } catch {
        provider.error = "Provider request failed";
      }
    }
    return NextResponse.json({
      revision: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
      scheduleConfigured: Boolean(process.env.CRON_SECRET),
      accessTrade: provider,
    }, { headers: { "Cache-Control": "no-store" } });
  }
  if (running) return NextResponse.json({ error: "Đồng bộ voucher đang chạy." }, { status: 409 });

  running = true;
  const startedAt = new Date();
  try {
    const campaigns = activeShopeeCampaigns(startedAt);
    const results = [];
    for (const campaign of campaigns) {
      try {
        results.push(await syncShopeeCampaign(campaign));
      } catch (error) {
        results.push({ campaign, error: error instanceof Error ? error.message : "Không thể scrape campaign." });
      }
    }
    const deactivated = await deactivateExpiredVouchers();
    const successful = results.filter((result) => !("error" in result) && result.found > 0).length;
    return NextResponse.json({
      success: successful > 0,
      revision: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
      scheduleConfigured: Boolean(process.env.CRON_SECRET),
      startedAt,
      finishedAt: new Date(),
      campaigns,
      results,
      deactivated,
    }, { status: successful > 0 ? 200 : 502 });
  } finally {
    running = false;
  }
}
