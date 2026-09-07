"use client";

import { Link2, Search, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { compareProduct, storeBySlug } from "@/src/data/mock";
import { effectivePrice, formatPercent, formatVnd } from "@/src/lib/format";
import { cn } from "@/src/lib/utils";



export default function ComparePage() {
  const [q, setQ] = useState(compareProduct.name);

  const rows = compareProduct.rows
    .map((r) => ({ ...r, effective: effectivePrice(r.price, r.voucher, r.cashback) }))
    .sort((a, b) => a.effective - b.effective);
  const best = rows[0]!;

  return (
    <SiteLayout>
      <PageHeader
        title="So sánh cách mua tiết kiệm nhất"
        subtitle="Nhập tên sản phẩm hoặc dán link để xem giá hiệu dụng sau voucher và cashback."
      >
        <form
          onSubmit={(e) => { e.preventDefault(); toast.info("Bảng so sánh hiện dùng sản phẩm mẫu", { description: "Dữ liệu giá trực tiếp cho sản phẩm khác chưa được kết nối." }); }}
          className="mt-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-card p-2 pl-4 shadow-lift focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10"
        >
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            aria-label="Tên sản phẩm cần so sánh"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nhập tên sản phẩm hoặc dán link..."
            className="h-11 min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
          <Button className="rounded-xl">So sánh</Button>
        </form>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Link2 className="size-4" /> Hỗ trợ dán link Shopee, Lazada, Tiki (sắp ra mắt)
        </p>
      </PageHeader>

      <div className="container-page py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{compareProduct.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{compareProduct.note}</p>
          </div>
          <Badge variant="secondary" className="rounded-full font-normal">
            Cập nhật hôm nay
          </Badge>
        </div>

        {/* Desktop table */}
        <div className="mt-6 hidden overflow-hidden rounded-2xl border border-border bg-card shadow-soft md:block">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-medium">Nơi mua</th>
                <th className="px-5 py-3.5 font-medium">Giá</th>
                <th className="px-5 py-3.5 font-medium">Voucher</th>
                <th className="px-5 py-3.5 font-medium">Cashback</th>
                <th className="px-5 py-3.5 text-right font-medium">Giá hiệu dụng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const store = storeBySlug(r.storeSlug)!;
                const isBest = r.storeSlug === best.storeSlug;
                return (
                  <tr
                    key={r.storeSlug}
                    className={cn("border-t border-border", isBest && "bg-accent/50")}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <StoreLogo store={store} size="sm" />
                        <span className="font-medium">{store.name}</span>
                        {isBest && (
                          <Badge className="rounded-full">
                            <Trophy className="mr-1 size-3" /> Tiết kiệm nhất
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">{formatVnd(r.price)}</td>
                    <td className="px-5 py-4">{r.voucherLabel}</td>
                    <td className="px-5 py-4">{formatPercent(r.cashback)}</td>
                    <td className="px-5 py-4 text-right text-base font-extrabold text-primary">
                      {formatVnd(r.effective)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-6 space-y-3 md:hidden">
          {rows.map((r) => {
            const store = storeBySlug(r.storeSlug)!;
            const isBest = r.storeSlug === best.storeSlug;
            return (
              <div
                key={r.storeSlug}
                className={cn(
                  "rounded-2xl border border-border bg-card p-5 shadow-soft",
                  isBest && "border-primary/50 bg-accent/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <StoreLogo store={store} size="sm" />
                  <span className="font-semibold">{store.name}</span>
                  {isBest && (
                    <Badge className="ml-auto rounded-full">
                      <Trophy className="mr-1 size-3" /> Tiết kiệm nhất
                    </Badge>
                  )}
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Giá</dt>
                    <dd>{formatVnd(r.price)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Voucher</dt>
                    <dd>{r.voucherLabel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Cashback</dt>
                    <dd>{formatPercent(r.cashback)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <dt className="font-medium">Giá hiệu dụng</dt>
                    <dd className="font-extrabold text-primary">{formatVnd(r.effective)}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>

        <p className="mt-8 rounded-2xl bg-surface p-5 text-sm text-muted-foreground">
          Giá hiệu dụng là số liệu ước tính. Khả năng nhận cashback và điều kiện áp dụng voucher phụ
          thuộc vào quy định của từng đơn vị cung cấp tại thời điểm bạn mua hàng.
        </p>
      </div>
    </SiteLayout>
  );
}
