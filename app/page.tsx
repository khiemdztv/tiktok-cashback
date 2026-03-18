"use client";
import { useState, useEffect } from "react";

interface OrderResult {
  affUrl: string;
  affShortUrl: string;
  productName: string;
  productImage: string;
  productPrice: number;
  commissionAmount: number;
  commissionRate: number;
  cashbackAmount: number;
}

interface UserOrder {
  id: string;
  productName: string;
  cashbackAmount: number;
  status: string;
  createdAt: string;
  affShortUrl: string;
}

function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN") + " vnđ";
}

export default function Home() {
  const [showCreate, setShowCreate] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [walletType, setWalletType] = useState("momo");
  const [useBankAccount, setUseBankAccount] = useState(false);
  const [bankAccount, setBankAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [checkPhone, setCheckPhone] = useState("");
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkedPhone, setCheckedPhone] = useState("");
  const [stats, setStats] = useState({ pending: 0, paid: 0 });

  useEffect(() => {
    const saved = localStorage.getItem("cashback_phone");
    if (saved) {
      setPhone(saved);
      setCheckPhone(saved);
      loadStats(saved);
    }
  }, []);

  async function loadStats(p: string) {
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(p)}`);
      const data: UserOrder[] = await res.json();
      const pending = data.filter(o => o.status === "pending").reduce((s, o) => s + o.cashbackAmount, 0);
      const paid = data.filter(o => o.status === "paid").reduce((s, o) => s + o.cashbackAmount, 0);
      setStats({ pending, paid });
    } catch {}
  }

  async function handleGenerate() {
    if (!productUrl.trim()) return setError("Vui lòng nhập link sản phẩm");
    if (!phone.trim()) return setError("Vui lòng nhập số điện thoại");
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productUrl: productUrl.trim(), phone: phone.trim(), walletType, bankAccount: useBankAccount ? bankAccount : undefined }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Có lỗi xảy ra");
      setResult(data);
      localStorage.setItem("cashback_phone", phone.trim());
      loadStats(phone.trim());
    } catch { setError("Không thể kết nối server"); }
    finally { setLoading(false); }
  }

  async function handleCheck() {
    if (!checkPhone.trim()) return;
    setCheckLoading(true);
    setUserOrders([]);
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(checkPhone.trim())}`);
      const data = await res.json();
      setUserOrders(data);
      setCheckedPhone(checkPhone.trim());
      localStorage.setItem("cashback_phone", checkPhone.trim());
      loadStats(checkPhone.trim());
    } catch {}
    finally { setCheckLoading(false); }
  }

  function closeCreate() { setShowCreate(false); setResult(null); setError(""); setProductUrl(""); }
  function closeCheck() { setShowCheck(false); setUserOrders([]); setCheckedPhone(""); }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className="font-semibold text-gray-800">Hoàn tiền tiếp thị liên kết</span>
        </div>
        <nav className="flex gap-6 text-sm text-gray-600">
          <a href="/" className="hover:text-primary">Trang chủ</a>
          <a href="#" className="hover:text-primary">Hướng dẫn</a>
        </nav>
      </header>

      {/* Banner */}
      <div className="flex justify-center mt-4 px-4">
        <div className="w-full max-w-2xl h-36 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="text-center text-white z-10">
            <p className="text-xs opacity-80 mb-1">TĂNG MỨC HOA HỒNG CƠ BẢN</p>
            <p className="text-3xl font-black text-yellow-300">LÊN ĐẾN 6%</p>
            <p className="text-xs opacity-80 mt-1">CHO ĐƠN HÀNG ĐẾN TỪ MẠNG XÃ HỘI</p>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex justify-center mt-3 px-4">
        <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-50 rounded-full px-4 py-1.5 border border-gray-200">
          <span className="text-primary font-medium">%</span>
          <span>Tiền hoàn đến từ đâu?</span>
          <a href="#" className="text-primary font-medium ml-1">Tìm hiểu thêm →</a>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center mt-4 gap-6 text-sm">
        <span className="text-gray-600">Tiền hoàn: <span className="text-primary font-bold">{formatVND(stats.paid)}</span></span>
        <span className="text-gray-600">Chờ hoàn thành đơn: <span className="font-bold text-orange-500">{formatVND(stats.pending)}</span></span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <button onClick={() => setShowCreate(true)}
          className="bg-primary hover:bg-teal-700 text-white font-semibold px-12 py-3 rounded-lg text-base transition-colors">
          Tạo Link
        </button>
        <button onClick={() => setShowCheck(true)}
          className="bg-secondary hover:bg-green-900 text-white font-semibold px-10 py-3 rounded-lg text-base transition-colors">
          Tra cứu đơn
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-xs text-gray-400 border-t border-gray-100">
        © 2026 TikTok Cashback
      </footer>

      {/* Modal: Tạo link */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={closeCreate} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>

            {!result ? (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5">Tạo link tiếp thị liên kết</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">Link sản phẩm</label>
                    <input value={productUrl} onChange={e => setProductUrl(e.target.value)}
                      placeholder="Dán link sản phẩm vào đây"
                      className="w-full border border-primary rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      Số điện thoại <span className="text-gray-400 cursor-help" title="Dùng để tra cứu và nhận hoàn tiền">ⓘ</span>
                    </label>
                    <div className="flex gap-2">
                      <input value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                      {!useBankAccount && (
                        <select value={walletType} onChange={e => setWalletType(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none">
                          <option value="momo">Momo</option>
                          <option value="zalopay">ZaloPay</option>
                          <option value="vnpay">VNPay</option>
                        </select>
                      )}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={useBankAccount} onChange={e => setUseBankAccount(e.target.checked)}
                      className="rounded" />
                    Không có ví điện tử? Nhập tài khoản ngân hàng:
                  </label>
                  {useBankAccount && (
                    <input value={bankAccount} onChange={e => setBankAccount(e.target.value)}
                      placeholder="Số tài khoản ngân hàng"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  )}
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button onClick={handleGenerate} disabled={loading}
                    className="w-full bg-primary hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors">
                    {loading ? "Đang tạo link..." : "Lấy link"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-4">✅ Link đã sẵn sàng!</h2>
                {result.productImage && (
                  <img src={result.productImage} alt={result.productName}
                    className="w-full h-40 object-contain rounded-lg mb-3 bg-gray-50" />
                )}
                <p className="text-sm font-medium text-gray-800 mb-3 line-clamp-2">{result.productName}</p>
                <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Giá sản phẩm</span>
                    <span className="font-medium">{formatVND(result.productPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hoa hồng ({result.commissionRate / 100}%)</span>
                    <span className="font-medium">{formatVND(result.commissionAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-1.5">
                    <span className="text-gray-700 font-semibold">Bạn được hoàn (80%)</span>
                    <span className="text-primary font-bold text-base">{formatVND(result.cashbackAmount)}</span>
                  </div>
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1.5">Link affiliate của bạn:</p>
                  <p className="text-sm font-mono text-primary break-all">{result.affShortUrl}</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(result.affShortUrl); }}
                  className="w-full bg-primary hover:bg-teal-700 text-white font-semibold py-3 rounded-lg mb-2 transition-colors">
                  📋 Copy link
                </button>
                <p className="text-xs text-center text-gray-400">Bấm vào link này để mua → nhận hoàn tiền sau 45–60 ngày</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal: Tra cứu đơn */}
      {showCheck && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <button onClick={closeCheck} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
            <h2 className="text-lg font-bold text-gray-800 mb-5">Kiểm tra đơn hoàn</h2>
            <div className="flex gap-2 mb-4">
              <input value={checkPhone} onChange={e => setCheckPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                onKeyDown={e => e.key === "Enter" && handleCheck()} />
              <button onClick={handleCheck} disabled={checkLoading}
                className="bg-primary hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                {checkLoading ? "..." : "Check"}
              </button>
            </div>
            {checkedPhone && (
              <>
                {userOrders.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-6">Chưa có đơn nào</p>
                ) : (
                  <div className="space-y-3">
                    {userOrders.map(order => (
                      <div key={order.id} className="border border-gray-100 rounded-xl p-3">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{order.productName}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-primary font-bold">{formatVND(order.cashbackAmount)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            order.status === "paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                            {order.status === "paid" ? "✓ Đã hoàn" : "⏳ Chờ xác nhận"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    ))}
                    <div className="bg-gray-50 rounded-xl p-3 mt-2">
                      <p className="text-sm text-gray-600">
                        Tổng chờ hoàn: <span className="text-orange-500 font-bold">
                          {formatVND(userOrders.filter(o => o.status === "pending").reduce((s, o) => s + o.cashbackAmount, 0))}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
