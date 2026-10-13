"use client";

import { Link } from "@/src/lib/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  Link2,
  MousePointerClick,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
  TicketPercent,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

import { CategoryIcon } from "@/src/components/brand/CategoryIcon";
import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { SearchBox } from "@/src/components/search/SearchBox";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Section } from "@/src/components/ui/section";
import { categories, searchExamples, storeBySlug, stores } from "@/src/data/mock";
import { formatPercent, formatVnd } from "@/src/lib/format";

const featured = ["shopee", "lazada", "agoda", "traveloka"];
const previewStores = ["shopee", "lazada", "agoda"];

function ProductPreview() {
  return (
    <div className="startup-preview relative mx-auto w-full max-w-[520px]" aria-label="Minh họa kết quả tìm kiếm trên cashback.id.vn">
      <div className="rounded-[28px] border border-white/15 bg-white/[0.98] p-3 shadow-[0_30px_90px_rgba(1,20,15,.34)] sm:p-4">
        <div className="flex items-center gap-3 border-b border-slate-100 px-2 pb-4 pt-1">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <Search className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">iPhone 15 chính hãng</p>
            <p className="mt-0.5 text-xs text-slate-500">Đang đối chiếu ưu đãi phù hợp</p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-500" /> Trực tuyến
          </span>
        </div>

        <div className="space-y-2.5 pt-3">
          {previewStores.map((slug, index) => {
            const store = storeBySlug(slug)!;
            return (
              <div
                key={slug}
                className={`preview-result flex items-center gap-3 rounded-2xl border p-3.5 ${index === 0 ? "border-emerald-200 bg-emerald-50/60" : "border-slate-100 bg-white"}`}
                style={{ animationDelay: `${220 + index * 110}ms` }}
              >
                <StoreLogo store={store} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{store.name}</p>
                    {index === 0 && <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">Gợi ý</span>}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">Voucher + cashback tham khảo</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-emerald-700">{formatPercent(store.maxRate)}</p>
                  <p className="text-[10px] text-slate-400">lên đến</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-white">
          <div className="flex items-center gap-2 text-xs font-medium">
            <ShieldCheck className="size-4 text-emerald-400" /> Có điều kiện áp dụng rõ ràng
          </div>
          <ChevronRight className="size-4 text-slate-400" />
        </div>
      </div>

      <div className="preview-float absolute -left-4 top-24 hidden items-center gap-2 rounded-2xl border border-white/60 bg-white px-3 py-2.5 shadow-xl sm:flex">
        <span className="grid size-7 place-items-center rounded-lg bg-amber-100 text-amber-700"><TicketPercent className="size-4" /></span>
        <div><p className="text-[10px] text-slate-400">Đã tìm thấy</p><p className="text-xs font-bold text-slate-900">Voucher phù hợp</p></div>
      </div>
      <div className="preview-float preview-float-late absolute -bottom-5 -right-3 hidden items-center gap-2 rounded-2xl border border-white/60 bg-white px-3 py-2.5 shadow-xl sm:flex">
        <span className="grid size-7 place-items-center rounded-lg bg-sky-100 text-sky-700"><BarChart3 className="size-4" /></span>
        <div><p className="text-[10px] text-slate-400">So sánh</p><p className="text-xs font-bold text-slate-900">Chi phí sau ưu đãi</p></div>
      </div>
    </div>
  );
}

function SavingsCalculator() {
  const [price, setPrice] = useState(1000000);
  const cashbackRate = 5;
  const voucher = 100000;
  const cashbackValue = Math.round((Math.max(price - voucher, 0) * cashbackRate) / 100);
  const effective = Math.max(price - voucher - cashbackValue, 0);

  return (
    <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-lift">
      <div className="grid lg:grid-cols-[.9fr_1.1fr]">
        <div className="bg-[#0b2f27] p-7 text-white md:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <WalletCards className="size-3.5" /> Công cụ ước tính
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">Biết giá thực trả trước khi quyết định.</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-emerald-50/70 md:text-base">
            Kết hợp giá niêm yết, voucher và cashback để nhìn thấy mức chi phí hiệu dụng trong một phép tính đơn giản.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-emerald-50/90">
            {["Tách rõ từng khoản tiết kiệm", "Điều chỉnh theo ngân sách của bạn", "Không cần đăng ký tài khoản"].map((item) => (
              <li key={item} className="flex items-center gap-2.5"><span className="grid size-5 place-items-center rounded-full bg-emerald-400/20"><Check className="size-3 text-emerald-300" /></span>{item}</li>
            ))}
          </ul>
        </div>

        <div className="p-7 md:p-10">
          <label htmlFor="price" className="text-sm font-semibold">Giá sản phẩm</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background px-4 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
            <input
              id="price"
              inputMode="numeric"
              value={price === 0 ? "" : price.toLocaleString("vi-VN")}
              onChange={(event) => {
                const raw = Number(event.target.value.replace(/\D/g, ""));
                setPrice(Number.isNaN(raw) ? 0 : Math.min(raw, 999999999));
              }}
              className="h-14 min-w-0 flex-1 bg-transparent text-xl font-bold outline-none"
            />
            <span className="font-medium text-muted-foreground">đ</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[500000, 1000000, 2500000].map((value) => (
              <button key={value} onClick={() => setPrice(value)} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/30 hover:bg-accent">
                {formatVnd(value)}
              </button>
            ))}
          </div>

          <dl className="mt-7 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground"><dt>Voucher minh họa</dt><dd className="font-semibold text-foreground">-{formatVnd(voucher)}</dd></div>
            <div className="flex justify-between text-muted-foreground"><dt>Cashback minh họa ({cashbackRate}%)</dt><dd className="font-semibold text-primary">-{formatVnd(cashbackValue)}</dd></div>
            <div className="flex items-end justify-between border-t border-border pt-4"><dt className="font-semibold">Chi phí hiệu dụng</dt><dd className="text-2xl font-extrabold text-primary md:text-3xl">{formatVnd(effective)}</dd></div>
          </dl>
          <Button asChild className="mt-6 h-11 w-full rounded-xl"><Link to="/compare">So sánh chi tiết <ArrowRight className="size-4" /></Link></Button>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Phép tính dùng số liệu minh họa. Ưu đãi thực tế phụ thuộc điều kiện tại thời điểm mua.</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <SiteLayout>
      <section className="startup-hero relative overflow-hidden bg-[#08271f] text-white">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="container-page relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-16 lg:py-24">
          <div className="min-w-0">
            <Badge className="mb-6 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-300/10">
              <Sparkles className="mr-1.5 size-3.5" /> Nền tảng mua sắm thông minh cho người Việt
            </Badge>
            <h1 className="max-w-3xl text-[2.6rem] font-black leading-[1.05] tracking-[-.045em] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              Tìm cách mua online <span className="text-emerald-400">có lợi hơn.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-emerald-50/70 md:text-lg">
              cashback.id.vn gom cashback, voucher và thông tin so sánh vào một nơi để bạn kiểm tra trước khi thanh toán.
            </p>

            <div className="mt-8 max-w-2xl rounded-[22px] bg-white p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.22)]">
              <SearchBox showPaste={false} className="[&_form]:border-0 [&_form]:shadow-none [&_input]:text-slate-900 [&_input]:placeholder:text-slate-400" />
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-emerald-50/70 sm:text-sm">
              {["Miễn phí sử dụng", "Không cần đăng nhập", "Điều kiện hiển thị rõ"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5"><BadgeCheck className="size-4 text-emerald-400" />{item}</span>
              ))}
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="container-page flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Khám phá ưu đãi theo thương hiệu</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            {stores.slice(0, 7).map((store) => (
              <Link key={store.slug} to="/stores/$store" params={{ store: store.slug }} aria-label={`Xem ưu đãi ${store.name}`} className="opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                <StoreLogo store={store} size="sm" className="border-0 shadow-none" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Section className="py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div>
            <p className="eyebrow">Một hành trình đơn giản</p>
            <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight md:text-5xl">Từ ý định mua đến quyết định rõ ràng.</h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">Thông tin ưu đãi thường nằm rải rác. cashback.id.vn sắp xếp lại hành trình để bạn biết cần kiểm tra gì trước khi mở ví.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Search, number: "01", title: "Tìm", desc: "Nhập sản phẩm, cửa hàng hoặc dán đường dẫn." },
              { icon: Tags, number: "02", title: "Đối chiếu", desc: "Xem cashback, voucher và điều kiện liên quan." },
              { icon: MousePointerClick, number: "03", title: "Quyết định", desc: "Chọn phương án phù hợp rồi tiếp tục mua hàng." },
            ].map((step) => (
              <article key={step.number} className="group rounded-3xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-accent text-primary"><step.icon className="size-5" /></span><span className="text-xs font-bold text-muted-foreground/60">{step.number}</span></div>
                <h3 className="mt-8 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <section className="bg-[#f3f7f5]">
        <div className="container-page py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Một điểm bắt đầu, nhiều cách tiết kiệm</p>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl">Bộ công cụ cho mỗi lần mua online.</h2>
            <p className="mt-4 text-muted-foreground">Khám phá theo nhu cầu của bạn, từ săn ưu đãi đến kiểm tra chi phí cuối cùng.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
            <Link to="/search" className="feature-panel feature-panel-primary group lg:col-span-7">
              <div className="relative z-10 max-w-md">
                <span className="feature-icon"><Compass className="size-6" /></span>
                <p className="mt-8 text-xs font-bold uppercase tracking-[.14em] text-emerald-200">Smart discovery</p>
                <h3 className="mt-3 text-2xl font-bold text-white md:text-3xl">Tìm kiếm sản phẩm và cơ hội tiết kiệm trong cùng một luồng.</h3>
                <p className="mt-4 text-sm leading-relaxed text-emerald-50/70">Bắt đầu bằng tên sản phẩm hoặc thương hiệu, sau đó xem các lựa chọn liên quan thay vì tự mở nhiều tab.</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">Bắt đầu tìm kiếm <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
              <div className="feature-rings" aria-hidden="true" />
            </Link>

            <Link to="/shopee-vouchers" className="feature-panel group bg-[#fff4e8] lg:col-span-5">
              <span className="feature-icon bg-white text-orange-600"><TicketPercent className="size-6" /></span>
              <p className="mt-8 text-xs font-bold uppercase tracking-[.14em] text-orange-700">Voucher center</p>
              <h3 className="mt-3 text-2xl font-bold">Theo dõi mã Shopee theo từng đợt sale.</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">Tìm nhanh voucher và mở đúng trang áp dụng khi bạn cần.</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">Xem mã đang có <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>

            <Link to="/compare" className="feature-panel group bg-white lg:col-span-5">
              <span className="feature-icon bg-sky-50 text-sky-700"><BarChart3 className="size-6" /></span>
              <p className="mt-8 text-xs font-bold uppercase tracking-[.14em] text-sky-700">Price clarity</p>
              <h3 className="mt-3 text-2xl font-bold">So sánh bằng chi phí sau ưu đãi.</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Giá niêm yết thấp chưa chắc là lựa chọn có lợi nhất sau voucher và cashback.</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">Mở công cụ so sánh <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>

            <Link to="/tools" className="feature-panel group bg-[#e8f6f0] lg:col-span-7">
              <div className="grid items-center gap-8 sm:grid-cols-[1fr_auto]">
                <div>
                  <span className="feature-icon bg-white text-emerald-700"><Link2 className="size-6" /></span>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[.14em] text-emerald-700">Tiện ích phụ</p>
                  <h3 className="mt-3 text-2xl font-bold">Đổi link Shopee trong vài giây.</h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">Dán link sản phẩm và nhận đường dẫn mới, miễn phí và không cần tài khoản.</p>
                </div>
                <span className="grid size-20 place-items-center rounded-[24px] border border-emerald-900/10 bg-white text-emerald-700 shadow-soft sm:size-24"><Link2 className="size-9" /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Section title="Ưu đãi nổi bật" subtitle="Mức cashback tham khảo từ các chương trình đang được tổng hợp." action={<Button asChild variant="ghost" className="rounded-full"><Link to="/cashback">Xem tất cả <ArrowRight className="size-4" /></Link></Button>} className="py-16 md:py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((slug) => {
            const store = storeBySlug(slug)!;
            return (
              <article key={slug} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-start justify-between"><StoreLogo store={store} /><span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">Tham khảo</span></div>
                <h3 className="mt-5 text-lg font-bold">{store.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{store.category}</p>
                <p className="mt-6 text-3xl font-extrabold text-primary">{formatPercent(store.maxRate)}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="size-3.5" /> Cashback lên đến</p>
                <Link to="/stores/$store" params={{ store: store.slug }} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">Xem điều kiện <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
              </article>
            );
          })}
        </div>
      </Section>

      <Section>
        <SavingsCalculator />
      </Section>

      <Section title="Khám phá theo nhu cầu" subtitle="Đi thẳng đến nhóm sản phẩm và dịch vụ bạn quan tâm.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link key={category.slug} to="/search" search={{ q: category.label }} className="group flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-4 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
              <CategoryIcon slug={category.slug} />
              <span className="text-sm font-semibold">{category.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tìm nhanh</span>
          {searchExamples.map((example) => <Link key={example} to="/search" search={{ q: example }} className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">{example}</Link>)}
        </div>
      </Section>

      <section className="container-page py-12 md:py-20">
        <div className="relative overflow-hidden rounded-[34px] bg-[#0d1f1a] px-6 py-10 text-white md:px-12 md:py-14">
          <div className="absolute -right-20 -top-24 size-72 rounded-full border border-emerald-300/10" aria-hidden="true" />
          <div className="absolute -right-8 -top-12 size-48 rounded-full border border-emerald-300/10" aria-hidden="true" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300"><ShieldCheck className="size-5" /> Xây dựng cho sự minh bạch</span>
              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">Thông tin rõ trước khi bạn rời trang để mua hàng.</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">Chúng tôi tách mức hoàn, điều kiện và thời điểm cập nhật để bạn hiểu ưu đãi áp dụng trong trường hợp nào. cashback.id.vn không trực tiếp xử lý thanh toán.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-emerald-400 px-6 text-emerald-950 hover:bg-emerald-300"><Link to="/how-it-works">Cách hoạt động</Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"><a href="mailto:admin@cashback.id.vn">Liên hệ đội ngũ</a></Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
