import { Suspense } from "react";
import Page from "@/src/routes/search";
export const metadata = {
  title: "Tìm sản phẩm & cửa hàng",
  description:
    "Tìm sản phẩm từ các nguồn liên quan, kiểm tra giá và đối chiếu lựa chọn trước khi mua.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
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
