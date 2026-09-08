"use client";

import { Lightbulb, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ShopeeVoucherCard, type ShopeeVoucherView } from "@/src/components/cards/ShopeeVoucherCard";
import { CountdownTimer } from "@/src/components/ui/CountdownTimer";
import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { shopeeCampaigns } from "@/src/data/mock";
import { Link } from "@/src/lib/navigation";

type ApiResponse = { vouchers: ShopeeVoucherView[]; total: number; error?: string };

function nextCampaignDate() {
  const now = new Date();
  const dates = shopeeCampaigns
    .filter((item) => item.month && item.day)
    .map((item) => {
      const date = new Date(now.getFullYear(), item.month! - 1, item.day!, 23, 59, 59);
      if (date.getTime() < now.getTime()) date.setFullYear(date.getFullYear() + 1);
      return { ...item, date };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  return dates[0];
}

const discountTypes = [
  ["", "Tất cả loại"], ["fixed", "Giảm tiền"], ["percent", "Giảm %"], ["freeship", "Freeship"],
];

export default function ShopeeVouchersPage() {
  const [vouchers, setVouchers] = useState<ShopeeVoucherView[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [campaign, setCampaign] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const upcoming = useMemo(nextCampaignDate, []);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ limit: "60", sort });
    if (type) query.set("type", type);
    if (campaign) query.set("campaign", campaign);
    if (category) query.set("category", category);
    setLoading(true);
    setError("");
    fetch(`/api/shopee-vouchers?${query}`, { signal: controller.signal })
      .then(async (response) => {
        const data = (await response.json()) as ApiResponse;
        if (!response.ok) throw new Error(data.error || "Không thể tải voucher.");
        setVouchers(data.vouchers);
        setTotal(data.total);
      })
      .catch((reason) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Không thể tải voucher.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [campaign, category, sort, type]);

  const categories = Array.from(new Set(vouchers.map((item) => item.category).filter(Boolean))) as string[];

  return (
    <SiteLayout>
      <section className="overflow-hidden bg-gradient-to-br from-[#ee4d2d] via-[#f35c2f] to-[#ff8a38] text-white">
        <div className="container-page relative py-12 md:py-16">
          <div className="absolute -right-16 -top-20 size-72 rounded-full bg-white/10" />
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold"><Sparkles className="size-4" /> Mã Shopee cập nhật liên tục</span>
            <h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">Săn voucher Shopee, mua sắm tiết kiệm hơn</h1>
            <p className="mt-4 max-w-2xl text-white/85">Chọn mã phù hợp, bấm thu thập và nhận trực tiếp trên Shopee. Có thể kết hợp voucher với cashback khi chương trình cho phép.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-xl bg-white px-4 py-2 font-bold text-[#d93f22]">{total} mã đang hoạt động</span>
              {upcoming && <span className="rounded-xl bg-black/15 px-4 py-2 font-semibold">{upcoming.name}: <CountdownTimer endDate={upcoming.date} className="ml-1" /></span>}
            </div>
          </div>
        </div>
      </section>

      <div className="container-page py-8">
        <div className="grid gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Lọc theo loại voucher" className="h-11 rounded-xl border border-input bg-background px-3 text-sm">
            {discountTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select value={campaign} onChange={(event) => setCampaign(event.target.value)} aria-label="Lọc theo campaign" className="h-11 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="">Tất cả campaign</option>
            {shopeeCampaigns.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Lọc theo danh mục" className="h-11 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="">Tất cả danh mục</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sắp xếp voucher" className="h-11 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="newest">Mới nhất</option><option value="discount">Giảm nhiều nhất</option><option value="expiring">Sắp hết hạn</option>
          </select>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-muted" />)}</div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700"><RefreshCw className="mx-auto mb-3 size-6" /><p className="font-semibold">{error}</p></div>
        ) : vouchers.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed p-14 text-center text-muted-foreground">Chưa có mã giảm giá phù hợp. Quay lại sau nhé!</div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{vouchers.map((voucher) => <ShopeeVoucherCard key={voucher.id} voucher={voucher} />)}</div>
        )}
      </div>

      <section className="container-page pb-4 pt-8">
        <div className="rounded-3xl bg-amber-50 p-6 md:p-8">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Lightbulb className="text-amber-600" /> Mẹo mua sắm tiết kiệm</h2>
          <div className="mt-5 grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
            <p><ShieldCheck className="mb-2 size-5 text-primary" />Đọc kỹ giá trị đơn tối thiểu và hạn dùng trước khi nhận mã.</p>
            <p><Sparkles className="mb-2 size-5 text-primary" />Ưu tiên mã freeship và mã sàn trước, sau đó kiểm tra ưu đãi của shop.</p>
            <p><Lightbulb className="mb-2 size-5 text-primary" />Dùng trang <Link to="/compare" className="font-semibold text-primary hover:underline">so sánh giá</Link> để kiểm tra tổng tiền thực trả.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
