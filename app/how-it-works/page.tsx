import { Suspense } from "react";
import Page from "@/src/routes/how-it-works";
export const metadata = { title: "Cashback ID hoạt động như thế nào?" };
export default function RoutePage() { return <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Đang tải…</div>}><Page /></Suspense>; }
