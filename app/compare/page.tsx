import { Suspense } from "react";
import Page from "@/src/routes/compare";
export const metadata = { title: "So sánh giá sau cashback & voucher — cashback.id.vn" };
export default function RoutePage() { return <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Đang tải…</div>}><Page /></Suspense>; }
