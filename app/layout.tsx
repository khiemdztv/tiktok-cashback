import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cashback.id.vn - Hoàn tiền mua sắm online",
  description: "Hoàn tiền lên đến 6% khi mua sắm trên TikTok Shop & Shopee. Minh bạch, nhanh chóng, dễ sử dụng.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-white min-h-screen">{children}</body>
    </html>
  );
}
