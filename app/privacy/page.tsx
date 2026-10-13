import { Suspense } from "react";
import Page from "@/src/routes/privacy";
export const metadata = {
  title: "Quyền riêng tư",
  description:
    "Thông tin về dữ liệu khi sử dụng Cashback và kênh liên hệ quyền riêng tư.",
  alternates: { canonical: "/privacy" },
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
