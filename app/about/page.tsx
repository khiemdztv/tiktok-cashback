import { Suspense } from "react";
import Page from "@/src/routes/about";
export const metadata = { title: "Về cashback.id.vn — Mua sắm online minh bạch hơn" };
export default function RoutePage() { return <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Đang tải…</div>}><Page /></Suspense>; }
