import { Suspense } from "react";
import Page from "@/src/routes/search";
export const metadata = { title: "Tìm kiếm cashback & ưu đãi — Cashback ID" };
export default function RoutePage() { return <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Đang tải…</div>}><Page /></Suspense>; }
