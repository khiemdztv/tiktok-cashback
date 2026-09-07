"use client";
import { useState } from "react";

interface Order {
  id: string;
  phone: string;
  walletType: string;
  bankAccount?: string;
  originalUrl: string;
  productName: string;
  cashbackAmount: number;
  status: string;
  createdAt: string;
  paidAt?: string;
  affShortUrl: string;
  affUrl: string;
}

function formatVND(n: number) { return n.toLocaleString("vi-VN") + "đ"; }

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});
  const [cashbackInputs, setCashbackInputs] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"new" | "linked" | "paid" | "all">("new");

  async function login() {
    setLoading(true);
    const res = await fetch("/api/orders?admin=1", { headers: { "x-admin-password": password } });
    if (!res.ok) { setError("Sai mật khẩu"); setLoading(false); return; }
    const data = await res.json();
    setOrders(data);
    setAuthed(true);
    setLoading(false);
  }

  async function setAffLink(id: string) {
    const affUrl = linkInputs[id]?.trim();
    const cashback = parseInt(cashbackInputs[id] || "0");
    if (!affUrl) return;
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id, action: "set_link", affUrl, cashbackAmount: cashback }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, affShortUrl: affUrl, affUrl, cashbackAmount: cashback } : o));
    setLinkInputs(prev => { const n = { ...prev }; delete n[id]; return n; });
    setCashbackInputs(prev => { const n = { ...prev }; delete n[id]; return n; });
  }

  async function markPaid(id: string) {
    if (!confirm("Xác nhận đã chuyển tiền cho khách?")) return;
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "paid", paidAt: new Date().toISOString() } : o));
  }

  async function markRejected(id: string) {
    if (!confirm("Xác nhận huỷ đơn này?")) return;
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id, action: "reject" }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "rejected" } : o));
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

  const newOrders = orders.filter(o => o.status === "pending" && (!o.affShortUrl || o.affShortUrl === ""));
  const linkedOrders = orders.filter(o => o.status === "pending" && o.affShortUrl && o.affShortUrl !== "");
  const paidOrders = orders.filter(o => o.status === "paid");
  const totalPending = linkedOrders.reduce((s, o) => s + o.cashbackAmount, 0);

  const displayOrders = tab === "new" ? newOrders : tab === "linked" ? linkedOrders : tab === "paid" ? paidOrders : orders;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard - Shopee Cashback</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Chờ tạo link</p>
            <p className="text-2xl font-bold text-blue-500">{newOrders.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Chờ thanh toán</p>
            <p className="text-2xl font-bold text-orange-500">{linkedOrders.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Cần hoàn</p>
            <p className="text-2xl font-bold text-red-500">{formatVND(totalPending)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Đã hoàn</p>
            <p className="text-2xl font-bold text-green-600">{paidOrders.length} đơn</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: "new" as const, label: `Chờ link (${newOrders.length})`, color: "blue" },
            { key: "linked" as const, label: `Chờ thanh toán (${linkedOrders.length})`, color: "orange" },
            { key: "paid" as const, label: `Đã hoàn (${paidOrders.length})`, color: "green" },
            { key: "all" as const, label: `Tất cả (${orders.length})`, color: "gray" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key ? `bg-${t.color}-500 text-white` : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Order cards */}
        <div className="space-y-3">
          {displayOrders.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-100">
              Không có đơn nào
            </div>
          )}
          {displayOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800">{order.phone}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === "paid" ? "bg-green-100 text-green-700" :
                      order.status === "rejected" ? "bg-red-100 text-red-700" :
                      order.affShortUrl ? "bg-orange-100 text-orange-600" :
                      "bg-blue-100 text-blue-600"
                    }`}>
                      {order.status === "paid" ? "Đã hoàn" :
                       order.status === "rejected" ? "Đã huỷ" :
                       order.affShortUrl ? "Chờ thanh toán" : "Chờ link"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {order.bankAccount ? `🏦 ${order.bankAccount}` : `📱 ${order.walletType}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{order.productName}</p>
                  <a href={order.originalUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline truncate block">{order.originalUrl}</a>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                    {order.cashbackAmount > 0 && <span className="ml-2 text-primary font-bold">Cashback: {formatVND(order.cashbackAmount)}</span>}
                  </p>
                  {order.affShortUrl && order.affShortUrl !== "" && (
                    <p className="text-xs text-green-600 mt-1 truncate">🔗 {order.affShortUrl}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {/* New order → need to add affiliate link */}
                  {order.status === "pending" && (!order.affShortUrl || order.affShortUrl === "") && (
                    <div className="flex flex-col gap-1.5 w-full md:w-72">
                      <input
                        value={linkInputs[order.id] || ""}
                        onChange={e => setLinkInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                        placeholder="Dán link affiliate Shopee..."
                        className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary w-full"
                      />
                      <div className="flex gap-1.5">
                        <input
                          value={cashbackInputs[order.id] || ""}
                          onChange={e => setCashbackInputs(prev => ({ ...prev, [order.id]: e.target.value.replace(/\D/g, "") }))}
                          placeholder="Cashback (vnđ)"
                          className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary flex-1"
                        />
                        <button onClick={() => setAffLink(order.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                          Gán link
                        </button>
                        <button onClick={() => markRejected(order.id)}
                          className="bg-red-400 hover:bg-red-500 text-white text-xs px-2.5 py-1.5 rounded-lg transition-colors">
                          Huỷ
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Linked order → can mark as paid */}
                  {order.status === "pending" && order.affShortUrl && order.affShortUrl !== "" && (
                    <div className="flex gap-2">
                      <button onClick={() => markPaid(order.id)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                        ✓ Đã chuyển {order.cashbackAmount > 0 ? formatVND(order.cashbackAmount) : "tiền"}
                      </button>
                      <button onClick={() => markRejected(order.id)}
                        className="bg-red-400 hover:bg-red-500 text-white text-xs px-2.5 py-1.5 rounded-lg transition-colors">
                        Huỷ
                      </button>
                    </div>
                  )}

                  {/* Paid */}
                  {order.status === "paid" && order.paidAt && (
                    <span className="text-xs text-green-600">Hoàn lúc {new Date(order.paidAt).toLocaleString("vi-VN")}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
