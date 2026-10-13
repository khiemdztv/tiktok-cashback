import { ExternalLink, ShoppingBag } from "lucide-react";
import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { Button } from "@/src/components/ui/button";
import { merchantBySlug } from "@/src/data/catalog";
import { formatVnd } from "@/src/lib/format";
import type { SmartSearchResult } from "@/lib/you-api";
export function ProductResultCard({
  result,
  best = false,
}: {
  result: SmartSearchResult;
  best?: boolean;
}) {
  const store = merchantBySlug(result.platform) ?? {
    name: result.platformName,
    short: result.platformName.slice(0, 2),
    color: "#245d3d",
  };
  return (
    <article className="panel group relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <div className="relative aspect-[16/10] bg-surface">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-primary/25">
          <ShoppingBag className="size-10" strokeWidth={1} />
          <StoreLogo store={store} size="sm" />
        </div>
        {result.imageUrl && (
          <img
            src={result.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-contain p-4"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        {best && (
          <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1.5 text-[10px] font-semibold text-primary shadow-soft">
            Giá thấp nhất trong kết quả
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs font-medium">
          <StoreLogo store={store} size="sm" />
          {result.platformName}
        </div>
        <h3 className="mt-4 line-clamp-2 min-h-12 text-sm font-semibold leading-6">
          {result.productName}
        </h3>
        {result.snippet && (
          <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">
            {result.snippet}
          </p>
        )}
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Giá tìm được · cần kiểm tra lại
          </p>
          <p className="mt-1 text-xl font-bold">
            {result.price === null
              ? "Chưa tìm được giá"
              : formatVnd(result.price)}
          </p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Cashback & voucher: chưa xác nhận cho sản phẩm này.
          </p>
        </div>
        <Button asChild className="mt-5 w-full">
          <a
            href={result.originalUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Kiểm tra tại nơi bán
            <ExternalLink />
          </a>
        </Button>
      </div>
    </article>
  );
}
