import { Link } from "@/src/lib/navigation";
import { Clock } from "lucide-react";

import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { storeBySlug, type CashbackOffer } from "@/src/data/mock";
import { formatPercent } from "@/src/lib/format";

export function CashbackCard({ offer }: { offer: CashbackOffer }) {
  const store = storeBySlug(offer.storeSlug);
  if (!store) return null;

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift">
      <div className="flex items-start gap-3">
        <StoreLogo store={store} />
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{store.name}</h3>
          <p className="text-sm text-muted-foreground">{offer.category}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-extrabold text-primary">
            Lên đến {formatPercent(offer.rate)}
          </p>
          <p className="text-xs text-muted-foreground">qua {offer.provider}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{offer.note}</p>

      <div className="mt-4 flex items-center gap-2">
        <Badge variant="secondary" className="rounded-full font-normal">
          <Clock className="mr-1 size-3" /> Cập nhật {offer.updated.toLowerCase()}
        </Badge>
        <Badge className="rounded-full bg-accent font-normal text-accent-foreground hover:bg-accent">
          Đang hoạt động
        </Badge>
      </div>

      <Button asChild className="mt-5 w-full rounded-xl">
        <Link to="/stores/$store" params={{ store: store.slug }}>
          Xem cashback
        </Link>
      </Button>
    </article>
  );
}
