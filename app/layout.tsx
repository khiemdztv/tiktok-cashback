import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cashback.id.vn"),
  title: "cashback.id.vn — Kiểm tra cashback trước khi mua",
  description: "Khám phá cashback, voucher, cửa hàng và so sánh cách mua tiết kiệm hơn tại cashback.id.vn. Công cụ đổi link Shopee miễn phí, không cần đăng nhập.",
  icons: { icon: "/cashback.id.vn.png", apple: "/cashback.id.vn.png" },
  openGraph: { title: "cashback.id.vn — Kiểm tra cashback trước khi mua", description: "Kiểm tra cashback trước khi mua. Tìm ưu đãi và cách mua sắm tiết kiệm hơn.", siteName: "cashback.id.vn", locale: "vi_VN", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
