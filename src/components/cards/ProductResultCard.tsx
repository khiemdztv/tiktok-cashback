import { ExternalLink, Sparkles, Trophy } from "lucide-react";

import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { storeBySlug } from "@/src/data/mock";
import { formatPercent, formatVnd } from "@/src/lib/format";
import type { SmartSearchResult } from "@/lib/you-api";

export function ProductResultCard({ result, best = false }: { result: SmartSearchResult; best?: boolean }) {
  const store = storeBySlug(result.platform) ?? {
    name: result.platformName,
    short: result.platformName.slice(0, 2).toUpperCase(),
    color: "var(--primary)",
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift">
      {best && (
        <Badge className="absolute left-3 top-3 z-10 rounded-full shadow">
          <Trophy className="mr-1 size-3" /> Giá hiệu dụng tốt nhất
        </Badge>
      )}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-accent/80 to-surface">
          <StoreLogo store={store} size="lg" />
        </div>
        {result.imageUrl && (
          <img
            src={result.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <StoreLogo store={store} size="sm" />
          <div>
            <p className="text-sm font-semibold">{result.platformName}</p>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Sparkles className="size-3" /> Kết quả từ You.com
            </p>
          </div>
        </div>
        <h3 className="mt-4 line-clamp-2 min-h-12 font-semibold leading-6" title={result.productName}>{result.productName}</h3>
        {result.snippet && <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{result.snippet}</p>}
        <div className="mt-4 rounded-xl bg-surface p-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs text-muted-foreground">Giá tìm thấy</span>
            <strong className="text-lg text-foreground">{result.price === null ? "Chưa rõ" : formatVnd(result.price)}</strong>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-3">
            <span className="text-xs text-muted-foreground">Sau ưu đãi ước tính</span>
            <strong className="text-xl text-primary">{result.effectivePrice === null ? "—" : formatVnd(result.effectivePrice)}</strong>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-accent-foreground">Cashback {formatPercent(result.cashbackRate)}</span>
          {result.voucherValue > 0 && <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">Mã {result.voucherLabel}: -{formatVnd(result.voucherValue)}</span>}
        </div>
        <Button asChild className="mt-5 w-full rounded-xl">
          <a href={result.originalUrl} target="_blank" rel="noopener noreferrer nofollow">Xem sản phẩm <ExternalLink className="size-4" /></a>
        </Button>
      </div>
    </article>
  );
}
