"use client";
import { Link } from "@/src/lib/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Search,
  TicketPercent,
  ShieldCheck,
  Link2,
  Scale,
  MousePointer2,
} from "lucide-react";
import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { SearchBox } from "@/src/components/search/SearchBox";
import { StoreCard } from "@/src/components/cards/StoreCard";
import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { CategoryIcon } from "@/src/components/brand/CategoryIcon";
import { Button } from "@/src/components/ui/button";
import { LatestVouchers } from "@/src/components/offers/LatestVouchers";
import { FAQ } from "@/src/components/content/FAQ";
import { merchants, shoppingCategories } from "@/src/data/catalog";

export default function HomePage() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-[#edf2e8]">
        <div className="container-page grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
          <div className="min-w-0 enter">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/60 px-3 py-1.5 text-xs font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              Cashback · Đang phát triển tại Việt Nam
            </div>
            <h1 className="mt-6 max-w-2xl text-[38px] font-bold leading-[1.13] tracking-[-.045em] sm:text-5xl lg:text-[58px]">
              Mỗi lần mua sắm.
              <br />
              <span className="text-primary">Một lựa chọn tốt hơn.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">
              Tìm sản phẩm, khám phá voucher và hiểu điều kiện cashback trước
              khi thanh toán. Những thông tin bạn cần, trong một nơi.
            </p>
            <SearchBox showPaste={false} className="mt-7 max-w-xl" />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Thử tìm:</span>
              {["iPhone 15", "Nike", "Agoda"].map((q) => (
                <Link
                  key={q}
                  to="/search"
                  search={{ q }}
                  className="rounded-full px-2.5 py-1.5 hover:bg-white hover:text-primary"
                >
                  {q}
                  <ArrowUpRight className="ml-1 inline size-3" />
                </Link>
              ))}
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs font-medium text-primary">
              <Check className="size-4" />
              Miễn phí khám phá · Không cần đăng nhập
            </p>
          </div>
          <div
            className="relative mx-auto w-full max-w-[460px] enter"
            style={{ animationDelay: "100ms" }}
          >
            <div className="overflow-hidden rounded-3xl border border-primary/10 bg-[#fbfcf8] shadow-lift">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <p className="text-sm font-semibold">Trước khi bạn mua</p>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Shopping checklist
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-primary text-white">
                    <Search className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Bạn muốn mua gì?</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Sản phẩm · thương hiệu · dịch vụ
                    </p>
                  </div>
                </div>
                <div className="ml-6 h-6 border-l border-dashed border-primary/25" />
                <div className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex gap-3">
                    <TicketPercent className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">Kiểm tra voucher</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Mức giảm, đơn tối thiểu, hạn sử dụng.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Giảm tiền", "Giảm %", "Freeship"].map((label) => (
                      <span
                        key={label}
                        className="rounded-md bg-surface px-2 py-1 text-[11px] font-medium text-muted-foreground"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-6 h-6 border-l border-dashed border-primary/25" />
                <div className="rounded-2xl bg-[#e8eedf] p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">
                        Hiểu điều kiện cashback
                      </p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Ai chi trả? Đơn nào hợp lệ? Khi nào được duyệt?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to="/how-it-works"
                className="flex items-center justify-between border-t border-border bg-white px-6 py-4 text-xs font-semibold text-primary"
              >
                Một phút để hiểu cách hoạt động
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page py-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">
            Bạn đang quan tâm điều gì?
          </h2>
          <Link to="/stores" className="quiet-link text-xs">
            Tất cả cửa hàng
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {shoppingCategories.map((category) => (
            <Link
              key={category.slug}
              to="/search"
              search={{ q: category.label }}
              className="group flex flex-col items-center gap-2 rounded-xl px-2 py-3 transition-colors hover:bg-white"
            >
              <CategoryIcon slug={category.slug} />
              <span className="text-xs font-medium sm:text-sm">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="container-page py-9 md:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Ưu đãi từ nguồn đã kết nối</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
              Voucher Shopee mới cập nhật
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Kiểm tra điều kiện, rồi mở mã trực tiếp trên Shopee.
            </p>
          </div>
          <Link to="/shopee-vouchers" className="quiet-link">
            Xem danh sách
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <LatestVouchers />
      </section>
      <section className="container-page py-9 md:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Bắt đầu từ nơi bạn thường mua</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
              Khám phá cửa hàng
            </h2>
          </div>
          <Link to="/stores" className="quiet-link">
            Xem thư mục
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {merchants
            .filter((m) =>
              ["shopee", "lazada", "agoda", "nike"].includes(m.slug),
            )
            .map((store) => (
              <StoreCard key={store.slug} store={store} />
            ))}
        </div>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          Thương hiệu trong thư mục không đồng nghĩa với quan hệ đối tác hoặc
          chương trình cashback đang có hiệu lực.
        </p>
      </section>
      <section className="mt-8 border-y border-border bg-white">
        <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Mua sắm có thông tin</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
              Tiết kiệm bắt đầu trước lúc thanh toán.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Cashback đang xây dựng một hành trình khám phá ưu đãi rõ ràng hơn
              cho người mua online tại Việt Nam.
            </p>
            <Link to="/about" className="quiet-link mt-5">
              Tìm hiểu về sản phẩm
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5">
            {[
              {
                n: "01",
                icon: Search,
                title: "Tìm thứ bạn cần",
                description:
                  "Nhập tên sản phẩm hoặc cửa hàng để khám phá kết quả trên các nền tảng.",
              },
              {
                n: "02",
                icon: ShieldCheck,
                title: "Đọc điều kiện ưu đãi",
                description:
                  "Phân biệt giảm giá ngay và tiền hoàn sau mua. Kiểm tra hạn dùng, đơn tối thiểu và đơn vị cung cấp.",
              },
              {
                n: "03",
                icon: MousePointer2,
                title: "Tiếp tục tại nơi bán",
                description:
                  "Giá, thanh toán và điều kiện cuối cùng được xác nhận ở website hoặc ứng dụng của cửa hàng.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="flex gap-5 border-b border-border pb-5 last:border-0"
              >
                <span className="text-xs font-semibold text-muted-foreground">
                  {step.n}
                </span>
                <div className="flex-1">
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <step.icon className="size-4 text-primary" />
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-page grid gap-4 py-12 md:grid-cols-2">
        {[
          {
            icon: Scale,
            title: "So sánh theo chi phí của bạn",
            text: "Nhập giá, mã giảm giá và tỷ lệ đã xác nhận để ước tính các lựa chọn. Không tự động giả định ưu đãi.",
            to: "/compare",
            cta: "Mở bảng so sánh",
          },
          {
            icon: Link2,
            title: "Đã có đường dẫn Shopee?",
            text: "Công cụ đổi link được giữ riêng cho nhu cầu chuyển đổi và chia sẻ đường dẫn sản phẩm.",
            to: "/tools",
            cta: "Mở công cụ đổi link",
          },
        ].map((item) => (
          <div key={item.to} className="panel p-6 md:p-7">
            <item.icon className="size-6 text-primary" />
            <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {item.text}
            </p>
            <Link to={item.to} className="quiet-link mt-5">
              {item.cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ))}
      </section>
      <section
        id="faq"
        className="container-page grid gap-8 py-9 md:py-12 lg:grid-cols-[.7fr_1.3fr]"
      >
        <div>
          <p className="eyebrow">Rõ ràng trước khi bắt đầu</p>
          <h2 className="mt-3 text-3xl font-semibold">
            Bạn hỏi, Cashback trả lời.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Thông tin về ưu đãi, điều kiện và phạm vi sản phẩm hiện tại.
          </p>
          <Link to="/contact" className="quiet-link mt-5">
            Cần thêm trợ giúp?
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <FAQ />
      </section>
      <section className="container-page py-9">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#e8eedf] p-7 md:flex-row md:items-center md:p-9">
          <div className="max-w-xl">
            <p className="eyebrow">Dành cho doanh nghiệp & đối tác</p>
            <h2 className="mt-3 text-2xl font-semibold">
              Cùng làm ưu đãi dễ tìm, dễ hiểu hơn.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Bạn có nguồn ưu đãi, chương trình affiliate hoặc ý tưởng hợp tác?
              Kết nối với đội ngũ đang xây dựng Cashback.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link to="/contact">
              Trao đổi hợp tác
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
