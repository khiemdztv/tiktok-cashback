"use client";

import { Link } from "@/src/lib/navigation";
import { AlertCircle, Clock3, SearchX, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ProductResultCard } from "@/src/components/cards/ProductResultCard";
import { VoucherCard } from "@/src/components/cards/VoucherCard";
import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { AIAnalysis } from "@/src/components/search/AIAnalysis";
import { ComparisonTable } from "@/src/components/search/ComparisonTable";
import { SearchBox } from "@/src/components/search/SearchBox";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cashbackOffers, popularSearches, storeBySlug, stores, vouchers } from "@/src/data/mock";
import { formatPercent } from "@/src/lib/format";
import type { SmartSearchResponse } from "@/lib/you-api";

type SearchError = { message: string; code?: string };

function ResultsSkeleton() {
  return (
    <div className="space-y-10" aria-label="Đang tìm kiếm">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="overflow-hidden rounded-2xl border border-border bg-card">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-9 w-28" /><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-3/4" /><Skeleton className="h-20 w-full rounded-xl" /><Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchSuggestions() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-soft md:p-10">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><Sparkles className="size-6" /></span>
      <h2 className="mt-4 text-xl font-bold">Bạn muốn so sánh sản phẩm nào?</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Nhập tên sản phẩm, dịch vụ hoặc điểm đến để tìm giá trên nhiều nền tảng.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {popularSearches.slice(0, 6).map((suggestion) => (
          <Link key={suggestion} to="/search" search={{ q: suggestion }} className="rounded-full border border-border px-3.5 py-1.5 text-sm hover:border-primary/40 hover:bg-accent">{suggestion}</Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const q = useSearchParams().get("q")?.trim() ?? "";
  const [data, setData] = useState<SmartSearchResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(q));
  const [error, setError] = useState<SearchError | null>(null);

  useEffect(() => {
    if (!q) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setData(null);

    void fetch("/api/smart-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as SmartSearchResponse & { error?: string; code?: string };
        if (!response.ok) throw { message: payload.error || "Không thể tìm kiếm lúc này.", code: payload.code };
        setData(payload);
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return;
        if (caught && typeof caught === "object" && "message" in caught) {
          setError({ message: String(caught.message), code: "code" in caught ? String(caught.code) : undefined });
        } else {
          setError({ message: "Không thể kết nối tới dịch vụ tìm kiếm." });
        }
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort();
  }, [q]);

  const relatedSlugs = useMemo(() => {
    const slugs = new Set(data?.results.map((result) => result.platform) ?? []);
    const normalized = q.toLocaleLowerCase("vi");
    stores.forEach((store) => {
      if (normalized.includes(store.name.toLocaleLowerCase("vi"))) slugs.add(store.slug);
    });
    return slugs;
  }, [data, q]);

  const relatedOffers = cashbackOffers.filter((offer) => relatedSlugs.has(offer.storeSlug)).slice(0, 4);
  const relatedVouchers = vouchers.filter((voucher) => relatedSlugs.has(voucher.storeSlug)).slice(0, 4);
  const bestId = data?.results.find((result) => result.effectivePrice !== null)?.id;

  return (
    <SiteLayout>
      <h1 className="sr-only">Tìm kiếm giá, voucher và cashback{q ? ` cho ${q}` : ""}</h1>
      <div className="border-b border-border bg-surface/50">
        <div className="container-page py-8">
          <SearchBox defaultValue={q} size="md" showPaste={false} className="max-w-3xl" />
          {q && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Kết quả real-time cho <strong className="text-foreground">“{q}”</strong></span>
              {data?.cached && <Badge variant="secondary" className="rounded-full">Đã lưu cache</Badge>}
            </div>
          )}
        </div>
      </div>

      <div className="container-page py-10">
        {!q ? (
          <SearchSuggestions />
        ) : loading ? (
          <ResultsSkeleton />
        ) : error ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-9 text-center shadow-soft">
            {error.code === "RATE_LIMITED" ? <Clock3 className="mx-auto size-10 text-primary" /> : <AlertCircle className="mx-auto size-10 text-destructive" />}
            <h2 className="mt-4 text-xl font-bold">{error.code === "RATE_LIMITED" ? "Đã hết lượt tìm kiếm hôm nay" : "Tìm kiếm chưa thành công"}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{error.message}</p>
          </div>
        ) : !data?.results.length ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-9 text-center shadow-soft">
            <SearchX className="mx-auto size-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-bold">Chưa tìm thấy kết quả phù hợp</h2>
            <p className="mt-2 text-sm text-muted-foreground">Thử mô tả cụ thể hơn, gồm tên sản phẩm, phiên bản hoặc địa điểm.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {popularSearches.slice(0, 5).map((suggestion) => <Link key={suggestion} to="/search" search={{ q: suggestion }} className="rounded-full border border-border px-3.5 py-1.5 text-sm hover:bg-accent">{suggestion}</Link>)}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div><h2 className="text-xl font-bold md:text-2xl">Kết quả từ các nền tảng</h2><p className="mt-1 text-sm text-muted-foreground">{data.results.length} kết quả · sắp xếp theo giá hiệu dụng ước tính</p></div>
                <p className="text-xs text-muted-foreground">Giá có thể thay đổi khi mở trang bán</p>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.results.map((result) => <ProductResultCard key={result.id} result={result} best={result.id === bestId} />)}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold md:text-2xl">Bảng so sánh giá</h2>
              <p className="mt-1 text-sm text-muted-foreground">Voucher và cashback là mức ước tính từ dữ liệu nội bộ; hãy kiểm tra điều kiện trước khi mua.</p>
              <div className="mt-5"><ComparisonTable results={data.results} /></div>
            </section>

            <section><h2 className="sr-only">Phân tích AI</h2><AIAnalysis query={q} /></section>

            {(relatedOffers.length > 0 || relatedVouchers.length > 0) && (
              <section>
                <h2 className="text-xl font-bold md:text-2xl">Voucher & cashback liên quan</h2>
                <p className="mt-1 text-sm text-muted-foreground">Ưu đãi nội bộ cho các nền tảng xuất hiện trong kết quả.</p>
                {relatedOffers.length > 0 && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedOffers.map((offer) => {
                      const store = storeBySlug(offer.storeSlug);
                      return <div key={offer.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><div className="flex items-center justify-between gap-2"><strong>{store?.name}</strong><Badge variant="secondary" className="rounded-full">{offer.provider}</Badge></div><p className="mt-3 text-2xl font-extrabold text-primary">Cashback {formatPercent(offer.rate)}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{offer.note}</p></div>;
                    })}
                  </div>
                )}
                {relatedVouchers.length > 0 && <div className="mt-4 grid gap-4 lg:grid-cols-2">{relatedVouchers.map((voucher) => <VoucherCard key={voucher.id} voucher={voucher} />)}</div>}
              </section>
            )}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
