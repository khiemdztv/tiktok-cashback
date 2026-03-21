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
  let pendingOrder = await prisma.order.findFirst({
    where: { 
      phone, 
      status: { in: ["created", "pending"] } 
    },
    orderBy: { createdAt: "desc" }, 
  });

  if (!pendingOrder) {
    pendingOrder = await prisma.order.create({
      data: {
        phone,
        status: "created",
        originalUrl: "Link ngoài web",
        affUrl: "N/A",
        affShortUrl: "N/A",
        productName: "Đơn hệ thống tự động ghi nhận",
        productImage: "",
        productPrice: 0,
        commissionAmount: 0,
        commissionRate: 0,
        cashbackAmount: 0,
        walletType: "momo", 
      }
    });
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

    // 2. Nếu không có ở URL, thử parse body (JSON hoặc Form-urlencoded)
    if (!phone) {
      try {
        const bodyText = await req.text(); // Đọc raw text
        if (bodyText) {
          let body: Record<string, any> = {};
          if (bodyText.trim().startsWith("{")) {
            body = JSON.parse(bodyText);
          } else {
            // AccessTrade thường gửi x-www-form-urlencoded
            const params = new URLSearchParams(bodyText);
            body = Object.fromEntries(params.entries());
          }
          console.log("AccessTrade Postback POST [Body Parsed]:", JSON.stringify(body));
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

    let pendingOrder = await prisma.order.findFirst({
      where: { 
        phone, 
        status: { in: ["created", "pending"] } 
      },
      orderBy: { createdAt: "desc" },
    });

    if (!pendingOrder) {
      console.log("AT Webhook: Auto-creating order for phone", phone);
      pendingOrder = await prisma.order.create({
        data: {
          phone,
          status: "created",
          originalUrl: "Link ngoài web",
          affUrl: "N/A",
          affShortUrl: "N/A",
          productName: "Đơn hệ thống tự động ghi nhận",
          productImage: "",
          productPrice: 0,
          commissionAmount: 0,
          commissionRate: 0,
          cashbackAmount: 0,
          walletType: "momo", 
        }
      });
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

