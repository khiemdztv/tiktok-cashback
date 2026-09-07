"use client";

import { Link } from "@/src/lib/navigation";
import { ArrowRight, BadgeCheck, Clock, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";

import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { CategoryIcon } from "@/src/components/brand/CategoryIcon";
import { StoreCard } from "@/src/components/cards/StoreCard";
import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { SearchBox } from "@/src/components/search/SearchBox";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Section } from "@/src/components/ui/section";
import { categories, popularSearches, searchExamples, storeBySlug, stores } from "@/src/data/mock";
import { formatPercent, formatVnd } from "@/src/lib/format";



const featured = ["shopee", "lazada", "agoda", "traveloka"];

function SavingsCalculator() {
  const [price, setPrice] = useState(1000000);
  const cashbackRate = 5;
  const voucher = 100000;
  const cashbackValue = Math.round((Math.max(price - voucher, 0) * cashbackRate) / 100);
  const effective = Math.max(price - voucher - cashbackValue, 0);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
      <h2 className="text-2xl font-bold">Bạn có thể tiết kiệm bao nhiêu?</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Nhập giá sản phẩm để ước tính giá hiệu dụng sau voucher và cashback.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="price" className="text-sm font-medium">
            Giá sản phẩm
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-4 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
            <input
              id="price"
              inputMode="numeric"
              value={price === 0 ? "" : price.toLocaleString("vi-VN")}
              onChange={(e) => {
                const raw = Number(e.target.value.replace(/\D/g, ""));
                setPrice(Number.isNaN(raw) ? 0 : Math.min(raw, 999999999));
              }}
              className="h-12 flex-1 bg-transparent text-lg font-semibold outline-none"
            />
            <span className="text-muted-foreground">đ</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[500000, 1000000, 2500000].map((p) => (
              <button
                key={p}
                onClick={() => setPrice(p)}
                className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {formatVnd(p)}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-5">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Cashback</dt>
              <dd className="font-semibold">{formatPercent(cashbackRate)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Cashback ước tính</dt>
              <dd className="font-semibold text-primary">{formatVnd(cashbackValue)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Voucher</dt>
              <dd className="font-semibold">-{formatVnd(voucher)}</dd>
            </div>
            <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
              <dt className="font-medium">Giá hiệu dụng ước tính</dt>
              <dd className="text-2xl font-extrabold text-primary">{formatVnd(effective)}</dd>
            </div>
          </dl>
          <Button asChild className="mt-5 w-full rounded-xl">
            <Link to="/compare">Tìm cách tiết kiệm</Link>
          </Button>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Số liệu chỉ mang tính ước tính. Cashback và voucher thực tế phụ thuộc điều kiện của từng đối
        tác.
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="hero-glow border-b border-border">
        <div className="container-page py-16 text-center md:py-24">
          <Badge
            variant="secondary"
            className="mb-6 rounded-full px-3 py-1.5 text-xs font-medium"
          >
            <TrendingUp className="mr-1.5 size-3.5" /> cashback.id.vn · Cập nhật mỗi ngày
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] md:text-6xl">
            Mua gì cũng kiểm tra <span className="text-primary">cashback</span> trước.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Tìm cashback, voucher và ưu đãi tốt nhất trước khi bạn mua sắm online.
          </p>

          <div className="mx-auto mt-9 flex max-w-2xl flex-col items-center">
            <SearchBox />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Ví dụ:</span>
            {searchExamples.map((ex) => (
              <Link
                key={ex}
                to="/search"
                search={{ q: ex }}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {ex}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick categories */}
      <Section title="Khám phá nhanh" subtitle="Chọn danh mục bạn đang quan tâm.">
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-4 md:px-0 lg:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/search"
              search={{ q: c.label }}
              className="flex min-w-[112px] flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
            >
              <CategoryIcon slug={c.slug} />
              <span className="text-sm font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Featured cashback */}
      <Section
        title="Cashback nổi bật"
        subtitle="Khám phá chương trình cashback từ các cửa hàng bạn yêu thích."
        action={
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/cashback">
              Xem tất cả <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        }
      >
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-2 md:px-0 lg:grid-cols-4">
          {featured.map((slug) => {
            const store = storeBySlug(slug)!;
            return (
              <article
                key={slug}
                className="flex min-w-[260px] flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <StoreLogo store={store} />
                <h3 className="mt-4 text-lg font-semibold">{store.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{store.category}</p>
                <p className="mt-4 text-3xl font-extrabold text-primary">
                  Lên đến {formatPercent(store.maxRate)}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3" /> Mức hoàn tham khảo
                </p>
                <Button asChild className="mt-5 rounded-xl">
                  <Link to="/stores/$store" params={{ store: store.slug }}>
                    Xem cashback
                  </Link>
                </Button>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Calculator */}
      <Section>
        <SavingsCalculator />
      </Section>

      {/* Popular stores */}
      <Section
        title="Cửa hàng phổ biến"
        subtitle="Hàng trăm cửa hàng đang có chương trình cashback."
        action={
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/stores">
              Tất cả cửa hàng <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stores.slice(0, 12).map((s) => (
            <StoreCard key={s.slug} store={s} />
          ))}
        </div>
      </Section>

      {/* Popular searches */}
      <Section title="Mọi người đang tìm">
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((s) => (
            <Link
              key={s}
              to="/search"
              search={{ q: s }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
            >
              {s}
            </Link>
          ))}
        </div>
      </Section>

      {/* Trust */}
      <Section>
        <div className="grid gap-8 rounded-3xl border border-border bg-surface/70 p-8 md:grid-cols-2 md:p-12">
          <div>
            <ShieldCheck className="size-9 text-primary" />
            <h2 className="mt-4 text-2xl font-bold md:text-3xl">Minh bạch trước khi bạn mua</h2>
            <p className="mt-3 text-muted-foreground">
              cashback.id.vn là nền tảng thông tin và khám phá ưu đãi. Chúng tôi tổng hợp dữ liệu để bạn
              quyết định dễ hơn.
            </p>
            <Link
              to="/how-it-works"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Tìm hiểu cách hoạt động <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="space-y-4">
            {[
              "Cashback có thể thay đổi theo thời gian.",
              "Điều kiện áp dụng có thể khác nhau.",
              "Luôn kiểm tra điều kiện trước khi mua.",
              "cashback.id.vn không trực tiếp xử lý giao dịch.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-soft">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </SiteLayout>
  );
}
