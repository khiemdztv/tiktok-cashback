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
    // 1. Lấy parameters từ URL (ưu tiên)
    const searchParams = req.nextUrl.searchParams;
    let phone = searchParams.get("aff_sub1"); 
    let statusStr = searchParams.get("status"); 
    let payoutStr = searchParams.get("payout") || searchParams.get("commission");

    // 2. Nếu không có ở URL, thử parse body (JSON)
    if (!phone) {
      try {
        const bodyText = await req.text(); // Đọc text trước để tránh crash nếu empty
        if (bodyText) {
          const body = JSON.parse(bodyText);
          console.log("AccessTrade Postback POST [Raw Body]:", bodyText);
          phone = phone || body.aff_sub1;
          statusStr = statusStr || body.status?.toString();
          payoutStr = payoutStr || body.payout?.toString() || body.commission?.toString();
        }
      } catch (e) {
        console.log("AT Webhook Body Parse Error but continuing: ", e);
      }
    } else {
      console.log("AccessTrade Postback POST [URL Params]:", Object.fromEntries(searchParams.entries()));
    }

    if (!phone) {
      return NextResponse.json({ success: false, msg: "Missing aff_sub1" });
    }

    const payout = payoutStr ? parseFloat(payoutStr) : undefined;

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
      // Hiển thị 80% nhưng thực tế chia 65%
      updateData.cashbackAmount = Math.floor(payout * 0.65);
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

