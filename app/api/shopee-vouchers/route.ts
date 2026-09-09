import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getVoucherCache, setVoucherCache } from "@/lib/shopee-voucher-cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const campaign = params.get("campaign")?.trim();
    const discountType = params.get("type")?.trim();
    const category = params.get("category")?.trim();
    const search = params.get("q")?.trim().slice(0, 100);
    const sort = params.get("sort") || "newest";
    const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 30));
    const cacheKey = [search || "", campaign || "", discountType || "", category || "", sort, limit].join("|");
    const cached = getVoucherCache<{ vouchers: unknown[]; total: number }>(cacheKey);
    if (cached) return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });

    const where: Prisma.ShopeeVoucherWhereInput = {
      isActive: true,
      AND: [
        { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
        ...(search ? [{
          OR: [
            { code: { contains: search, mode: "insensitive" as const } },
            { title: { contains: search, mode: "insensitive" as const } },
            { discount: { contains: search, mode: "insensitive" as const } },
          ],
        }] : []),
      ],
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
    setVoucherCache(cacheKey, response);
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60", "X-Cache": "MISS" },
    });
  } catch (error) {
    console.error("Shopee voucher API error:", error);
    return NextResponse.json(
      { vouchers: [], total: 0, error: "Dữ liệu voucher đang được đồng bộ. Vui lòng quay lại sau ít phút." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
