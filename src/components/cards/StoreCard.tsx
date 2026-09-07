import { Link } from "@/src/lib/navigation";
import { ArrowUpRight } from "lucide-react";

import { StoreLogo } from "@/src/components/brand/StoreLogo";
import { Badge } from "@/src/components/ui/badge";
import type { Store } from "@/src/data/mock";
import { formatPercent } from "@/src/lib/format";

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      to="/stores/$store"
      params={{ store: store.slug }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
    >
      <div className="flex items-start justify-between">
        <StoreLogo store={store} />
        <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{store.name}</h3>
      <p className="text-sm text-muted-foreground">{store.category}</p>
      <div className="mt-4 flex items-center justify-between">
        <Badge className="rounded-full bg-accent font-medium text-accent-foreground hover:bg-accent">
          Cashback lên đến {formatPercent(store.maxRate)}
        </Badge>
        <span className="text-sm font-medium text-primary">Xem chi tiết</span>
      </div>
    </Link>
  );
}
