"use client";
import { useEffect, useState } from "react";
import { Ticket, ArrowRight, RefreshCw } from "lucide-react";
import {
  ShopeeVoucherCard,
  type ShopeeVoucherView,
} from "@/src/components/cards/ShopeeVoucherCard";
import { Button } from "@/src/components/ui/button";
import { Link } from "@/src/lib/navigation";
export function LatestVouchers({ limit = 3 }: { limit?: number }) {
  const [items, setItems] = useState<ShopeeVoucherView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 20000);
    setLoading(true);
    setError(false);
    fetch(`/api/shopee-vouchers?limit=${limit}&sort=newest`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const data = await response.json();
        setItems(data.vouchers);
      })
      .catch(() => {
        if (!controller.signal.aborted || timedOut) setError(true);
      })
      .finally(() => {
        clearTimeout(timer);
        if (!controller.signal.aborted || timedOut) setLoading(false);
      });
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt, limit]);
  if (loading)
    return (
      <div
        aria-busy="true"
        aria-label="Đang tải voucher"
        className={`grid gap-4 ${limit === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
      >
        {Array.from({ length: limit }, (_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl border border-border bg-muted"
          />
        ))}
      </div>
    );
  if (error || !items.length)
    return (
      <div className="panel grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div className="flex gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-primary">
            <Ticket className="size-5" />
          </span>
          <div>
            <h3 className="font-semibold">
              {error
                ? "Chưa tải được danh sách voucher"
                : "Chưa có voucher đang hiển thị"}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {error
                ? "Bạn có thể thử tải lại hoặc xem trang tổng hợp. Chúng tôi chỉ hiển thị ưu đãi từ nguồn đã kết nối."
                : "Quay lại sau để xem mã mới. Bạn vẫn có thể tìm sản phẩm hoặc mở công cụ đổi link Shopee."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {error && (
            <Button
              variant="outline"
              onClick={() => setAttempt((value) => value + 1)}
            >
              <RefreshCw />
              Thử lại
            </Button>
          )}
          <Button asChild variant="secondary">
            <Link to="/shopee-vouchers">
              Xem voucher
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    );
  return (
    <div
      className={`grid gap-4 ${limit === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
    >
      {items.map((item) => (
        <ShopeeVoucherCard key={item.id} voucher={item} />
      ))}
    </div>
  );
}
