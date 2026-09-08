import type { Metadata } from "next";
import ShopeeVouchersPage from "@/src/routes/shopee-vouchers";

export const metadata: Metadata = {
  title: "Mã giảm giá Shopee mới nhất — cashback.id.vn",
  description: "Tổng hợp voucher Shopee, mã freeship và mã sale cập nhật mới để nhận trực tiếp trên Shopee.",
};

export default function Page() {
  return <ShopeeVouchersPage />;
}
