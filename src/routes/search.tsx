"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw, Search, SearchX } from "lucide-react";
import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { SearchBox } from "@/src/components/search/SearchBox";
import { ProductResultCard } from "@/src/components/cards/ProductResultCard";
import { ComparisonTable } from "@/src/components/search/ComparisonTable";
import { AIAnalysis } from "@/src/components/search/AIAnalysis";
import { Button } from "@/src/components/ui/button";
import { Link } from "@/src/lib/navigation";
import type { SmartSearchResponse } from "@/lib/you-api";
export default function SearchPage() {
  const q = useSearchParams().get("q")?.trim() ?? "";
  const [data, setData] = useState<SmartSearchResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(q));
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [platform, setPlatform] = useState("");
  const [sort, setSort] = useState("price");
  useEffect(() => {
    setPlatform("");
    if (!q) {
      setData(null);
      setError("");
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 45000);
    setLoading(true);
    setError("");
    setData(null);
    fetch("/api/smart-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(payload.error || "Không thể tìm kiếm lúc này.");
        setData(payload);
      })
      .catch((reason) => {
        if (!controller.signal.aborted || timedOut)
          setError(
            timedOut
              ? "Tìm kiếm mất nhiều thời gian hơn dự kiến. Bạn có thể thử lại."
              : reason instanceof Error
                ? reason.message
                : "Chưa thể kết nối tới dịch vụ tìm kiếm.",
          );
      })
      .finally(() => {
        clearTimeout(timer);
        if (!controller.signal.aborted || timedOut) setLoading(false);
      });
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, attempt]);
  const results = useMemo(() => {
    const rows = (data?.results ?? []).filter(
      (item) => !platform || item.platform === platform,
    );
    return sort === "price"
      ? [...rows].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
      : rows;
  }, [data, platform, sort]);
  const platforms = Array.from(
    new Map(
      data?.results.map((item) => [item.platform, item.platformName]) ?? [],
    ),
  );
  const best = results.find((item) => item.price !== null)?.id;
  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-8">
          <p className="eyebrow mb-3">Tìm kiếm sản phẩm & cửa hàng</p>
          <h1 className="mb-5 text-2xl font-semibold">
            {q ? `Kết quả cho “${q}”` : "Bạn muốn tìm gì hôm nay?"}
          </h1>
          <SearchBox
            defaultValue={q}
            size="md"
            showPaste={false}
            className="max-w-3xl"
          />
          {data && (
            <p className="mt-3 text-xs text-muted-foreground">
              Tìm lúc{" "}
              {new Date(data.searchedAt).toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
              })}
              {data.cached ? " · Kết quả đã lưu" : ""}. Giá có thể thay đổi.
            </p>
          )}
        </div>
      </section>
      <div className="container-page py-9">
        {!q ? (
          <div className="panel mx-auto max-w-xl p-8 text-center">
            <Search className="mx-auto size-8 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">
              Bắt đầu bằng một tên cụ thể.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Thử tên sản phẩm kèm phiên bản, thương hiệu hoặc địa điểm để kết
              quả phù hợp hơn.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["iPhone 15", "Nike Air Force 1", "Khách sạn Đà Nẵng"].map(
                (value) => (
                  <Link
                    key={value}
                    to="/search"
                    search={{ q: value }}
                    className="filter-chip"
                  >
                    {value}
                  </Link>
                ),
              )}
            </div>
          </div>
        ) : loading ? (
          <div aria-busy="true" role="status">
            <p className="mb-5 text-sm text-muted-foreground">
              Đang tìm các nguồn liên quan…
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="panel h-80 animate-pulse bg-muted"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div role="alert" className="panel mx-auto max-w-xl p-8 text-center">
            <AlertCircle className="mx-auto size-8 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">
              Tìm kiếm chưa sẵn sàng
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {error}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button onClick={() => setAttempt((value) => value + 1)}>
                <RefreshCw />
                Thử lại
              </Button>
              <Button asChild variant="outline">
                <Link to="/stores">Khám phá cửa hàng</Link>
              </Button>
            </div>
          </div>
        ) : !data?.results.length ? (
          <div className="panel p-10 text-center">
            <SearchX className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">
              Chưa tìm thấy kết quả phù hợp
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Thử tên sản phẩm, phiên bản hoặc cửa hàng cụ thể hơn.
            </p>
          </div>
        ) : (
          <div className="space-y-9">
            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <p role="status" className="text-sm text-muted-foreground">
                  {results.length} kết quả · giá chưa gồm ưu đãi
                </p>
                <div className="flex flex-wrap gap-2">
                  <select
                    aria-label="Lọc nền tảng"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="h-10 rounded-xl border border-input bg-white px-3 text-sm"
                  >
                    <option value="">Tất cả nền tảng</option>
                    {platforms.map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Sắp xếp kết quả"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-10 rounded-xl border border-input bg-white px-3 text-sm"
                  >
                    <option value="price">Giá thấp trước</option>
                    <option value="source">Thứ tự nguồn</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((result) => (
                  <ProductResultCard
                    key={result.id}
                    result={result}
                    best={sort === "price" && result.id === best}
                  />
                ))}
              </div>
            </div>
            <section>
              <h2 className="text-xl font-semibold">Đối chiếu giá tìm được</h2>
              <p className="mb-5 mt-2 text-sm leading-7 text-muted-foreground">
                Kết quả có thể khác phiên bản hoặc điều kiện bán. Không trừ
                voucher và cashback khi chưa có xác nhận áp dụng cho sản phẩm.
              </p>
              <ComparisonTable results={results} />
            </section>
            <AIAnalysis query={q} />
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
