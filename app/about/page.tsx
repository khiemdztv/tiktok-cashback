import { Suspense } from "react";
import Page from "@/src/routes/about";
export const metadata = {
  title: "Về sản phẩm",
  description:
    "Tìm hiểu Cashback, một sản phẩm giai đoạn đầu xây dựng trải nghiệm khám phá ưu đãi cho người Việt.",
  alternates: { canonical: "/about" },
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
