import { Suspense } from "react";
import Page from "@/src/routes/stores.index";
export const metadata = {
  title: "Thư mục cửa hàng",
  description:
    "Khám phá thông tin và tìm sản phẩm theo cửa hàng, thương hiệu và danh mục.",
  alternates: { canonical: "/stores" },
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
