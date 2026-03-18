import { NextRequest, NextResponse } from "next/server";
import { getOrdersByPhone, getAllOrders, markOrderPaid } from "@/lib/db";

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");
  const admin = req.nextUrl.searchParams.get("admin");

  if (admin === "1") {
    const password = req.headers.get("x-admin-password");
    if (password !== process.env.ADMIN_PASSWORD)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getAllOrders());
  }

  if (!phone) return NextResponse.json({ error: "Thiếu số điện thoại" }, { status: 400 });
  return NextResponse.json(await getOrdersByPhone(phone));
}

export async function PATCH(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const ok = await markOrderPaid(id);
  return ok
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Không tìm thấy đơn" }, { status: 404 });
}
