"use client";

import { useMemo, useState } from "react";

import { CashbackCard } from "@/src/components/cards/CashbackCard";
import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
import { cashbackOffers } from "@/src/data/mock";
import { cn } from "@/src/lib/utils";



const sortFilters = ["Cashback cao nhất", "Mới cập nhật"] as const;
const catFilters = ["Tất cả", "Mua sắm", "Du lịch", "Công nghệ", "Thời trang", "Phần mềm"] as const;

export default function CashbackPage() {
  const [sort, setSort] = useState<(typeof sortFilters)[number]>("Cashback cao nhất");
  const [cat, setCat] = useState<(typeof catFilters)[number]>("Tất cả");

  const list = useMemo(() => {
    const items = cashbackOffers.filter((o) => cat === "Tất cả" || o.category === cat);
    return [...items].sort((a, b) =>
      sort === "Cashback cao nhất" ? b.rate - a.rate : a.updatedRank - b.updatedRank,
    );
  }, [sort, cat]);

  return (
    <SiteLayout>
      <PageHeader title="Tìm cashback" subtitle="So sánh các chương trình cashback trước khi mua." />

      <div className="container-page py-8">
        <div className="flex flex-wrap items-center gap-2">
          {catFilters.map((f) => (
            <button
              key={f}
              onClick={() => setCat(f)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                cat === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {sortFilters.map((s) => (
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
          <div className="mt-12 rounded-3xl border border-dashed border-border p-14 text-center text-sm text-muted-foreground">
            Chưa có chương trình cashback trong danh mục này.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((o) => (
              <CashbackCard key={o.id} offer={o} />
            ))}
          </div>
        )}

        <p className="mt-10 rounded-2xl bg-surface p-5 text-sm text-muted-foreground">
          Cashback được cung cấp bởi các đối tác tương ứng. Tỷ lệ, điều kiện và thời gian duyệt có
          thể thay đổi bất kỳ lúc nào.
        </p>
      </div>
    </SiteLayout>
  );
}
