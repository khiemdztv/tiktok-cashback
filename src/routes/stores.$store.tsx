"use client";
import { useParams, notFound } from "next/navigation";

import { Link } from "@/src/lib/navigation";
import { CheckCircle2, ExternalLink, Info } from "lucide-react";

import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { VoucherCard } from "@/src/components/cards/VoucherCard";
import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { cashbackOffers, LAST_UPDATED, storeBySlug, vouchers } from "@/src/data/mock";
import { formatPercent } from "@/src/lib/format";



export default function StoreDetailPage() {
  const params = useParams<{ store: string }>();
  const store = storeBySlug(params.store);
  if (!store) notFound();
  const offers = cashbackOffers.filter((o) => o.storeSlug === store.slug);
  const storeVouchers = vouchers.filter((v) => v.storeSlug === store.slug);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-surface/50">
        <div className="container-page py-8 md:py-12">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/stores" className="hover:text-foreground">
              Cửa hàng
            </Link>
            <span>/</span>
            <span className="text-foreground">{store.name}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
            <StoreLogo store={store} size="lg" />
            <div>
              <h1 className="text-3xl font-extrabold md:text-4xl">{store.name}</h1>
              <p className="mt-1 text-muted-foreground">{store.category}</p>
              <Badge className="mt-3 rounded-full bg-accent px-3 py-1.5 text-sm text-accent-foreground hover:bg-accent">
                Cashback lên đến {formatPercent(store.maxRate)}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 md:ml-auto">
              <Button asChild size="lg" className="rounded-xl">
                <a href="#cashback-details">Xem cashback</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <a href={store.website} target="_blank" rel="noreferrer">
                  Website cửa hàng <ExternalLink className="ml-2 size-4" />
                </a>
              </Button>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-muted-foreground">{store.description}</p>
        </div>
      </div>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-12">
          <section id="cashback-details" className="scroll-mt-24">
            <h2 className="text-xl font-bold">Cashback hiện tại</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-medium">Danh mục</th>
                    <th className="px-5 py-3 text-right font-medium">Cashback</th>
                  </tr>
                </thead>
                <tbody>
                  {store.tiers.map((t) => (
                    <tr key={t.label} className="border-t border-border">
                      <td className="px-5 py-3.5">{t.label}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-primary">
                        {formatPercent(t.rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {offers.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                Đơn vị cung cấp: {offers.map((o) => o.provider).join(", ")}
              </p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold">Điều kiện</h2>
            <ul className="mt-4 space-y-3">
              {store.conditions.map((c) => (
                <li key={c} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-sm">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">Voucher đang có</h2>
            {storeVouchers.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Hiện chưa có voucher cho cửa hàng này. Hãy quay lại sau nhé.
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {storeVouchers.map((v) => (
                  <VoucherCard key={v.id} voucher={v} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold">Cách nhận cashback</h2>
            <ol className="mt-4 space-y-3">
              {[
                "Chọn chương trình cashback",
                "Đọc điều kiện",
                'Nhấn "Đi đến cửa hàng"',
                "Hoàn tất giao dịch theo yêu cầu của chương trình",
                "Nhận cashback từ đơn vị cung cấp",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-4 rounded-xl bg-surface p-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                Cashback được cung cấp bởi đối tác/chương trình tương ứng. cashback.id.vn chỉ tổng hợp
                và cung cấp thông tin.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 text-sm shadow-soft">
            <p className="font-semibold">Cập nhật lần cuối</p>
            <p className="mt-1 text-muted-foreground">{LAST_UPDATED}</p>
          </div>
          <Button asChild variant="outline" className="w-full rounded-xl">
            <Link to="/compare">So sánh với cửa hàng khác</Link>
          </Button>
        </aside>
      </div>
    </SiteLayout>
  );
}
