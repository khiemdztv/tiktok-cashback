"use client";
import { useState, useEffect } from "react";

interface Order {
  id: string;
  phone: string;
  walletType: string;
  bankAccount?: string;
  productName: string;
  productPrice: number;
  commissionAmount: number;
  cashbackAmount: number;
  status: string;
  createdAt: string;
  paidAt?: string;
  affShortUrl: string;
}

interface GroupedUser {
  phone: string;
  walletType: string;
  bankAccount?: string;
  orders: Order[];
  totalPending: number;
  totalPaid: number;
}

function formatVND(n: number) { return n.toLocaleString("vi-VN") + "đ"; }

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    setLoading(true);
    const res = await fetch("/api/orders?admin=1", { headers: { "x-admin-password": password } });
    if (!res.ok) { setError("Sai mật khẩu"); setLoading(false); return; }
    const data = await res.json();
    setOrders(data);
    setAuthed(true);
    setLoading(false);
  }

  async function markPaid(id: string) {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "paid", paidAt: new Date().toISOString() } : o));
  }

  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-lg w-80">
        <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h1>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Mật khẩu admin" onKeyDown={e => e.key === "Enter" && login()}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-3 outline-none" />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button onClick={login} disabled={loading}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </div>
    </div>
  );

  const grouped: GroupedUser[] = Object.values(
    orders.reduce((acc, o) => {
      if (!acc[o.phone]) acc[o.phone] = { phone: o.phone, walletType: o.walletType, bankAccount: o.bankAccount, orders: [], totalPending: 0, totalPaid: 0 };
      acc[o.phone].orders.push(o);
      if (o.status === "pending") acc[o.phone].totalPending += o.cashbackAmount;
      else acc[o.phone].totalPaid += o.cashbackAmount;
      return acc;
    }, {} as Record<string, GroupedUser>)
  );

  const totalPending = grouped.reduce((s, u) => s + u.totalPending, 0);
  const totalOrders = orders.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Tổng đơn</p>
            <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Cần hoàn tháng này</p>
            <p className="text-2xl font-bold text-orange-500">{formatVND(totalPending)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Số người dùng</p>
            <p className="text-2xl font-bold text-gray-800">{grouped.length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Số điện thoại</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Ví / TK NH</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Số đơn</th>
                <th className="text-right px-4 py-3 font-semibold text-orange-500">Cần hoàn</th>
                <th className="text-right px-4 py-3 font-semibold text-green-600">Đã hoàn</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((user) => (
                <tr key={user.phone} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-800">{user.phone}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {user.bankAccount ? `🏦 ${user.bankAccount}` : `📱 ${user.walletType}`}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{user.orders.length}</td>
                  <td className="px-4 py-3 text-right font-bold text-orange-500">{formatVND(user.totalPending)}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">{formatVND(user.totalPaid)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end flex-wrap">
                      {user.orders.filter(o => o.status === "pending").map(o => (
                        <button key={o.id} onClick={() => markPaid(o.id)}
                          className="text-xs bg-green-500 hover:bg-green-600 text-white px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap">
                          ✓ Đã trả {formatVND(o.cashbackAmount)}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {grouped.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Chưa có đơn nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
