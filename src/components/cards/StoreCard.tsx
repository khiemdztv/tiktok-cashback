import { Link } from "@/src/lib/navigation";
import { ArrowUpRight } from "lucide-react";
import { StoreLogo } from "@/src/components/brand/StoreLogo";
import type { Merchant } from "@/src/data/catalog";
export function StoreCard({ store }: { store: Merchant }) {
  return (
    <Link
      to="/stores/$store"
      params={{ store: store.slug }}
      className="panel group flex h-full flex-col p-5 transition-all hover:border-primary/30 hover:shadow-lift"
    >
      <div className="flex items-center justify-between">
        <StoreLogo store={store} />
        <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" />
      </div>
      <h3 className="mt-5 font-semibold">{store.name}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{store.category}</p>
      <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">
        {store.description}
      </p>
      <span className="mt-5 border-t border-border pt-4 text-sm font-medium text-primary">
        Khám phá cửa hàng
      </span>
    </Link>
  );
}
