import { Suspense } from "react";
import Page from "@/src/routes/index";
export const metadata = {
  title: "Mua sắm thông minh hơn",
  description:
    "Khám phá sản phẩm, voucher Shopee từ nguồn đã kết nối và thông tin cashback tại Việt Nam.",
  alternates: { canonical: "/" },
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
