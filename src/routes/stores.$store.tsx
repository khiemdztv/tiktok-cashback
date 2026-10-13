"use client";
import { useParams, notFound } from "next/navigation";
import {
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Ticket,
  Info,
} from "lucide-react";
import { Link } from "@/src/lib/navigation";
import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { Button } from "@/src/components/ui/button";
import { merchantBySlug } from "@/src/data/catalog";
import { LatestVouchers } from "@/src/components/offers/LatestVouchers";
export default function StoreDetailPage() {
  const params = useParams<{ store: string }>();
  const store = merchantBySlug(params.store);
  if (!store) notFound();
  return (
    <SiteLayout>
      <div className="border-b border-border bg-surface">
        <div className="container-page py-8 md:py-12">
          <nav
            aria-label="Đường dẫn"
            className="flex gap-2 text-xs text-muted-foreground"
          >
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <Link to="/stores">Cửa hàng</Link>
            <span>/</span>
            <span aria-current="page">{store.name}</span>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <StoreLogo store={store} size="lg" />
            <div>
              <p className="eyebrow">{store.category}</p>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                {store.name}
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            {store.description}
          </p>
        </div>
      </div>
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          <section className="panel p-6 md:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-primary" />
              <h2 className="text-xl font-semibold">Thông tin cashback</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Chưa có mức cashback được xác nhận cho {store.name}. Khi có nguồn
              dữ liệu phù hợp, thông tin tỷ lệ, đơn vị cung cấp và điều kiện sẽ
              được hiển thị tại đây.
            </p>
            <p className="mt-4 rounded-xl bg-surface p-4 text-xs leading-6 text-muted-foreground">
              Truy cập website cửa hàng hoặc đổi link sản phẩm không đảm bảo
              phát sinh tiền hoàn cho người dùng.
            </p>
          </section>
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Ticket className="size-5 text-primary" />
              Voucher & ưu đãi
            </h2>
            {store.slug === "shopee" ? (
              <div className="mt-5">
                <LatestVouchers limit={2} />
              </div>
            ) : (
              <div className="panel mt-5 p-6">
                <p className="text-sm leading-7 text-muted-foreground">
                  Chưa có voucher từ nguồn đã kết nối cho cửa hàng này. Kiểm tra
                  ưu đãi trên website chính thức trước khi mua.
                </p>
              </div>
            )}
          </section>
          <section className="panel p-6">
            <h2 className="font-semibold">Trước khi thanh toán</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {[
                "Kiểm tra giá cuối cùng, phí vận chuyển và các khoản phụ thu.",
                "Đọc điều kiện mã giảm giá, hạn sử dụng và sản phẩm được áp dụng.",
                "Nếu tham gia cashback, kiểm tra đường dẫn và đơn vị sẽ theo dõi, chi trả.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="space-y-4">
          <div className="panel p-6 lg:sticky lg:top-28">
            <p className="eyebrow">Bước tiếp theo</p>
            <h2 className="mt-3 text-lg font-semibold">
              Khám phá {store.name}
            </h2>
            <Button asChild className="mt-5 w-full">
              <Link to="/search" search={{ q: store.name }}>
                Tìm sản phẩm
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" className="mt-3 w-full">
              <a href={store.website} target="_blank" rel="noopener noreferrer">
                Mở website cửa hàng
                <ExternalLink />
              </a>
            </Button>
            <p className="mt-5 flex gap-2 text-xs leading-6 text-muted-foreground">
              <Info className="mt-1 size-4 shrink-0" />
              Đường dẫn website chính thức không kích hoạt cashback.
            </p>
            <Link to="/how-it-works" className="quiet-link mt-5 text-xs">
              Tìm hiểu cách hoạt động
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
