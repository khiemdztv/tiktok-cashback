"use client";
import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
const sections = [
  {
    title: "Dữ liệu trong trải nghiệm hiện tại",
    text: "Website không yêu cầu tài khoản, số điện thoại, ví hoặc ngân hàng để tìm kiếm, xem voucher và đổi link. Hệ thống xử lý từ khóa tìm kiếm, đường dẫn bạn gửi và thông tin kỹ thuật cần thiết để phản hồi yêu cầu.",
  },
  {
    title: "Tìm kiếm và đường dẫn sản phẩm",
    text: "Từ khóa có thể được gửi đến dịch vụ tìm kiếm You.com để trả kết quả. Đường dẫn Shopee bạn nhập được gửi đến dịch vụ chuyển đổi link. Không đưa thông tin cá nhân, mật khẩu hoặc dữ liệu bí mật vào ô tìm kiếm hay đường dẫn.",
  },
  {
    title: "Dữ liệu kỹ thuật và bộ nhớ đệm",
    text: "Hệ thống dùng thông tin kết nối để giới hạn lượt yêu cầu và lưu tạm kết quả tìm kiếm nhằm giảm các yêu cầu lặp lại. Việc mở voucher có thể được ghi nhận như lượt mở liên kết; đây không phải xác nhận mua hàng hay sử dụng thành công mã.",
  },
  {
    title: "Tài nguyên và nền tảng bên ngoài",
    text: "Website tải phông chữ và có thể hiển thị hình ảnh từ nguồn ngoài. Khi mở đường dẫn cửa hàng, Facebook, Zalo hoặc chương trình ưu đãi, dữ liệu tại nền tảng đó được xử lý theo chính sách riêng của họ.",
  },
  {
    title: "Cookie và tùy chọn",
    text: "Trải nghiệm hiện tại không cung cấp quảng cáo hành vi hoặc tùy chọn theo dõi marketing trong website. Các nền tảng bên ngoài có thể sử dụng cookie riêng. Bạn có thể kiểm soát cookie và quyền truy cập qua cài đặt trình duyệt.",
  },
  {
    title: "Liên hệ về dữ liệu",
    text: "Nếu gửi thư hỗ trợ, bạn chủ động chia sẻ nội dung qua email. Chỉ gửi thông tin cần thiết để xử lý vấn đề. Mọi câu hỏi về dữ liệu hoặc yêu cầu liên quan, vui lòng liên hệ địa chỉ chính thức bên dưới.",
  },
];
export default function PrivacyPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="Quyền riêng tư"
        subtitle="Cách dữ liệu được xử lý trong phạm vi sản phẩm hiện tại. Cập nhật: 13/10/2026."
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
