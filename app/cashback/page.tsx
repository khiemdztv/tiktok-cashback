import { Suspense } from "react";
import Page from "@/src/routes/cashback";
export const metadata = { title: "Tìm cashback — So sánh chương trình hoàn tiền | cashback.id.vn" };
export default function RoutePage() { return <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Đang tải…</div>}><Page /></Suspense>; }
