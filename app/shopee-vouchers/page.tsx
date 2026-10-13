import type { Metadata } from "next";
import ShopeeVouchersPage from "@/src/routes/shopee-vouchers";

export const metadata: Metadata = {
  title: "Voucher Shopee",
  description:
    "Tổng hợp voucher Shopee, mã freeship và mã sale cập nhật mới để nhận trực tiếp trên Shopee.",
  alternates: { canonical: "/shopee-vouchers" },
};

export default function Page() {
  return <ShopeeVouchersPage />;
}
