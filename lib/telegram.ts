const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

export async function sendTelegramNotification(message: string) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram not configured, skipping notification");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );
    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram send failed:", data);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Telegram error:", e);
    return false;
  }
}

export function formatNewOrderMessage(order: {
  id: string;
  phone: string;
  walletType: string;
  bankAccount?: string | null;
  originalUrl: string;
  productName: string;
}) {
  const paymentInfo = order.bankAccount
    ? `🏦 TK NH: ${order.bankAccount}`
    : `📱 Ví: ${order.walletType}`;

  return `🔔 <b>ĐƠN MỚI CẦN TẠO LINK</b>

📱 SĐT: <code>${order.phone}</code>
${paymentInfo}
📦 SP: ${order.productName || "Chưa rõ"}
🔗 Link gốc: ${order.originalUrl}

🆔 Order: <code>${order.id}</code>

→ Vào Shopee Affiliate converter tạo link rồi cập nhật trên Admin Dashboard.`;
}

export function formatOrderPaidMessage(order: {
  phone: string;
  cashbackAmount: number;
  productName: string;
}) {
  return `✅ <b>ĐÃ THANH TOÁN CASHBACK</b>

📱 SĐT: <code>${order.phone}</code>
💰 Số tiền: ${order.cashbackAmount.toLocaleString("vi-VN")}đ
📦 SP: ${order.productName}`;
}
