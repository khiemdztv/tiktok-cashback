import { Suspense } from "react";
import Page from "@/src/routes/how-it-works";
export const metadata = {
  title: "Cách hoạt động & câu hỏi thường gặp",
  description:
    "Hiểu sự khác nhau giữa giá bán, voucher và cashback, điều kiện ưu đãi và phạm vi sản phẩm.",
  alternates: { canonical: "/how-it-works" },
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
