import { ExternalLink } from "lucide-react";
import { formatVnd } from "@/src/lib/format";
import type { SmartSearchResult } from "@/lib/you-api";
export function ComparisonTable({ results }: { results: SmartSearchResult[] }) {
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <caption className="sr-only">
          Giá tìm được từ các nguồn. Ưu đãi chưa được xác nhận.
        </caption>
        <thead className="bg-surface text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-5 py-4 font-medium">
              Nguồn
            </th>
            <th scope="col" className="px-5 py-4 font-medium">
              Giá tìm được
            </th>
            <th scope="col" className="px-5 py-4 font-medium">
              Cashback / voucher
            </th>
            <th scope="col" className="px-5 py-4">
              <span className="sr-only">Mở sản phẩm</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {results.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="px-5 py-4 font-medium">
                {row.platformName}
              </th>
              <td className="px-5 py-4 font-semibold">
                {row.price === null ? "Chưa rõ" : formatVnd(row.price)}
              </td>
              <td className="px-5 py-4 text-xs text-muted-foreground">
                Chưa xác nhận
              </td>
              <td className="px-5 py-4">
                <a
                  href={row.originalUrl}
                  aria-label={`Kiểm tra ${row.productName} tại nơi bán`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex rounded-lg p-2 text-primary hover:bg-accent"
                >
                  <ExternalLink className="size-4" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
