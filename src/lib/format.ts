export function formatVnd(value: number): string {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

export function formatPercent(value: number): string {
  return `${value.toString().replace(".", ",")}%`;
}

/** Giá hiệu dụng = (giá - voucher) - cashback tính trên phần còn lại */
export function effectivePrice(price: number, voucher: number, cashbackRate: number): number {
  const afterVoucher = Math.max(price - voucher, 0);
  return Math.round(afterVoucher * (1 - cashbackRate / 100));
}
