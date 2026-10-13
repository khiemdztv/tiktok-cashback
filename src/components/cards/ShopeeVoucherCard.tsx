"use client";

import { Copy, ExternalLink } from "lucide-react";
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
  source?: string;
  updatedAt?: string;
};

const typeLabel: Record<string, string> = {
  fixed: "Giảm tiền",
  percent: "Giảm %",
  freeship: "Freeship",
};

export function ShopeeVoucherCard({ voucher }: { voucher: ShopeeVoucherView }) {
  const [claiming, setClaiming] = useState(false);
  const expired = Boolean(
    voucher.endDate && new Date(voucher.endDate).getTime() <= Date.now(),
  );

  const claim = async () => {
    const target = window.open("about:blank", "_blank");
    if (target) target.opener = null;
    setClaiming(true);
    try {
      const response = await fetch(`/api/shopee-vouchers/${voucher.id}/click`, {
        method: "POST",
      });
      const data = (await response.json()) as {
        affiliateUrl?: string;
        error?: string;
      };
      if (!response.ok || !data.affiliateUrl)
        throw new Error(data.error || "Không thể mở mã giảm giá.");
      if (target) target.location.href = data.affiliateUrl;
      else window.location.href = data.affiliateUrl;
    } catch (error) {
      target?.close();
      toast.error(
        error instanceof Error ? error.message : "Không thể mở mã giảm giá.",
      );
    } finally {
      setClaiming(false);
    }
  };

  const copyCode = async () => {
    if (!voucher.code) return;
    try {
      await navigator.clipboard.writeText(voucher.code);
      toast.success("Đã sao chép mã Shopee.");
    } catch {
      toast.error(
        "Chưa thể sao chép. Bạn có thể chọn và sao chép mã thủ công.",
      );
    }
  };

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift ${expired ? "opacity-60" : ""}`}
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-white">
              <img src="/brands/shopee.svg" alt="Shopee" className="size-7" />
            </span>
            <div className="min-w-0">
              <p className="text-xl font-bold text-primary">
                {voucher.discount}
              </p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                {typeLabel[voucher.discountType] || "Voucher"}
              </p>
            </div>
          </div>
          {voucher.campaign && (
            <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#d93f22]">
              {voucher.campaign}
            </span>
          )}
        </div>

        <h2
          title={voucher.title}
          className="mt-4 line-clamp-2 min-h-12 font-semibold leading-6"
        >
          {voucher.title}
        </h2>
        <div className="mt-2 flex-1 space-y-1 text-xs leading-6 text-muted-foreground">
          {voucher.minSpend > 0 && (
            <p>Đơn tối thiểu {formatVnd(voucher.minSpend)}</p>
          )}
          {voucher.discountType === "percent" && voucher.maxDiscount > 0 && (
            <p>Giảm tối đa {formatVnd(voucher.maxDiscount)}</p>
          )}
          {voucher.category && <p>Danh mục: {voucher.category}</p>}
        </div>
        <details className="mt-3 text-xs leading-6 text-muted-foreground">
          <summary className="cursor-pointer font-medium text-primary">
            Xem thông tin đầy đủ
          </summary>
          <p className="mt-2">{voucher.title}</p>
          {voucher.source && (
            <p className="mt-2">
              Nguồn:{" "}
              {voucher.source === "accesstrade"
                ? "AccessTrade"
                : "Thu thập từ Shopee"}
            </p>
          )}
          {voucher.updatedAt && (
            <p>
              Cập nhật:{" "}
              {new Date(voucher.updatedAt).toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
              })}
            </p>
          )}
        </details>

        {voucher.code && (
          <button
            type="button"
            onClick={copyCode}
            aria-label={`Sao chép mã ${voucher.code}`}
            className="mt-4 flex w-full items-center justify-between gap-3 rounded-lg border border-dashed border-input bg-surface px-3 py-2 text-sm"
          >
            <span className="min-w-0 break-all text-left">
              <span className="text-muted-foreground">Mã: </span>
              <strong className="tracking-wide text-primary">
                {voucher.code}
              </strong>
            </span>
            <Copy className="size-4 shrink-0 text-primary" />
          </button>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <CountdownTimer endDate={voucher.endDate} />
          {voucher.endDate && (
            <time dateTime={voucher.endDate}>
              {new Date(voucher.endDate).toLocaleDateString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
              })}
            </time>
          )}
        </div>
        <Button
          onClick={claim}
          disabled={expired || claiming}
          className="mt-4 h-11 w-full rounded-xl"
        >
          <ExternalLink className="size-4" />
          {expired
            ? "Đã hết hạn"
            : claiming
              ? "Đang mở Shopee…"
              : "Xem điều kiện tại Shopee"}
        </Button>
      </div>
    </article>
  );
}
