"use client";
import {
  ArrowRight,
  WalletCards,
  TicketPercent,
  ShieldCheck,
} from "lucide-react";
import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
import { Button } from "@/src/components/ui/button";
import { Link } from "@/src/lib/navigation";
export default function CashbackPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="Cashback, với điều kiện rõ ràng."
        subtitle="Khám phá cơ hội nhận lại một phần giá trị đơn hàng. Tiền hoàn khác với mã giảm giá và luôn phụ thuộc chương trình cung cấp."
      />
      <div className="container-page py-10">
        <div className="panel grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div className="max-w-2xl">
            <WalletCards className="size-8 text-primary" />
            <h2 className="mt-5 text-2xl font-semibold">
              Chưa có chương trình cashback được xác nhận để hiển thị.
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Chúng tôi đang hoàn thiện nguồn dữ liệu tỷ lệ hoàn và điều kiện.
              Bạn có thể tiếp tục khám phá voucher Shopee từ nguồn đã kết nối
              hoặc tìm sản phẩm trong lúc này.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link to="/shopee-vouchers">
                Khám phá voucher
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/search">Tìm sản phẩm</Link>
            </Button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: WalletCards,
              title: "Tiền hoàn sau giao dịch",
              text: "Chương trình xem xét giao dịch theo điều kiện trước khi duyệt khoản hoàn.",
            },
            {
              icon: TicketPercent,
              title: "Giảm giá lúc thanh toán",
              text: "Voucher được áp dụng tại cửa hàng. Khả năng kết hợp với cashback tùy chương trình.",
            },
            {
              icon: ShieldCheck,
              title: "Kiểm tra đơn vị chi trả",
              text: "Cashback hiện không giữ tiền hoặc trực tiếp chi trả. Mở cửa hàng không tự kích hoạt tiền hoàn.",
            },
          ].map((item) => (
            <section key={item.title} className="panel p-6">
              <item.icon className="size-5 text-primary" />
              <h2 className="mt-4 font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.text}
              </p>
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <Link to="/how-it-works" className="quiet-link">
            Hiểu cách hoạt động
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="mailto:admin@cashback.id.vn"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Có chương trình muốn hợp tác? admin@cashback.id.vn
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}
