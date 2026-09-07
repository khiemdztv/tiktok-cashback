"use client";

import { Link } from "@/src/lib/navigation";

import { SiteLayout } from "@/src/components/layout/SiteLayout";
import { Button } from "@/src/components/ui/button";



const steps = [
  { n: "01", title: "Tìm kiếm", desc: "Tìm sản phẩm, cửa hàng hoặc dịch vụ." },
  { n: "02", title: "Kiểm tra", desc: "Xem cashback, voucher và ưu đãi." },
  { n: "03", title: "So sánh", desc: "Tìm phương án tiết kiệm nhất." },
  {
    n: "04",
    title: "Mua hàng",
    desc: "Đi đến website/đối tác phù hợp và hoàn tất giao dịch theo điều kiện.",
  },
];

const faqs = [
  {
    q: "Cashback ID có giữ tiền của tôi không?",
    a: "Không. Cashback ID không giữ tiền, không xử lý thanh toán và không trực tiếp chi trả cashback.",
  },
  {
    q: "Vì sao tỷ lệ cashback thay đổi?",
    a: "Các đối tác điều chỉnh tỷ lệ theo chiến dịch, ngành hàng và thời điểm. Chúng tôi cập nhật thông tin thường xuyên nhưng bạn nên kiểm tra lại điều kiện trước khi mua.",
  },
  {
    q: "Dùng Cashback ID có mất phí không?",
    a: "Không. Việc tra cứu thông tin cashback, voucher và so sánh giá hoàn toàn miễn phí.",
  },
];

export default function HowItWorksPage() {
  return (
    <SiteLayout>
      <section className="hero-glow border-b border-border">
        <div className="container-page py-16 text-center md:py-20">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold md:text-5xl">
            Cashback ID hoạt động như thế nào?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Bốn bước đơn giản để bạn không bỏ lỡ khoản tiết kiệm nào.
          </p>
        </div>
      </section>

      <div className="container-page py-14">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <span className="text-3xl font-extrabold text-primary/30">{s.n}</span>
              <h2 className="mt-3 text-lg font-bold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-surface p-8 text-center md:p-12">
          <p className="mx-auto max-w-2xl text-lg font-medium">
            Cashback ID không giữ tiền của bạn và không trực tiếp xử lý cashback.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Chúng tôi tổng hợp thông tin từ các chương trình cashback, voucher và giá bán để bạn dễ
            dàng so sánh. Việc nhận cashback được thực hiện bởi đơn vị cung cấp chương trình.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl">
              <Link to="/cashback">Xem cashback đang có</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/stores">Khám phá cửa hàng</Link>
            </Button>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-bold">Câu hỏi thường gặp</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
