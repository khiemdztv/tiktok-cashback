import { Suspense } from "react";
import Page from "@/src/routes/index";
export const metadata = { title: "Cashback ID — Kiểm tra cashback trước khi mua" };
export default function RoutePage() { return <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Đang tải…</div>}><Page /></Suspense>; }
