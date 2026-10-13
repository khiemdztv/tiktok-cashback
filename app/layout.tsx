import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cashback.id.vn"),
  title: {
    default: "Cashback — Mua sắm thông minh hơn",
    template: "%s · Cashback",
  },
  description:
    "Tìm cashback, voucher và so sánh chi phí mua sắm online tại Việt Nam. Miễn phí, minh bạch điều kiện và không cần đăng nhập.",
  icons: { icon: "/cashback.id.vn.png", apple: "/cashback.id.vn.png" },
  openGraph: {
    title: "Cashback — Mua sắm thông minh hơn",
    description:
      "Khám phá sản phẩm, voucher và thông tin cashback trước khi thanh toán.",
    siteName: "Cashback",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/cashback.id.vn.png",
        width: 1254,
        height: 1254,
        alt: "cashback.id.vn",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Cashback — Mua sắm thông minh hơn",
    description:
      "Tìm cashback, voucher và so sánh chi phí trước khi thanh toán.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Cashback",
              url: "https://cashback.id.vn",
              email: "admin@cashback.id.vn",
              logo: "https://cashback.id.vn/cashback.id.vn.png",
            }),
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
