"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { VoucherCard } from "@/src/components/cards/VoucherCard";
import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
import { Input } from "@/src/components/ui/input";
import { storeBySlug, vouchers } from "@/src/data/mock";
import { cn } from "@/src/lib/utils";



const types = ["Tất cả", "Giảm tiền", "Giảm %", "Freeship"] as const;

export default function VouchersPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("Tất cả");

  const list = useMemo(
    () =>
      vouchers.filter((v) => {
        const store = storeBySlug(v.storeSlug);
        const text = `${store?.name ?? ""} ${v.title} ${v.code}`.toLowerCase();
        return (type === "Tất cả" || v.type === type) && text.includes(q.trim().toLowerCase());
      }),
    [q, type],
  );

  return (
    <SiteLayout>
      <PageHeader title="Voucher & mã giảm giá" subtitle="Tìm mã giảm giá trước khi thanh toán.">
        <div className="relative mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo cửa hàng hoặc mã..."
            className="h-12 rounded-xl bg-card pl-10"
          />
        </div>
      </PageHeader>

      <div className="container-page py-8">
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                type === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border p-14 text-center text-sm text-muted-foreground">
            Không tìm thấy voucher phù hợp. Thử từ khoá khác nhé.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {list.map((v) => (
              <VoucherCard key={v.id} voucher={v} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
