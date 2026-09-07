import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, markOrderPaid, updateOrderAffLink, markOrderRejected } from "@/lib/db";
import { sendTelegramNotification, formatOrderPaidMessage } from "@/lib/telegram";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const admin = req.nextUrl.searchParams.get("admin");

  if (admin === "1") {
    const password = req.headers.get("x-admin-password");
    if (password !== process.env.ADMIN_PASSWORD)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getAllOrders());
  }

  return NextResponse.json({ error: "Chức năng tra cứu số điện thoại đã ngừng hoạt động." }, { status: 410 });
}

export async function PATCH(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, action, affUrl, cashbackAmount } = await req.json();

  if (action === "set_link") {
    if (!affUrl) return NextResponse.json({ error: "Thiếu link affiliate" }, { status: 400 });
    await updateOrderAffLink(id, affUrl, cashbackAmount || undefined);
    return NextResponse.json({ success: true });
  }

  if (action === "reject") {
    const ok = await markOrderRejected(id);
    return ok
      ? NextResponse.json({ success: true })
      : NextResponse.json({ error: "Không tìm thấy đơn" }, { status: 404 });
  }

  // Default: mark as paid
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Không tìm thấy đơn" }, { status: 404 });

  const ok = await markOrderPaid(id);
  if (ok) {
    sendTelegramNotification(
      formatOrderPaidMessage({
        phone: order.phone,
        cashbackAmount: order.cashbackAmount,
        productName: order.productName,
      })
    ).catch(() => {});
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Lỗi cập nhật" }, { status: 500 });
}
