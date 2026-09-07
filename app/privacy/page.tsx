import { Suspense } from "react";
import Page from "@/src/routes/privacy";
export const metadata = { title: "Chính sách bảo mật — Cashback ID" };
export default function RoutePage() { return <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Đang tải…</div>}><Page /></Suspense>; }
