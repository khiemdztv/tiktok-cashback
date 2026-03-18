# TikTok Shop Cashback Website

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Mở http://localhost:3000 → trang chủ
Mở http://localhost:3000/admin → admin dashboard (mật khẩu: admin123)

## Deploy lên Railway

1. Push code lên GitHub
2. Vào railway.app → New Project → Deploy from GitHub
3. Add PostgreSQL (optional, hiện tại dùng JSON file)
4. Set environment variables:
   - ACCESSTRADE_API_KEY=your_key
   - ADMIN_PASSWORD=your_password
5. Deploy → Done!

## Cấu trúc

- app/page.tsx — Trang chủ user
- app/admin/page.tsx — Dashboard admin
- app/api/generate-link/route.ts — Tạo affiliate link
- app/api/orders/route.ts — Quản lý đơn hàng
- lib/db.ts — Lưu trữ JSON
- data/db.json — Database (tự tạo khi chạy)
