import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hoàn tiền TikTok Shop",
  description: "Hoàn tiền tiếp thị liên kết TikTok Shop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-white min-h-screen">{children}</body>
    </html>
  );
}
