"use client";

import { Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { StoreCard } from "@/src/components/cards/StoreCard";
import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
import { Input } from "@/src/components/ui/input";
import { stores } from "@/src/data/mock";
import { cn } from "@/src/lib/utils";



const filters = [
  "Tất cả",
  "Mua sắm",
  "Du lịch",
  "Thời trang",
  "Công nghệ",
  "Phần mềm",
  "Dịch vụ",
] as const;
const sorts = ["Phổ biến", "Cashback cao nhất", "Mới cập nhật"] as const;

export default function StoresPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tất cả");
  const [sort, setSort] = useState<(typeof sorts)[number]>("Phổ biến");

  const list = useMemo(() => {
    let items = stores.filter(
      (s) =>
        (filter === "Tất cả" || s.category === filter) &&
        s.name.toLowerCase().includes(q.trim().toLowerCase()),
    );
    items = [...items].sort((a, b) => {
      if (sort === "Cashback cao nhất") return b.maxRate - a.maxRate;
      if (sort === "Mới cập nhật") return a.updated.localeCompare(b.updated);
      return b.popularity - a.popularity;
    });
    return items;
  }, [q, filter, sort]);

  return (
    <SiteLayout>
      <PageHeader
        title="Khám phá cửa hàng"
        subtitle="Tìm cashback và ưu đãi từ hàng trăm cửa hàng."
      >
        <div className="relative mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm cửa hàng..."
            className="h-12 rounded-xl bg-card pl-10"
          />
        </div>
      </PageHeader>

      <div className="container-page py-8">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sắp xếp:</span>
            {sorts.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  sort === s
                    ? "bg-accent font-semibold text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border p-14 text-center">
            <SearchX className="mx-auto size-9 text-muted-foreground" />
            <p className="mt-3 font-semibold">Không có cửa hàng phù hợp</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Thử đổi bộ lọc hoặc tìm bằng từ khoá khác.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((s) => (
              <StoreCard key={s.slug} store={s} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
