"use client";


import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
import { LAST_UPDATED } from "@/src/data/mock";



const sections = [
  {
    title: "1. Dữ liệu chúng tôi thu thập",
    body: "Ở phiên bản hiện tại, cashback.id.vn không yêu cầu tài khoản và không thu thập thông tin cá nhân nhạy cảm. Chúng tôi có thể thu thập dữ liệu ẩn danh về lượt truy cập và từ khoá tìm kiếm để cải thiện chất lượng thông tin.",
  },
  {
    title: "2. Mục đích sử dụng",
    body: "Dữ liệu được dùng để hiểu người dùng đang quan tâm điều gì, ưu tiên cập nhật chương trình cashback phù hợp và cải thiện trải nghiệm tìm kiếm.",
  },
  {
    title: "3. Cookie",
    body: "Chúng tôi có thể sử dụng cookie kỹ thuật để ghi nhớ tuỳ chọn hiển thị. Bạn có thể tắt cookie trong trình duyệt, một số tính năng có thể hoạt động không đầy đủ.",
  },
  {
    title: "4. Chia sẻ dữ liệu",
    body: "Chúng tôi không bán dữ liệu người dùng. Dữ liệu tổng hợp, ẩn danh có thể được dùng cho mục đích thống kê nội bộ.",
  },
  {
    title: "5. Liên kết bên thứ ba",
    body: "Khi bạn nhấn vào liên kết dẫn tới cửa hàng hoặc đơn vị cung cấp cashback, việc xử lý dữ liệu tuân theo chính sách bảo mật của nền tảng đó.",
  },
  {
    title: "6. Liên hệ",
    body: "Mọi câu hỏi về quyền riêng tư, vui lòng liên hệ Facebook hoặc Zalo ở cuối trang.",
  },
];

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <PageHeader title="Chính sách bảo mật" subtitle={`Cập nhật lần cuối: ${LAST_UPDATED}`} />
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
