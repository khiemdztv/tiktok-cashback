"use client";

import { Mail, MapPin, MessageCircle } from "lucide-react";

import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { FACEBOOK_URL, ZALO_URL, FacebookIcon, ZaloIcon } from "@/src/components/layout/SocialLinks";



export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="hero-glow border-b border-border">
        <div className="container-page py-16 md:py-20">
          <h1 className="max-w-3xl text-4xl font-extrabold md:text-5xl">
            Giúp việc mua sắm online trở nên minh bạch hơn.
          </h1>
        </div>
      </section>

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            cashback.id.vn ra đời để việc khám phá chương trình cashback, voucher, khuyến mãi và lựa
            chọn mua hàng tốt hơn trở nên dễ dàng — mà bạn không phải mở hàng chục website khác nhau
            trước mỗi lần thanh toán.
          </p>
          <p>
            Mỗi ngày có hàng trăm chương trình cashback thay đổi tỷ lệ, hàng nghìn mã giảm giá được
            phát hành và giá sản phẩm dao động giữa các sàn. Chúng tôi tổng hợp những thông tin đó
            vào một nơi, trình bày rõ ràng, kèm điều kiện áp dụng và thời điểm cập nhật.
          </p>
          <p>
            Chúng tôi tin rằng thông tin minh bạch quan trọng hơn con số hấp dẫn. Vì vậy cashback.id.vn
            luôn ghi rõ tỷ lệ là “lên đến”, nêu điều kiện đi kèm và nhắc bạn kiểm tra lại trước khi
            mua.
          </p>

          <div className="rounded-3xl bg-surface p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Tầm nhìn</p>
            <p className="mt-3 text-xl font-bold text-foreground">
              Không cần nhớ mình phải kiểm tra cashback ở đâu. Chỉ cần nhớ cashback.id.vn.
            </p>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-7 shadow-soft">
          <h2 className="text-lg font-bold">Liên hệ</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Bạn là cửa hàng, đối tác cashback hoặc muốn góp ý? Rất mong nhận được tin từ bạn.
          </p>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <FacebookIcon className="size-4 text-primary" /><a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Facebook · khiemdztv</a>
            </li>
            <li className="flex items-center gap-3">
              <ZaloIcon className="size-5" /><a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Nhắn qua Zalo</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-primary" /> TP. Hồ Chí Minh, Việt Nam
            </li>
          </ul>
        </aside>
      </div>
    </SiteLayout>
  );
}
