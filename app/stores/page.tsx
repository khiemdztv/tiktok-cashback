import { Suspense } from "react";
import Page from "@/src/routes/stores.index";
export const metadata = { title: "Khám phá cửa hàng có cashback — Cashback ID" };
export default function RoutePage() { return <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Đang tải…</div>}><Page /></Suspense>; }
