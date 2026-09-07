"use client";


import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
import { LAST_UPDATED } from "@/src/data/mock";



const sections = [
  {
    title: "1. Phạm vi dịch vụ",
    body: "Cashback ID là nền tảng tổng hợp và cung cấp thông tin về chương trình cashback, voucher, khuyến mãi và giá bán. Chúng tôi không bán hàng, không xử lý thanh toán và không trực tiếp chi trả cashback.",
  },
  {
    title: "2. Tính chính xác của thông tin",
    body: "Thông tin trên Cashback ID được tổng hợp từ nhiều nguồn và có thể thay đổi bất kỳ lúc nào. Bạn cần kiểm tra lại tỷ lệ cashback, điều kiện voucher và giá bán tại website của đối tác trước khi giao dịch.",
  },
  {
    title: "3. Trách nhiệm của người dùng",
    body: "Bạn chịu trách nhiệm về quyết định mua hàng của mình, bao gồm việc đọc và tuân thủ điều kiện của từng chương trình cashback hoặc voucher.",
  },
  {
    title: "4. Giới hạn trách nhiệm",
    body: "Cashback ID không chịu trách nhiệm với các khoản cashback bị từ chối, voucher hết hạn, thay đổi giá hoặc tranh chấp phát sinh giữa bạn và đơn vị bán hàng hoặc đơn vị cung cấp cashback.",
  },
  {
    title: "5. Liên kết đến bên thứ ba",
    body: "Website có thể chứa liên kết đến các nền tảng bên thứ ba. Việc bạn sử dụng các nền tảng đó tuân theo điều khoản riêng của họ.",
  },
  {
    title: "6. Thay đổi điều khoản",
    body: "Chúng tôi có thể cập nhật điều khoản này theo thời gian. Phiên bản mới nhất luôn được đăng tải tại trang này.",
  },
];

export default function TermsPage() {
  return (
    <SiteLayout>
      <PageHeader title="Điều khoản sử dụng" subtitle={`Cập nhật lần cuối: ${LAST_UPDATED}`} />
      <div className="container-page max-w-3xl space-y-8 py-12">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-bold">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
