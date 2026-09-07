"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Copy, ExternalLink, Link2, LoaderCircle, ShoppingBag } from "lucide-react";
import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { formatVnd } from "@/src/lib/format";

interface Result { productName: string; productImage: string; productPrice: number; shopName: string; affShortUrl: string; }

export function LinkConverter() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => { if (result) resultRef.current?.focus({ preventScroll: true }); }, [result]);
  useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 2200); return () => clearTimeout(timer); }, [copied]);

  async function convert() {
    if (loading) return;
    setError("");
    try {
      const parsed = new URL(url.trim());
      if (!['https:', 'http:'].includes(parsed.protocol) || !(parsed.hostname === 'shopee.vn' || parsed.hostname.endsWith('.shopee.vn') || parsed.hostname === 'shope.ee')) throw new Error();
    } catch { setError("Hãy dán link sản phẩm hợp lệ từ Shopee (shopee.vn hoặc shope.ee)."); return; }
    setLoading(true); setResult(null); setCopied(false); setImageFailed(false);
    controller.current = new AbortController();
    const timeout = setTimeout(() => controller.current?.abort(), 60000);
    try {
      const response = await fetch("/api/generate-link", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productUrl: url.trim() }), signal: controller.current.signal });
      const data = await response.json();
      if (!response.ok || !data.affShortUrl) throw new Error(data.error || "Chưa đổi được link. Vui lòng thử lại.");
      const destination = new URL(data.affShortUrl);
      if (!['http:', 'https:'].includes(destination.protocol)) throw new Error("Link trả về chưa hợp lệ. Vui lòng thử lại.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error && err.name === "AbortError" ? "Yêu cầu mất nhiều thời gian hơn dự kiến. Bạn thử lại sau nhé." : err instanceof TypeError ? "Không thể kết nối. Bạn kiểm tra mạng và thử lại nhé." : err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally { clearTimeout(timeout); setLoading(false); }
  }

  async function copy() {
    if (!result) return;
    try { await navigator.clipboard.writeText(result.affShortUrl); setCopied(true); setError(""); }
    catch { setError("Trình duyệt chưa cho phép sao chép. Bạn có thể chọn đường dẫn bên dưới để sao chép thủ công."); }
  }

  return <SiteLayout>
    <PageHeader title="Một vài công cụ, thêm chút tiện lợi." subtitle="Các tiện ích nhỏ cho trải nghiệm mua sắm của bạn.">
      <nav aria-label="Công cụ" className="mt-6 flex gap-2"><span aria-current="page" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Link2 className="size-4" /> Đổi link Shopee</span></nav>
    </PageHeader>
    <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
        <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-accent text-primary"><Link2 className="size-6" strokeWidth={1.7} /></span>
        <h2 className="text-2xl font-bold">Dán link. Lấy link mới.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Chuyển link sản phẩm Shopee thành link tiếp thị liên kết. Miễn phí, không cần tài khoản.</p>
        <form onSubmit={e => { e.preventDefault(); convert(); }} className="mt-7">
          <label htmlFor="convert-url" className="text-sm font-medium">Link sản phẩm Shopee</label>
          <Input id="convert-url" value={url} onChange={e => { setUrl(e.target.value); setError(""); }} placeholder="https://shopee.vn/..." autoComplete="off" spellCheck={false} disabled={loading} aria-invalid={!!error && !result} aria-describedby={error ? "convert-error" : undefined} className="mt-2 h-12 rounded-xl" />
          <Button type="submit" disabled={loading} className="mt-4 h-12 w-full gap-2 rounded-xl">{loading ? <><LoaderCircle className="size-4 animate-spin" /> Đang đổi link...</> : <>Đổi link sản phẩm <ArrowRight className="size-4" /></>}</Button>
        </form>
        {error && <p role="alert" id="convert-error" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {result && <div ref={resultRef} tabIndex={-1} aria-label="Kết quả đổi link" className="conversion-result mt-6 border-t border-border pt-6">
          <p role="status" className="mb-4 flex items-center gap-2 text-sm font-medium text-primary"><Check className="size-4" /> Link đã sẵn sàng</p>
          <div className="flex items-start gap-4">{result.productImage && !imageFailed ? <img src={result.productImage} alt={result.productName} onError={() => setImageFailed(true)} referrerPolicy="no-referrer" className="size-20 shrink-0 rounded-xl border border-border object-cover" /> : <span className="grid size-20 shrink-0 place-items-center rounded-xl bg-surface text-primary"><ShoppingBag className="size-8" strokeWidth={1.5} /></span>}<div className="min-w-0"><h3 className="text-sm font-semibold leading-relaxed">{result.productName}</h3>{result.shopName && <p className="mt-1 text-xs text-muted-foreground">{result.shopName}</p>}{result.productPrice > 0 && <p className="mt-2 font-bold text-primary">{formatVnd(result.productPrice)}</p>}</div></div>
          <label htmlFor="converted-link" className="mt-5 block text-xs font-medium text-muted-foreground">Link sau chuyển đổi</label><textarea id="converted-link" readOnly value={result.affShortUrl} onFocus={e => e.target.select()} className="mt-2 min-h-24 w-full resize-y rounded-xl border border-border bg-surface p-3 font-mono text-sm text-primary outline-none" />
          <div className="mt-3 grid gap-2 sm:grid-cols-2"><Button onClick={copy} className="gap-2 rounded-xl">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{copied ? "Đã sao chép" : "Sao chép link"}</Button><Button asChild variant="outline" className="gap-2 rounded-xl"><a href={result.affShortUrl} target="_blank" rel="noopener noreferrer">Mở link mới <ExternalLink className="size-4" /></a></Button></div>
        </div>}
      </div>
      <div className="mx-auto mt-7 grid max-w-2xl gap-4 text-sm text-muted-foreground sm:grid-cols-3">{["Sao chép link sản phẩm trên Shopee", "Dán link và nhấn Đổi link sản phẩm", "Sao chép hoặc mở link vừa tạo"].map((step, i) => <div key={step} className="flex gap-3 rounded-2xl bg-surface p-4"><span className="font-semibold text-primary">0{i + 1}</span><p className="text-xs leading-relaxed">{step}</p></div>)}</div>
    </div>
  </SiteLayout>;
}
