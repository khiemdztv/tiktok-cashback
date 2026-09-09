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
