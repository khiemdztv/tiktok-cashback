"use client";
import { Search, SearchX, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { StoreCard } from "@/src/components/cards/StoreCard";
import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
import { merchants } from "@/src/data/catalog";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
const categories = [
  "Tất cả",
  "Mua sắm",
  "Du lịch",
  "Thời trang",
  "Công nghệ",
  "Phần mềm",
  "Dịch vụ",
];
export default function StoresPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [sort, setSort] = useState("default");
  const list = useMemo(() => {
    const normalized = q
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    const result = merchants.filter(
      (store) =>
        (category === "Tất cả" || store.category === category) &&
        store.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(normalized),
    );
    return sort === "name"
      ? [...result].sort((a, b) => a.name.localeCompare(b.name, "vi"))
      : result;
  }, [q, category, sort]);
  return (
    <SiteLayout>
      <PageHeader
        title="Tìm nơi mua sắm phù hợp."
        subtitle="Khám phá thư mục cửa hàng và nền tảng. Xem thông tin, tìm sản phẩm hoặc mở website chính thức."
      >
        <label className="relative mt-6 block max-w-xl">
          <span className="sr-only">Tìm cửa hàng</span>
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm tên cửa hàng..."
            className="h-12 bg-white pl-11"
          />
        </label>
      </PageHeader>
      <div className="container-page py-8">
        <div
          className="flex flex-wrap items-center gap-2"
          aria-label="Lọc danh mục"
        >
          {categories.map((item) => (
            <button
              key={item}
              className="filter-chip"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 border-b border-border pb-5">
          <p role="status" className="text-sm text-muted-foreground">
            {list.length} cửa hàng
            {category !== "Tất cả" ? ` · ${category}` : ""}
          </p>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Sắp xếp
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground"
            >
              <option value="default">Mặc định</option>
              <option value="name">Tên A–Z</option>
            </select>
          </label>
        </div>
        {list.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((store) => (
              <StoreCard key={store.slug} store={store} />
            ))}
          </div>
        ) : (
          <div className="panel mt-6 p-10 text-center">
            <SearchX className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-4 font-semibold">Chưa có cửa hàng phù hợp</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thử một tên khác hoặc bỏ bộ lọc.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setQ("");
                setCategory("Tất cả");
              }}
              className="mt-5"
            >
              Xóa bộ lọc
              <ArrowRight />
            </Button>
          </div>
        )}
        <p className="mt-8 rounded-xl bg-surface p-4 text-xs leading-6 text-muted-foreground">
          Thư mục cung cấp thông tin khám phá. Thương hiệu được hiển thị không
          phải xác nhận quan hệ đối tác; Cashback chỉ công bố mức hoàn khi có
          nguồn và điều kiện được xác nhận.
        </p>
      </div>
    </SiteLayout>
  );
}
