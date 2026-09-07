# cashback.id.vn

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Mở http://localhost:3000 để xem giao diện cashback.id.vn được chuyển từ mẫu thiết kế vào dự án Next.js hiện tại.

Các trang của mẫu được giữ lại: trang chủ, cashback, voucher, danh sách/chi tiết cửa hàng, so sánh giá, tìm kiếm, cách hoạt động, giới thiệu, điều khoản và bảo mật.

Tab **Công cụ** tại `/tools` chứa chức năng đổi link Shopee cũ. Chỉ nhập link sản phẩm, lấy link mới, sao chép hoặc mở link. Không đăng nhập, không nhập số điện thoại, ví hay ngân hàng. API đổi link không tạo đơn và không gửi thông báo Telegram. Endpoint tra cứu đơn công khai đã ngừng hoạt động (HTTP 410); dữ liệu và trang quản trị cũ vẫn được giữ lại.

Footer giữ `© 2026 cashback.id.vn - Powered by khiemdztv` cùng Facebook/Zalo và hai nút liên hệ nổi. Icon danh mục dùng Lucide; logo sàn được lưu nội bộ. Chuyển động hỗ trợ cài đặt giảm hiệu ứng của thiết bị.

## Dữ liệu và cấu hình

- `src/data/mock.ts` chứa dữ liệu mẫu. Cashback, voucher, cửa hàng và bảng so sánh hiện chưa kết nối nguồn dữ liệu trực tiếp. Giao diện có ghi chú dữ liệu tham khảo.
- Đổi link tiếp tục dùng `lib/shpee-cc.ts` và `SHOPEE_AFFILIATE_ID` từ cấu hình môi trường hiện có. Kết quả phụ thuộc dịch vụ `short.shpee.cc`.
- Không đưa `.env`, `.env.local`, database hoặc khóa API lên kho mã công khai.

## Kiểm tra bản production

```bash
npm run build
npm start
```

## Cấu trúc

- `app/` — Các route Next.js, metadata, API và CSS toàn cục.
- `src/routes/` — Toàn bộ giao diện trang được chuyển từ mẫu.
- `src/components/` — Layout, thẻ cashback/voucher, icon, tìm kiếm và công cụ đổi link.
- `src/lib/navigation.tsx` — Điều hướng của mẫu tích hợp với Next.js.
- `app/api/generate-link/route.ts` — Chuyển link, chỉ nhận `productUrl`.
- `public/brands/` — Logo SVG lưu nội bộ.
- `app/admin/`, `prisma/`, `lib/db.ts` — Quản trị và dữ liệu cũ.
