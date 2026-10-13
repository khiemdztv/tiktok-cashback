"use client";
import {
  Search,
  Ticket,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { SiteLayout, PageHeader } from "@/src/components/layout/SiteLayout";
import { FAQ } from "@/src/components/content/FAQ";
import { Link } from "@/src/lib/navigation";
export default function HowItWorksPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="Tìm, kiểm tra, rồi mua."
        subtitle="Cashback giúp bạn khám phá thông tin. Giá cuối cùng, điều kiện ưu đãi và thanh toán được xác nhận tại nơi bán."
      />
      <div className="container-page py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Tìm sản phẩm hoặc cửa hàng",
              text: "Dùng tìm kiếm để khám phá các nguồn liên quan. Giá trích xuất từ kết quả tìm kiếm có thể khác giá tại thời điểm mở trang.",
            },
            {
              icon: Ticket,
              title: "Đọc điều kiện ưu đãi",
              text: "Voucher có giá trị đơn tối thiểu, danh mục và hạn dùng. Cashback cần chương trình riêng, có điều kiện theo dõi và duyệt giao dịch.",
            },
            {
              icon: ExternalLink,
              title: "Tiếp tục tại cửa hàng",
              text: "Mở trang bán để kiểm tra lại. Liên kết có thể là liên kết tiếp thị; việc bấm mở không phải xác nhận quyền nhận cashback.",
            },
          ].map((item, index) => (
            <section key={item.title} className="panel p-6">
              <div className="flex items-center justify-between">
                <item.icon className="size-6 text-primary" />
                <span className="text-xs text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <h2 className="mt-6 text-lg font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.text}
              </p>
            </section>
          ))}
        </div>
        <section className="mt-8 grid gap-6 rounded-2xl bg-[#e8eedf] p-7 md:grid-cols-2">
          <div>
            <ShieldCheck className="size-6 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">
              Đọc đúng từng loại thông tin.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Cashback chỉ hiển thị chương trình hoàn tiền khi có nguồn được xác
              nhận. Dữ liệu không có không được thay bằng tỷ lệ mẫu.
            </p>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold">Giá tìm được</dt>
              <dd className="mt-1 leading-6 text-muted-foreground">
                Giá trích xuất từ nội dung tìm kiếm, cần kiểm tra lại tại nơi
                bán.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Voucher</dt>
              <dd className="mt-1 leading-6 text-muted-foreground">
                Giảm giá tại bước thanh toán khi đáp ứng điều kiện.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Cashback</dt>
              <dd className="mt-1 leading-6 text-muted-foreground">
                Khoản hoàn có thể được duyệt sau giao dịch theo chương trình;
                hiện Cashback không trực tiếp chi trả.
              </dd>
            </div>
          </dl>
        </section>
        <section id="faq" className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">Câu hỏi thường gặp</h2>
          <FAQ />
        </section>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link to="/search" className="quiet-link">
            Bắt đầu tìm kiếm
            <ArrowRight className="size-4" />
          </Link>
          <Link to="/contact" className="quiet-link">
            Cần trợ giúp?
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
