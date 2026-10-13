import { Suspense } from "react";
import Page from "@/src/routes/vouchers";
export const metadata = {
  title: "Voucher & mã giảm giá",
  description:
    "Khám phá voucher Shopee từ nguồn đã kết nối. Kiểm tra điều kiện áp dụng trước khi mua.",
  alternates: { canonical: "/vouchers" },
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
