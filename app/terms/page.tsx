import { Suspense } from "react";
import Page from "@/src/routes/terms";
export const metadata = { title: "Điều khoản sử dụng — Cashback ID" };
export default function RoutePage() { return <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Đang tải…</div>}><Page /></Suspense>; }
