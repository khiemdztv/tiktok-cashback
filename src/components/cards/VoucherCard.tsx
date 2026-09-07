import { Link } from "@/src/lib/navigation";
import { CalendarDays, Copy } from "lucide-react";
import { toast } from "sonner";

import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { Button } from "@/src/components/ui/button";
import { storeBySlug, type Voucher } from "@/src/data/mock";

export function VoucherCard({ voucher }: { voucher: Voucher }) {
  const store = storeBySlug(voucher.storeSlug);
  if (!store) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(voucher.code);
      toast.success("Đã sao chép mã", { description: voucher.code });
    } catch {
      toast.error("Chưa thể sao chép tự động", { description: `Bạn có thể sao chép mã này: ${voucher.code}` });
    }
  };

  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-lift">
      <div className="flex">
        <div className="flex w-28 shrink-0 flex-col items-center justify-center gap-2 border-r border-dashed border-border bg-accent/60 p-4 text-center">
          <StoreLogo store={store} size="sm" />
          <p className="text-xs font-bold leading-tight text-accent-foreground">
            {voucher.discount}
          </p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-5">
          <p className="text-sm font-medium text-muted-foreground">{store.name}</p>
          <h3 className="mt-1 text-base font-semibold leading-snug">{voucher.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{voucher.minSpend}</p>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            HSD: {voucher.expires}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary/50 bg-accent px-3 py-2 text-sm font-semibold tracking-wide text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Copy className="size-3.5" />
              {voucher.code}
            </button>
            <Button asChild variant="ghost" size="sm" className="rounded-lg">
              <Link to="/stores/$store" params={{ store: store.slug }}>
                Xem ưu đãi
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
