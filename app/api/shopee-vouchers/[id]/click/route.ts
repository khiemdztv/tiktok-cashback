import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateVoucherCache } from "@/lib/shopee-voucher-cache";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const voucher = await prisma.shopeeVoucher.findFirst({
    where: {
      id: params.id,
      isActive: true,
      OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
    },
    select: { id: true, affiliateUrl: true, usageLimit: true, usageCount: true },
  });
  if (!voucher) return NextResponse.json({ error: "Mã giảm giá không tồn tại hoặc đã hết hạn." }, { status: 404 });
  if (voucher.usageLimit !== null && voucher.usageCount >= voucher.usageLimit) {
    return NextResponse.json({ error: "Mã giảm giá đã hết lượt." }, { status: 410 });
  }

  await prisma.shopeeVoucher.update({
    where: { id: voucher.id },
    data: { usageCount: { increment: 1 } },
  });
  invalidateVoucherCache();
  return NextResponse.json({ affiliateUrl: voucher.affiliateUrl }, { headers: { "Cache-Control": "no-store" } });
}
