"use client";
import { useEffect, useState } from "react";
import { Search, RefreshCw, Ticket, X, ShieldCheck } from "lucide-react";
import {
  ShopeeVoucherCard,
  type ShopeeVoucherView,
} from "@/src/components/cards/ShopeeVoucherCard";
import { SiteLayout, PageHeader } from "@/src/components/layout/SiteLayout";
import { Button } from "@/src/components/ui/button";
import { shopeeCampaigns } from "@/src/data/catalog";
import { Link } from "@/src/lib/navigation";
const types = [
  ["", "Tất cả loại"],
  ["fixed", "Giảm tiền"],
  ["percent", "Giảm %"],
  ["freeship", "Freeship"],
];
export default function ShopeeVouchersPage() {
  const [vouchers, setVouchers] = useState<ShopeeVoucherView[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [campaign, setCampaign] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [limit, setLimit] = useState(60);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 20000);
    const params = new URLSearchParams({ limit: String(limit), sort });
    if (type) params.set("type", type);
    if (campaign) params.set("campaign", campaign);
    if (category) params.set("category", category);
    if (debounced) params.set("q", debounced);
    setLoading(true);
    setError("");
    fetch(`/api/shopee-vouchers?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Chưa thể tải voucher.");
        setVouchers(data.vouchers);
        setTotal(data.total);
        setCategories(
          (current) =>
            Array.from(
              new Set([
                ...current,
                ...data.vouchers
                  .map((item: ShopeeVoucherView) => item.category)
                  .filter(Boolean),
              ]),
            ) as string[],
        );
      })
      .catch((reason) => {
        if (!controller.signal.aborted || timedOut)
          setError(
            timedOut
              ? "Tải voucher mất nhiều thời gian hơn dự kiến. Bạn có thể thử lại."
              : reason instanceof Error
                ? reason.message
                : "Chưa thể tải voucher.",
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
  }, [type, campaign, category, sort, debounced, attempt, limit]);
  const filtered = Boolean(type || campaign || category || search);
  const reset = () => {
    setType("");
    setCampaign("");
    setCategory("");
    setSearch("");
    setLimit(60);
  };
  return (
    <SiteLayout>
      <PageHeader
        title="Đúng voucher. Đúng điều kiện."
        subtitle="Khám phá mã Shopee từ nguồn đã kết nối. Kiểm tra đơn tối thiểu, hạn dùng và điều kiện tại Shopee trước khi áp dụng."
      >
        <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium">
          <img src="/brands/shopee.svg" alt="" className="size-4" />
          Nguồn ưu đãi Shopee
        </span>
      </PageHeader>
      <div className="container-page py-8">
        <div className="panel p-4 md:p-5">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Tìm kiếm voucher Shopee</span>
            <input
              type="search"
              maxLength={100}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã hoặc tên voucher..."
              className="h-12 w-full rounded-xl border border-input bg-white pl-11 pr-3 text-sm"
            />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs text-muted-foreground">
              Loại ưu đãi
              <select
                aria-label="Lọc theo loại voucher"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground"
              >
                {types.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              Chiến dịch
              <select
                aria-label="Lọc theo chiến dịch"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground"
              >
                <option value="">Tất cả chiến dịch</option>
                {shopeeCampaigns.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              Danh mục
              <select
                aria-label="Lọc theo danh mục"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground">
              Sắp xếp
              <select
                aria-label="Sắp xếp voucher"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-white px-3 text-sm text-foreground"
              >
                <option value="newest">Mới cập nhật</option>
                <option value="discount">Mức giảm cao trước</option>
                <option value="expiring">Sắp hết hạn</option>
              </select>
            </label>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <p role="status" className="text-sm text-muted-foreground">
            {loading
              ? "Đang tải dữ liệu…"
              : error
                ? "Danh sách chưa sẵn sàng"
                : `Hiển thị ${vouchers.length} / ${total} voucher`}
          </p>
          {filtered && (
            <button onClick={reset} className="quiet-link text-xs">
              <X className="size-3.5" />
              Xóa bộ lọc
            </button>
          )}
        </div>
        {loading ? (
          <div
            aria-busy="true"
            aria-label="Đang tải voucher"
            className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="panel h-80 animate-pulse bg-muted" />
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="panel mt-5 p-9 text-center">
            <RefreshCw className="mx-auto size-7 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">
              Chưa tải được danh sách
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={() => setAttempt((value) => value + 1)}
              className="mt-5"
            >
              Thử tải lại
            </Button>
          </div>
        ) : !vouchers.length ? (
          <div className="panel mt-5 p-9 text-center">
            <Ticket className="mx-auto size-7 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">Chưa có mã phù hợp</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {filtered
                ? "Thử bỏ bộ lọc hoặc tìm theo một từ khóa khác."
                : "Chưa có voucher từ nguồn đã kết nối để hiển thị. Quay lại sau để kiểm tra mã mới."}
            </p>
            {filtered && (
              <Button variant="outline" onClick={reset} className="mt-5">
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vouchers.map((voucher) => (
                <ShopeeVoucherCard key={voucher.id} voucher={voucher} />
              ))}
            </div>
            {vouchers.length < total && limit < 100 && (
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => setLimit(100)}>
                  Xem thêm voucher
                </Button>
              </div>
            )}
          </>
        )}
        <div className="mt-8 flex gap-3 rounded-xl bg-surface p-5">
          <ShieldCheck className="mt-1 size-5 shrink-0 text-primary" />
          <p className="text-xs leading-6 text-muted-foreground">
            Mã được tổng hợp từ nguồn dữ liệu đã kết nối, không phải cam kết áp
            dụng cho mọi tài khoản. Hạn dùng và điều kiện tại Shopee là thông
            tin quyết định.{" "}
            <Link
              to="/how-it-works"
              className="font-medium text-primary hover:underline"
            >
              Tìm hiểu thêm
            </Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
