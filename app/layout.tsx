import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cashback.id.vn"),
  title: { default: "cashback.id.vn — Mua online có lợi hơn", template: "%s · cashback.id.vn" },
  description: "Tìm cashback, voucher và so sánh chi phí mua sắm online tại Việt Nam. Miễn phí, minh bạch điều kiện và không cần đăng nhập.",
  icons: { icon: "/cashback.id.vn.png", apple: "/cashback.id.vn.png" },
  alternates: { canonical: "/" },
  openGraph: { title: "cashback.id.vn — Mua online có lợi hơn", description: "Một nơi để tìm cashback, voucher và so sánh chi phí trước khi thanh toán.", siteName: "cashback.id.vn", locale: "vi_VN", type: "website", url: "https://cashback.id.vn" },
  twitter: { card: "summary", title: "cashback.id.vn — Mua online có lợi hơn", description: "Tìm cashback, voucher và so sánh chi phí trước khi thanh toán." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "cashback.id.vn",
            url: "https://cashback.id.vn",
            email: "admin@cashback.id.vn",
            logo: "https://cashback.id.vn/cashback.id.vn.png",
          }) }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
