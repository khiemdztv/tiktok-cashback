import { Suspense } from "react";
import Page from "@/src/routes/compare";
export const metadata = {
  title: "So sánh chi phí mua sắm",
  description:
    "Nhập giá, voucher và cashback đã xác nhận để tính chi phí của nhiều lựa chọn mua hàng.",
  alternates: { canonical: "/compare" },
};
export default function RoutePage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-20 text-muted-foreground">
          Đang tải…
        </div>
      }
    >
      <Page />
    </Suspense>
  );
}
