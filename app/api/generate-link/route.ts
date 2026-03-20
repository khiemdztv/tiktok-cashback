import { NextRequest, NextResponse } from "next/server";
import { addOrder } from "@/lib/db";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { productUrl, phone, walletType, bankAccount } = await req.json();

    if (!productUrl || !phone || !walletType)
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });

    const apiKey = process.env.ACCESSTRADE_API_KEY;
    const bodyArgs: any = { product_url: productUrl };
    if (phone) {
      bodyArgs.aff_sub1 = phone;
      bodyArgs.sub1 = phone;
      bodyArgs.utm_source = phone;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout

    let res;
    try {
      res = await fetch("https://api.accesstrade.vn/v2/tiktokshop_product_feeds/create_link", {
        method: "POST",
        headers: {
          authorization: `Token ${apiKey}`,
          "content-type": "application/json",
          origin: "https://pub2.accesstrade.vn",
          referer: "https://pub2.accesstrade.vn/",
        },
        body: JSON.stringify(bodyArgs),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      if (fetchError.name === "AbortError") {
        return NextResponse.json({ error: "AccessTrade phản hồi quá chậm, vui lòng thử lại." }, { status: 504 });
      }
      throw fetchError;
    }


    const json = await res.json();
    console.log("AT status:", res.status);
    console.log("AT response:", JSON.stringify(json));

    if (!json.status || !json.data)
      return NextResponse.json({ error: "Không thể tạo link. Vui lòng kiểm tra lại link sản phẩm." }, { status: 400 });

    const d = json.data;
    const rawCommissionAmount = parseInt(d.product_commission?.amount || "0");
    const commissionAmount = Math.floor(rawCommissionAmount * 0.648);
    const cashbackAmount = Math.floor(commissionAmount * 0.65);

    const order = await addOrder({
      phone,
      walletType,
      bankAccount,
      originalUrl: productUrl,
      affUrl: d.aff_url,
      affShortUrl: d.aff_short_url,
      productName: d.product_name || "Sản phẩm TikTok Shop",
      productImage: d.product_image || "",
      productPrice: parseInt(d.product_price?.minimum_amount || "0"),
      commissionAmount,
      commissionRate: d.product_commission?.rate || 0,
      cashbackAmount,
    });

    return NextResponse.json({
      affUrl: d.aff_url,
      affShortUrl: d.aff_short_url,
      productName: d.product_name,
      productImage: d.product_image,
      productPrice: parseInt(d.product_price?.minimum_amount || "0"),
      commissionAmount,
      commissionRate: d.product_commission?.rate || 0,
      cashbackAmount,
      orderId: order.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}