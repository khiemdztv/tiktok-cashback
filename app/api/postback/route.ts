import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const phone = searchParams.get("aff_sub1"); 
  const statusStr = searchParams.get("status"); 
  const payoutStr = searchParams.get("payout") || searchParams.get("commission");

  console.log("AccessTrade Postback GET:", Object.fromEntries(searchParams.entries()));

  if (!phone) {
    return NextResponse.json({ success: false, msg: "Missing aff_sub1 (phone)" });
  }

  const payout = payoutStr ? parseFloat(payoutStr) : undefined;

  // Find the most recent pending order for this phone
  const pendingOrder = await prisma.order.findFirst({
    where: { 
      phone, 
      status: { in: ["created", "pending"] } 
    },
    orderBy: { createdAt: "desc" }, 
  });

  if (!pendingOrder) {
    return NextResponse.json({ success: true, msg: "Không có đơn pending phù hợp" });
  }

  const updateData: any = {};
  if (payout !== undefined && !isNaN(payout)) {
    updateData.commissionAmount = Math.floor(payout);
    updateData.cashbackAmount = Math.floor(payout * 0.8);
  }

  if (statusStr === "1") {
    // Approved
    updateData.status = "paid";
    updateData.paidAt = new Date();
  } else if (statusStr === "2") {
    // Rejected
    updateData.status = "rejected";
  } else if (statusStr === "0") {
    // Temporary/Pending convert from created
    updateData.status = "pending";
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.order.update({
      where: { id: pendingOrder.id },
      data: updateData,
    });
    return NextResponse.json({ success: true, updated: pendingOrder.id, data: updateData });
  }

  return NextResponse.json({ success: true, msg: "Không có cập nhật nào" });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("AccessTrade Postback POST [Raw Body]:", JSON.stringify(body));

    const phone = body.aff_sub1;
    // status: 0 = pending, 1 = approved, 2 = rejected
    const statusStr = body.status?.toString();
    const payoutStr = body.payout?.toString() || body.commission?.toString();

    if (!phone) {
      return NextResponse.json({ success: false, msg: "Missing aff_sub1 in body" });
    }

    const payout = payoutStr ? parseFloat(payoutStr) : undefined;

    // We look for ANY order created by this phone in the last 30 days that hasn't been definitively paid/rejected
    const pendingOrder = await prisma.order.findFirst({
      where: { 
        phone, 
        status: { in: ["created", "pending"] } 
      },
      orderBy: { createdAt: "desc" },
    });

    if (!pendingOrder) {
      console.log("AT Webhook: No matching order found for phone", phone);
      return NextResponse.json({ success: true, msg: "Không có đơn pending phù hợp" });
    }

    const updateData: any = {};
    
    // Always update commission/cashback amounts based on the ACTUAL payout from AccessTrade if it's > 0
    if (payout !== undefined && !isNaN(payout) && payout > 0) {
      updateData.commissionAmount = Math.floor(payout);
      // Giữ lại 80% hoa hồng thực tế cho người dùng
      updateData.cashbackAmount = Math.floor(payout * 0.8);
    }

    if (statusStr === "1") {
      updateData.status = "paid";
      updateData.paidAt = new Date();
    } else if (statusStr === "2") {
      updateData.status = "rejected";
    } else if (statusStr === "0") {
      // AccessTrade temporary order / pending approval
      updateData.status = "pending";
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.order.update({
        where: { id: pendingOrder.id },
        data: updateData,
      });
      console.log(`AT Webhook: Successfully updated order ${pendingOrder.id} to status ${updateData.status}`);
      return NextResponse.json({ success: true, updated: pendingOrder.id, data: updateData });
    }

    return NextResponse.json({ success: true, msg: "Không có cập nhật trạng thái mới" });
  } catch (e) {
    console.error("AT Webhook Error:", e);
    return NextResponse.json({ success: false, error: "Lỗi xử lý webhook JSON" });
  }
}

