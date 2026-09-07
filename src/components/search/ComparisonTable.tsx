import { ExternalLink, Trophy } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { formatPercent, formatVnd } from "@/src/lib/format";
import type { SmartSearchResult } from "@/lib/you-api";

export function ComparisonTable({ results }: { results: SmartSearchResult[] }) {
  const rows = [...results].sort((a, b) => {
    if (a.effectivePrice === null) return 1;
    if (b.effectivePrice === null) return -1;
    return a.effectivePrice - b.effectivePrice;
  });
  const bestId = rows.find((row) => row.effectivePrice !== null)?.id;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-semibold">Nền tảng</th><th className="px-5 py-4 font-semibold">Giá</th><th className="px-5 py-4 font-semibold">Voucher ước tính</th><th className="px-5 py-4 font-semibold">Cashback</th><th className="px-5 py-4 font-semibold">Giá hiệu dụng</th><th className="px-5 py-4"><span className="sr-only">Mở liên kết</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => {
              const isBest = row.id === bestId;
              return (
                <tr key={row.id} className={isBest ? "bg-accent/45" : "hover:bg-surface/60"}>
                  <td className="px-5 py-4 font-semibold"><span className="flex items-center gap-2">{row.platformName}{isBest && <Badge className="rounded-full"><Trophy className="mr-1 size-3" /> Tốt nhất</Badge>}</span></td>
                  <td className="px-5 py-4">{row.price === null ? "Chưa rõ" : formatVnd(row.price)}</td>
                  <td className="px-5 py-4">{row.voucherValue > 0 ? <span title={`Mã ${row.voucherLabel}`}>-{formatVnd(row.voucherValue)}</span> : "—"}</td>
                  <td className="px-5 py-4">{formatPercent(row.cashbackRate)}{row.cashbackValue !== null && <span className="block text-xs text-muted-foreground">-{formatVnd(row.cashbackValue)}</span>}</td>
                  <td className="px-5 py-4 font-bold text-primary">{row.effectivePrice === null ? "—" : formatVnd(row.effectivePrice)}</td>
                  <td className="px-5 py-4 text-right"><Button asChild variant="ghost" size="icon"><a href={row.originalUrl} target="_blank" rel="noopener noreferrer nofollow" aria-label={`Mở ${row.productName}`}><ExternalLink className="size-4" /></a></Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-border md:hidden">
        {rows.map((row) => {
          const isBest = row.id === bestId;
          return (
            <a key={row.id} href={row.originalUrl} target="_blank" rel="noopener noreferrer nofollow" className={`block p-4 ${isBest ? "bg-accent/45" : ""}`}>
              <div className="flex items-center justify-between gap-3"><strong>{row.platformName}</strong>{isBest && <Badge className="rounded-full"><Trophy className="mr-1 size-3" /> Tốt nhất</Badge>}</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>Giá</span><span className="text-right text-foreground">{row.price === null ? "Chưa rõ" : formatVnd(row.price)}</span>
                <span>Voucher</span><span className="text-right text-foreground">{row.voucherValue ? `-${formatVnd(row.voucherValue)}` : "—"}</span>
                <span>Cashback</span><span className="text-right text-foreground">{formatPercent(row.cashbackRate)}</span>
                <span>Giá hiệu dụng</span><strong className="text-right text-primary">{row.effectivePrice === null ? "—" : formatVnd(row.effectivePrice)}</strong>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
