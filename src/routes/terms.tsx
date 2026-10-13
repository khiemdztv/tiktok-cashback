"use client";
import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
const sections = [
  {
    title: "Phạm vi sản phẩm",
    text: "Cashback là công cụ khám phá thông tin mua sắm, voucher và chương trình tiền hoàn. Website không bán sản phẩm, không xử lý thanh toán và hiện không cung cấp tài khoản, ví hoặc chức năng chi trả tiền hoàn cho người dùng.",
  },
  {
    title: "Giá và thông tin ưu đãi",
    text: "Giá tìm được được trích xuất từ nội dung nguồn và có thể khác giá thực tế tại thời điểm mua. Voucher từ nguồn đã kết nối có thể hết lượt, hết ngân sách hoặc không áp dụng cho tài khoản hay sản phẩm của bạn. Cần kiểm tra điều kiện tại nơi bán trước khi thanh toán.",
  },
  {
    title: "Cashback và liên kết tiếp thị",
    text: "Liên kết trên website có thể là liên kết tiếp thị và có thể tạo hoa hồng cho bên giới thiệu nếu chương trình công nhận giao dịch. Điều này không đồng nghĩa người dùng sẽ được hoàn tiền. Chỉ có quyền nhận cashback khi một chương trình riêng quy định rõ điều kiện và đơn vị chi trả.",
  },
  {
    title: "Công cụ ước tính và phân tích",
    text: "Bảng so sánh tính theo số liệu bạn nhập và chưa bao gồm mọi loại phí. Kết quả AI mang tính tham khảo, có thể sai hoặc thiếu thông tin. Không coi các kết quả này là xác nhận giá bán hoặc cam kết tiết kiệm.",
  },
  {
    title: "Mua hàng và hỗ trợ giao dịch",
    text: "Thanh toán, giao hàng, đổi trả và các tranh chấp giao dịch được xử lý tại nơi bán hoặc đơn vị cung cấp chương trình. Hãy liên hệ đơn vị đó với các vấn đề liên quan đến đơn hàng và tiền hoàn.",
  },
  {
    title: "Sử dụng dịch vụ",
    text: "Sử dụng công cụ trong phạm vi khám phá và mua sắm hợp lệ. Không gửi dữ liệu bí mật, không lạm dụng yêu cầu tự động hoặc can thiệp hoạt động của website. Dịch vụ có giới hạn lượt yêu cầu và có thể tạm thời chưa sẵn sàng.",
  },
  {
    title: "Cập nhật và liên hệ",
    text: "Phạm vi sản phẩm và các nội dung này có thể được cập nhật khi chức năng phát triển. Nếu cần làm rõ nội dung, hãy liên hệ đội ngũ qua địa chỉ email chính thức bên dưới.",
  },
];
export default function TermsPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="Điều khoản sử dụng"
        subtitle="Phạm vi sản phẩm và những điều cần hiểu trước khi sử dụng. Cập nhật: 13/10/2026."
      />
      <div className="container-page max-w-3xl space-y-7 py-10">
        {sections.map((item, index) => (
          <section key={item.title}>
            <h2 className="text-lg font-semibold">
              {index + 1}. {item.title}
            </h2>
            <p className="mt-3 text-sm leading-8 text-muted-foreground">
              {item.text}
            </p>
          </section>
        ))}
        <a href="mailto:admin@cashback.id.vn" className="quiet-link">
          admin@cashback.id.vn
        </a>
      </div>
    </SiteLayout>
  );
}
