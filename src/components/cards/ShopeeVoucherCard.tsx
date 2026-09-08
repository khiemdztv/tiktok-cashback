"use client";

import { Copy, Gift, MousePointerClick, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { CountdownTimer } from "@/src/components/ui/CountdownTimer";
import { formatVnd } from "@/src/lib/format";

export type ShopeeVoucherView = {
  id: string;
  code: string | null;
  title: string;
  discount: string;
  discountValue: number;
  discountType: string;
  minSpend: number;
  maxDiscount: number;
  campaign: string | null;
  category: string | null;
  endDate: string | null;
  usageLimit: number | null;
  usageCount: number;
  imageUrl: string | null;
};

const typeLabel: Record<string, string> = { fixed: "Giảm tiền", percent: "Giảm %", freeship: "Freeship" };

export function ShopeeVoucherCard({ voucher }: { voucher: ShopeeVoucherView }) {
  const [claiming, setClaiming] = useState(false);
  const [clicks, setClicks] = useState(voucher.usageCount);
  const expired = Boolean(voucher.endDate && new Date(voucher.endDate).getTime() <= Date.now());

  const claim = async () => {
    const target = window.open("about:blank", "_blank");
    if (target) target.opener = null;
    setClaiming(true);
    try {
      const response = await fetch(`/api/shopee-vouchers/${voucher.id}/click`, { method: "POST" });
      const data = (await response.json()) as { affiliateUrl?: string; error?: string };
      if (!response.ok || !data.affiliateUrl) throw new Error(data.error || "Không thể mở mã giảm giá.");
      setClicks((value) => value + 1);
      if (target) target.location.href = data.affiliateUrl;
      else window.location.href = data.affiliateUrl;
    } catch (error) {
      target?.close();
      toast.error(error instanceof Error ? error.message : "Không thể mở mã giảm giá.");
    } finally {
      setClaiming(false);
    }
  };

  const copyCode = async () => {
    if (!voucher.code) return;
    await navigator.clipboard.writeText(voucher.code);
    toast.success("Đã sao chép mã Shopee.");
  };

  return (
    <article className={`relative overflow-hidden rounded-2xl border border-[#ee4d2d]/20 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${expired ? "opacity-60" : ""}`}>
      <div className="absolute inset-y-0 left-0 w-2 bg-[#ee4d2d]" />
      <div className="p-5 pl-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#ee4d2d] text-white"><ShoppingBag className="size-6" /></span>
            <div className="min-w-0">
              <p className="text-xl font-extrabold text-[#ee4d2d]">{voucher.discount}</p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">{typeLabel[voucher.discountType] || "Voucher"}</p>
            </div>
          </div>
          {voucher.campaign && <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#d93f22]">{voucher.campaign}</span>}
        </div>

        <h2 className="mt-4 line-clamp-2 min-h-12 font-semibold leading-6">{voucher.title}</h2>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          {voucher.minSpend > 0 && <p>Đơn tối thiểu {formatVnd(voucher.minSpend)}</p>}
          {voucher.discountType === "percent" && voucher.maxDiscount > 0 && <p>Giảm tối đa {formatVnd(voucher.maxDiscount)}</p>}
          {voucher.category && <p>Danh mục: {voucher.category}</p>}
        </div>

        {voucher.code && (
          <button type="button" onClick={copyCode} className="mt-4 flex w-full items-center justify-between rounded-lg border border-dashed border-[#ee4d2d]/50 bg-orange-50/70 px-3 py-2 text-sm">
            <span><span className="text-muted-foreground">Mã: </span><strong className="tracking-wide text-[#d93f22]">{voucher.code}</strong></span>
            <Copy className="size-4 text-[#ee4d2d]" />
          </button>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <CountdownTimer endDate={voucher.endDate} />
          <span className="inline-flex items-center gap-1.5"><MousePointerClick className="size-4" />{clicks.toLocaleString("vi-VN")} lượt thu thập</span>
        </div>
        <Button onClick={claim} disabled={expired || claiming} className="mt-4 h-11 w-full rounded-xl bg-[#ee4d2d] font-bold hover:bg-[#d93f22]">
          <Gift className="size-4" />{expired ? "Đã hết hạn" : claiming ? "Đang mở Shopee…" : "Thu thập mã giảm giá"}
        </Button>
      </div>
    </article>
  );
}
