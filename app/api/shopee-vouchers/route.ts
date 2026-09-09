import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const campaign = params.get("campaign")?.trim();
    const discountType = params.get("type")?.trim();
    const category = params.get("category")?.trim();
    const sort = params.get("sort") || "newest";
    const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 30));
    const where = {
      isActive: true,
      OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
      ...(campaign ? { campaign } : {}),
      ...(discountType ? { discountType } : {}),
      ...(category ? { category: { equals: category, mode: "insensitive" as const } } : {}),
    };
    const orderBy =
      sort === "discount"
        ? [{ discountValue: "desc" as const }, { createdAt: "desc" as const }]
        : sort === "expiring"
          ? [{ endDate: { sort: "asc" as const, nulls: "last" as const } }]
          : [{ createdAt: "desc" as const }];

    const [vouchers, total] = await Promise.all([
      prisma.shopeeVoucher.findMany({ where, orderBy, take: limit }),
      prisma.shopeeVoucher.count({ where }),
    ]);
    const response = { vouchers, total };
    return NextResponse.json(response, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Shopee voucher API error:", error);
    return NextResponse.json(
      { vouchers: [], total: 0, error: "Dữ liệu voucher đang được đồng bộ. Vui lòng quay lại sau ít phút." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
