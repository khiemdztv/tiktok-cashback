"use client";
import { useSearchParams } from "next/navigation";

import { Link } from "@/src/lib/navigation";
import { ArrowRight, ExternalLink, SearchX, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { VoucherCard } from "@/src/components/cards/VoucherCard";
import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { SearchBox } from "@/src/components/search/SearchBox";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  cashbackOffers,
  compareProduct,
  popularSearches,
  storeBySlug,
  stores,
  vouchers,
} from "@/src/data/mock";
import { effectivePrice, formatPercent, formatVnd } from "@/src/lib/format";




function ResultsSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const q = useSearchParams().get("q") || "";
  const query = q.trim().toLowerCase();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [q]);

  const matchedStores = query
    ? stores.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          query.includes(s.name.toLowerCase()),
      )
    : stores.slice(0, 4);

  const matchedSlugs = new Set(matchedStores.map((s) => s.slug));
  const matchedOffers = (
    matchedSlugs.size ? cashbackOffers.filter((o) => matchedSlugs.has(o.storeSlug)) : cashbackOffers
  ).slice(0, 4);
  const matchedVouchers = (
    matchedSlugs.size ? vouchers.filter((v) => matchedSlugs.has(v.storeSlug)) : vouchers
  ).slice(0, 4);

  const rows = compareProduct.rows.map((r) => ({
    ...r,
    effective: effectivePrice(r.price, r.voucher, r.cashback),
  }));
  const bestPrice = Math.min(...rows.map((r) => r.price));
  const bestEffective = Math.min(...rows.map((r) => r.effective));

  const isEmpty = query.length > 0 && matchedStores.length === 0;

  return (
    <SiteLayout>
      <h1 className="sr-only">Tìm kiếm cashback và ưu đãi{q ? ` cho ${q}` : ""}</h1>
      <div className="border-b border-border bg-surface/50">
        <div className="container-page py-8">
          <SearchBox defaultValue={q} size="md" showPaste={false} className="max-w-3xl" />
          {q && (
            <p className="mt-4 text-sm text-muted-foreground">
              Kết quả cho <span className="font-semibold text-foreground">“{q}”</span> · cập nhật hôm
              nay
            </p>
          )}
        </div>
      </div>

      <div className="container-page py-10">
        {loading ? (
          <ResultsSkeleton />
        ) : isEmpty ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
            <SearchX className="mx-auto size-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-bold">Chưa tìm thấy kết quả phù hợp</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thử tìm theo tên cửa hàng, ví dụ Shopee, Agoda hoặc Nike.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {popularSearches.slice(0, 5).map((s) => (
                <Link
                  key={s}
                  to="/search"
                  search={{ q: s }}
                  className="rounded-full border border-border px-3.5 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-12">
              {/* Stores */}
              <section>
                <h2 className="text-lg font-bold">Cửa hàng</h2>
                <div className="mt-4 space-y-3">
                  {matchedStores.slice(0, 5).map((s) => (
                    <Link
                      key={s.slug}
                      to="/stores/$store"
                      params={{ store: s.slug }}
                      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:border-primary/40 hover:shadow-lift"
                    >
                      <StoreLogo store={s} />
                      <div className="min-w-0">
                        <p className="font-semibold">{s.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{s.description}</p>
                      </div>
                      <Badge className="ml-auto shrink-0 rounded-full bg-accent text-accent-foreground hover:bg-accent">
                        Lên đến {formatPercent(s.maxRate)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Cashback */}
              <section>
                <h2 className="text-lg font-bold">Cơ hội cashback</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {matchedOffers.map((o) => {
                    const store = storeBySlug(o.storeSlug)!;
                    return (
                      <div
                        key={o.id}
                        className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{o.provider}</p>
                          <Badge variant="secondary" className="rounded-full font-normal">
                            {store.name}
                          </Badge>
                        </div>
                        <p className="mt-3 text-2xl font-extrabold text-primary">
                          Cashback {formatPercent(o.rate)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Trạng thái: Đang hoạt động · Cập nhật {o.updated.toLowerCase()}
                        </p>
                        <Button asChild size="sm" className="mt-4 rounded-xl">
                          <Link to="/stores/$store" params={{ store: store.slug }}>
                            Xem cashback
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Vouchers */}
              <section>
                <h2 className="text-lg font-bold">Voucher</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {matchedVouchers.map((v) => (
                    <VoucherCard key={v.id} voucher={v} />
                  ))}
                </div>
              </section>

              {/* Price comparison */}
              <section>
                <h2 className="text-lg font-bold">So sánh giá</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ví dụ tham khảo cho {compareProduct.name}.
                </p>
                <div className="mt-4 space-y-3">
                  {rows.map((r) => {
                    const store = storeBySlug(r.storeSlug)!;
                    return (
                      <div
                        key={r.storeSlug}
                        className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft"
                      >
                        <StoreLogo store={store} size="sm" />
                        <span className="font-medium">{store.name}</span>
                        <span className="ml-auto text-sm text-muted-foreground">
                          Giá: <span className="font-semibold text-foreground">{formatVnd(r.price)}</span>
                          {r.price === bestPrice && (
                            <Badge className="ml-2 rounded-full bg-accent text-accent-foreground hover:bg-accent">
                              Giá tốt nhất
                            </Badge>
                          )}
                        </span>
                        <span className="text-sm">
                          Hiệu dụng:{" "}
                          <span className="font-bold text-primary">{formatVnd(r.effective)}</span>
                        </span>
                        {r.effective === bestEffective && (
                          <Badge className="rounded-full">
                            <Trophy className="mr-1 size-3" /> Tiết kiệm nhất
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Button asChild variant="ghost" className="mt-4 rounded-full">
                  <Link to="/compare">
                    Xem bảng so sánh đầy đủ <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </section>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <h3 className="text-sm font-semibold">Lưu ý khi so sánh</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Giá hiệu dụng là ước tính sau voucher và cashback.</li>
                  <li>Điều kiện cashback khác nhau theo từng đơn vị cung cấp.</li>
                  <li>Cashback ID không xử lý giao dịch hay giữ tiền của bạn.</li>
                </ul>
                <Link
                  to="/how-it-works"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Cách hoạt động <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <h3 className="text-sm font-semibold">Tìm kiếm liên quan</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularSearches.map((s) => (
                    <Link
                      key={s}
                      to="/search"
                      search={{ q: s }}
                      className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>

              <a
                href="https://cashback.id.vn"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="size-4" /> Liên kết ngoài mở ở tab mới
              </a>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
