"use client";
import {
  Mail,
  ArrowUpRight,
  LifeBuoy,
  Handshake,
  MessageSquare,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/src/components/layout/SiteLayout";
import {
  FACEBOOK_URL,
  ZALO_URL,
  FacebookIcon,
  ZaloIcon,
} from "@/src/components/layout/SocialLinks";
import { Button } from "@/src/components/ui/button";
export default function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="Một địa chỉ để bắt đầu cuộc trao đổi."
        subtitle="Hỗ trợ người dùng, góp ý sản phẩm hoặc kết nối hợp tác. Đội ngũ Cashback nhận thông tin qua email và các kênh liên hệ dưới đây."
      />
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {[
            {
              icon: LifeBuoy,
              title: "Hỗ trợ trải nghiệm",
              text: "Gửi đường dẫn trang, mô tả vấn đề và ảnh màn hình nếu có. Không gửi mật khẩu, mã OTP hay thông tin ngân hàng.",
            },
            {
              icon: Handshake,
              title: "Nguồn ưu đãi & hợp tác",
              text: "Giới thiệu chương trình, nguồn dữ liệu hoặc hình thức hợp tác bạn đang quan tâm. Cashback đang phát triển sản phẩm và tìm kiếm những kết nối phù hợp.",
            },
            {
              icon: MessageSquare,
              title: "Góp ý sản phẩm",
              text: "Chia sẻ một nhu cầu mua sắm chưa được giải quyết hoặc điều bạn muốn trải nghiệm tốt hơn.",
            },
          ].map((item) => (
            <section key={item.title} className="panel flex gap-4 p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                <item.icon className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </section>
          ))}
        </div>
        <aside className="panel h-fit p-7">
          <Mail className="size-7 text-primary" />
          <p className="eyebrow mt-6">Email chính thức</p>
          <a
            href="mailto:admin@cashback.id.vn"
            className="mt-3 block break-all text-xl font-semibold text-primary"
          >
            admin@cashback.id.vn
          </a>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Nút bên dưới mở ứng dụng email của bạn để soạn thư gửi đội ngũ.
          </p>
          <Button asChild className="mt-5 w-full">
            <a href="mailto:admin@cashback.id.vn">
              Soạn email
              <ArrowUpRight />
            </a>
          </Button>
          <div className="mt-6 space-y-4 border-t border-border pt-5">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="quiet-link"
            >
              <FacebookIcon className="size-4" />
              Facebook
              <ArrowUpRight className="size-3.5" />
            </a>
            <a
              href={ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="quiet-link block"
            >
              <ZaloIcon className="mr-2 inline size-5" />
              Zalo
              <ArrowUpRight className="ml-2 inline size-3.5" />
            </a>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}
