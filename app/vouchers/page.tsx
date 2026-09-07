import { Suspense } from "react";
import Page from "@/src/routes/vouchers";
export const metadata = { title: "Voucher & mã giảm giá mới nhất — cashback.id.vn" };
export default function RoutePage() { return <Suspense fallback={<div className="container-page py-20 text-muted-foreground">Đang tải…</div>}><Page /></Suspense>; }
