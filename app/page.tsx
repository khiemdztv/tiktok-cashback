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

const BANKS = [
  "Vietcombank", "Techcombank", "MB Bank", "ACB", "BIDV", "Agribank",
  "TPBank", "VPBank", "Sacombank", "VietinBank", "SHB", "HDBank",
  "OCB", "MSB", "SeABank", "LienVietPostBank", "VIB", "Eximbank",
  "Nam A Bank", "BaoViet Bank", "PVComBank", "Dong A Bank", "ABBank",
  "Bac A Bank", "KienLong Bank", "NCB", "PG Bank", "Viet A Bank"
];

function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN") + " vnđ";
}

export default function Home() {
  const [showCreate, setShowCreate] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showCashbackInfo, setShowCashbackInfo] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [walletType, setWalletType] = useState("momo");
  const [useBankAccount, setUseBankAccount] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankHolder, setBankHolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");
  const [checkPhone, setCheckPhone] = useState("");
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkedPhone, setCheckedPhone] = useState("");
  const [stats, setStats] = useState({ pending: 0, paid: 0 });
  const [globalStats, setGlobalStats] = useState({ totalLinks: 0, totalCashback: 0 });

  useEffect(() => {
    // Không tự động lấy số điện thoại từ localStorage nữa
    fetchGlobalStats();
  }, []);

  async function fetchGlobalStats() {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success) {
        setGlobalStats({ totalLinks: data.totalLinks, totalCashback: data.totalCashback });
      }
    } catch {}
  }

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
    if (!/^[0-9]{10}$/.test(phone.trim())) return setError("Số điện thoại phải đúng 10 chữ số");
    if (useBankAccount && !bankName) return setError("Vui lòng chọn ngân hàng");
    if (useBankAccount && !bankAccount.trim()) return setError("Vui lòng nhập số tài khoản");
    if (useBankAccount && !bankHolder.trim()) return setError("Vui lòng nhập tên chủ tài khoản");
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productUrl: productUrl.trim(),
          phone: phone.trim(),
          walletType,
          bankAccount: useBankAccount ? bankAccount : undefined,
          bankName: useBankAccount ? bankName : undefined,
          bankHolder: useBankAccount ? bankHolder : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Có lỗi xảy ra");
      setResult(data);
      // Không lưu số điện thoại vào localStorage nữa
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
      // Không lưu số điện thoại vào localStorage nữa
      loadStats(checkPhone.trim());
    } catch {}
    finally { setCheckLoading(false); }
  }

  function closeCreate() { setShowCreate(false); setResult(null); setError(""); setProductUrl(""); }
  function closeCheck() { setShowCheck(false); setUserOrders([]); setCheckedPhone(""); }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white flex flex-col relative">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <span className="text-white text-lg">💰</span>
          </div>
          <span className="font-bold text-gray-800 text-base tracking-tight">cashback.id.vn</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hướng dẫn
          </button>
          {showGuide && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 slide-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Hướng dẫn sử dụng</h3>
                <button onClick={() => setShowGuide(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shrink-0">1</div>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">Copy link sản phẩm</p>
                    <p className="text-xs text-gray-500 mt-0.5">Mở TikTok Shop, copy link sản phẩm bạn muốn mua</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shrink-0">2</div>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">Tạo link hoàn tiền</p>
                    <p className="text-xs text-gray-500 mt-0.5">Dán link vào, nhập SĐT → nhận link affiliate</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shrink-0">3</div>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">Mua & nhận hoàn tiền</p>
                    <p className="text-xs text-gray-500 mt-0.5">Mua hàng qua link đó → hoàn tiền sau 15 ngày</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-700">💡 <strong>Mẹo:</strong> Luôn mua qua link được tạo để đảm bảo nhận hoàn tiền nhé!</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Banner */}
      <div className="flex justify-center mt-5 px-4">
        <div className="w-full max-w-2xl rounded-2xl overflow-hidden relative">
          <div className="bg-gradient-to-r from-violet-900 via-indigo-800 to-emerald-700 p-6 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-3 right-8 text-2xl sparkle" style={{ animationDelay: '0s' }}>✨</div>
            <div className="absolute top-8 right-24 text-lg sparkle" style={{ animationDelay: '0.5s' }}>💰</div>
            <div className="absolute bottom-4 left-8 text-xl sparkle" style={{ animationDelay: '1s' }}>🪙</div>
            <div className="absolute bottom-3 right-16 text-sm sparkle" style={{ animationDelay: '1.5s' }}>⭐</div>

            <div className="text-center z-10 relative">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></span>
                <span className="text-xs text-white/90 font-medium">Đang hoạt động • TikTok Shop</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                MUA HÀNG ONLINE
              </h2>
              <p className="text-xl md:text-2xl font-black text-yellow-300 float-anim">
                NHẬN HOÀN TIỀN MỖI ĐƠN
              </p>
              <p className="text-sm text-white/70 mt-3 font-medium">
                TikTok Shop 🛒 • Shopee <span className="inline-flex items-center bg-orange-500/80 text-white text-xs px-2 py-0.5 rounded-full ml-1 font-semibold">Sắp ra mắt</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      {globalStats.totalLinks > 0 && (
        <div className="flex justify-center gap-8 mt-5 mb-2 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100/80 w-full max-w-xl mx-auto shadow-sm px-4">
          <div className="text-center px-4">
            <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500">
              {globalStats.totalLinks.toLocaleString()}
            </p>
            <p className="text-xs md:text-sm text-gray-500 font-semibold mt-1">Link Đã Tạo</p>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="text-center px-4">
            <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
              {formatVND(globalStats.totalCashback)}
            </p>
            <p className="text-xs md:text-sm text-gray-500 font-semibold mt-1">Tiền Được Hoàn</p>
          </div>
        </div>
      )}

      {/* Info bar - "Tiền hoàn đến từ đâu?" */}
      <div className="flex justify-center mt-3 px-4">
        <button
          onClick={() => setShowCashbackInfo(true)}
          className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-full px-5 py-2 border border-gray-200 transition-colors cursor-pointer"
        >
          <span className="text-primary font-bold text-base">%</span>
          <span>Tiền hoàn đến từ đâu?</span>
          <span className="text-primary font-semibold">Tìm hiểu thêm →</span>
        </button>
      </div>



      {/* Buttons */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <button onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-primary to-teal-600 hover:from-teal-700 hover:to-teal-800 text-white font-semibold px-14 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5">
          Tạo Link Hoàn Tiền
        </button>
        <button onClick={() => setShowCheck(true)}
          className="bg-gradient-to-r from-secondary to-green-700 hover:from-green-800 hover:to-green-900 text-white font-semibold px-12 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 transform hover:-translate-y-0.5">
          Tra cứu đơn
        </button>
      </div>

      {/* Floating social icons (right side) */}
      <div className="fixed right-4 bottom-24 flex flex-col gap-3 z-30">
        <a
          href="https://facebook.com/DoGiaKhiemOfficial"
          target="_blank"
          rel="noopener noreferrer"
          className="social-float w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg"
          title="Liên hệ Facebook"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a
          href="https://zalo.me/0388347480"
          target="_blank"
          rel="noopener noreferrer"
          className="social-float w-12 h-12 rounded-full overflow-hidden shadow-lg"
          title="Liên hệ Zalo"
        >
          <img src="https://page.widget.zalo.me/static/images/2.0/Logo.png" alt="Zalo" className="w-full h-full object-cover" />
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 px-6 border-t border-gray-100 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-4xl mx-auto">
          <p className="text-xs text-gray-400">
            © 2026 cashback.id.vn - Powered by <a href="https://facebook.com/DoGiaKhiemOfficial" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">khiemdztv</a>
          </p>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com/DoGiaKhiemOfficial" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
            <a href="https://zalo.me/0388347480" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors">
              <img src="https://page.widget.zalo.me/static/images/2.0/Logo.png" alt="Zalo" className="w-4 h-4 rounded-sm object-cover" />
              Zalo
            </a>
          </div>
        </div>
      </footer>

      {/* Modal: Tạo link */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative slide-in">
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
                      <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="Nhập số điện thoại (10 số)"
                        inputMode="numeric"
                        maxLength={10}
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
                    <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div>
                        <label className="text-sm text-gray-600 block mb-1.5 font-medium">Chọn ngân hàng</label>
                        <select
                          value={bankName}
                          onChange={e => setBankName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                        >
                          <option value="">-- Chọn ngân hàng --</option>
                          {BANKS.map(bank => (
                            <option key={bank} value={bank}>{bank}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 block mb-1.5 font-medium">Số tài khoản</label>
                        <input value={bankAccount} onChange={e => setBankAccount(e.target.value)}
                          placeholder="Nhập số tài khoản ngân hàng"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 block mb-1.5 font-medium">Tên chủ tài khoản</label>
                        <input value={bankHolder} onChange={e => setBankHolder(e.target.value)}
                          placeholder="VD: NGUYEN VAN A"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 uppercase"
                        />
                      </div>
                    </div>
                  )}
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button onClick={handleGenerate} disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-teal-600 hover:from-teal-700 hover:to-teal-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-all shadow-md">
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
                    <span className="font-medium text-gray-700">Theo giá hiển thị trên app</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hoa hồng ước tính</span>
                    <span className="font-medium text-gray-700">5% - 15% (Tuỳ SP)</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-1.5">
                    <span className="text-gray-700 font-semibold">Bạn được hoàn (80%)</span>
                    <span className="text-primary font-bold text-sm">Cập nhật sau khi duyệt</span>
                  </div>
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1.5">Link affiliate của bạn:</p>
                  <p className="text-sm font-mono text-primary break-all">{result.affShortUrl}</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(result.affShortUrl); }}
                  className="w-full bg-gradient-to-r from-primary to-teal-600 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 rounded-lg mb-2 transition-all shadow-md">
                  📋 Copy link
                </button>
                <p className="text-xs text-center text-gray-400">Bấm vào link này để mua → nhận hoàn tiền sau 15 ngày</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal: Tra cứu đơn */}
      {showCheck && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[80vh] overflow-y-auto slide-in">
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
                            order.status === "paid" ? "bg-green-100 text-green-700" : 
                            order.status === "pending" ? "bg-orange-100 text-orange-600" : 
                            order.status === "rejected" ? "bg-red-100 text-red-600" :
                            "bg-blue-100 text-blue-600"
                          }`}>
                            {order.status === "paid" ? "✓ Đã duyệt" : 
                             order.status === "pending" ? "⏳ Chờ duyệt" : 
                             order.status === "rejected" ? "❌ Bị huỷ" :
                             "🔄 Đang xử lý..."}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    ))}
                    <div className="bg-gray-50 rounded-xl p-3 mt-2">
                      <p className="text-sm text-gray-600 mb-1">
                        Đã duyệt (có thể rút): <span className="text-green-600 font-bold">
                          {formatVND(userOrders.filter(o => o.status === "paid").reduce((s, o) => s + o.cashbackAmount, 0))}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Đang chờ duyệt: <span className="text-orange-500 font-bold">
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

      {/* Modal: Tiền hoàn đến từ đâu? */}
      {showCashbackInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative slide-in">
            <button onClick={() => setShowCashbackInfo(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
            <h2 className="text-lg font-bold text-gray-800 mb-2">💡 Tiền hoàn đến từ đâu?</h2>
            <p className="text-sm text-gray-500 mb-5">Minh bạch 100% - Không phí ẩn</p>

            <div className="space-y-4">
              <div className="flex gap-3 items-start bg-blue-50 rounded-xl p-4">
                <span className="text-2xl">🏪</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Người bán trả hoa hồng</p>
                  <p className="text-xs text-gray-600 mt-1">Khi bạn mua sản phẩm qua link affiliate, người bán trả một khoản hoa hồng (lên đến 15%) cho người giới thiệu.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-emerald-50 rounded-xl p-4">
                <span className="text-2xl">🤝</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">cashback.id.vn chia sẻ lại cho bạn</p>
                  <p className="text-xs text-gray-600 mt-1">Chúng tôi nhận hoa hồng từ người bán và <strong>hoàn lại 80%</strong> cho bạn. Chúng tôi chỉ giữ 20% để duy trì hệ thống.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-amber-50 rounded-xl p-4">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Bạn nhận tiền hoàn</p>
                  <p className="text-xs text-gray-600 mt-1">Sau khi đơn hàng hoàn tất (15 ngày), tiền sẽ được chuyển về ví điện tử hoặc tài khoản ngân hàng của bạn.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">📊 Ví dụ thực tế:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Sản phẩm: <strong>500.000đ</strong></p>
                  <p>• Hoa hồng người bán trả (6%): <strong>30.000đ</strong></p>
                  <p>• Bạn nhận hoàn (80%): <strong className="text-primary text-sm">24.000đ</strong></p>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <p className="text-xs text-orange-700">
                  🚀 <strong>Sắp ra mắt:</strong> Hoàn tiền cho đơn hàng <strong>Shopee</strong> — mua sắm nhiều nền tảng, hoàn tiền nhiều hơn!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
