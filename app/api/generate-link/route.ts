import { NextRequest, NextResponse } from "next/server";
import { addOrder } from "@/lib/db";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { productUrl, phone, walletType, bankAccount } = await req.json();

    if (!productUrl || !phone || !walletType)
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });

    const apiKey = process.env.ACCESSTRADE_API_KEY;
    
    // Expand rút gọn vt.tiktok.com trước khi gửi cho AT
    let resolvedUrl = productUrl;
    if (productUrl.includes("vt.tiktok.com") || productUrl.includes("tiktok.com/t/")) {
      try {
        const expandRes = await fetch(productUrl, {
          method: "GET",
          redirect: "follow",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          },
          signal: AbortSignal.timeout(8000),
        });
        // Lấy URL sau khi redirect
        if (expandRes.url && expandRes.url !== productUrl) {
          // Chỉ lấy phần path sạch, bỏ token phiên đăng nhập
          const clean = new URL(expandRes.url);
          resolvedUrl = `${clean.origin}${clean.pathname}`;
          console.log("Expanded URL:", resolvedUrl);
        }
      } catch (e) {
        console.log("URL expand failed, using original:", e);
      }
    }

    const bodyArgs: any = { product_url: resolvedUrl };

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