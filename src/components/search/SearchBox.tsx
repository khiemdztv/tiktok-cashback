"use client";
import { useNavigate } from "@/src/lib/navigation";
import { ArrowRight, Search, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
export function SearchBox({
  defaultValue = "",
  size = "lg",
  showPaste = true,
  className,
}: {
  defaultValue?: string;
  size?: "lg" | "md";
  showPaste?: boolean;
  className?: string;
}) {
  const [q, setQ] = useState(defaultValue);
  const navigate = useNavigate();
  useEffect(() => setQ(defaultValue), [defaultValue]);
  return (
    <div className={cn("w-full min-w-0", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim().length >= 2)
            navigate({ to: "/search", search: { q: q.trim() } });
        }}
        className="flex min-w-0 items-center gap-2 rounded-2xl border border-input bg-white p-2 pl-4 shadow-soft focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
      >
        <Search className="size-5 shrink-0 text-primary" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          required
          minLength={2}
          maxLength={120}
          aria-label="Tìm sản phẩm hoặc cửa hàng"
          placeholder="Tên sản phẩm, cửa hàng..."
          className={cn(
            "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
            size === "lg" ? "h-11 text-base" : "h-9 text-sm",
          )}
        />
        <Button
          type="submit"
          className={cn(
            "shrink-0 rounded-xl px-3 sm:px-5",
            size === "lg" ? "h-11" : "h-10",
          )}
        >
          <span className="hidden sm:inline">Tìm kiếm</span>
          <ArrowRight className="sm:hidden" />
          <span className="sr-only sm:hidden">Tìm kiếm</span>
        </Button>
      </form>
      {showPaste && (
        <button
          type="button"
          onClick={() => navigate({ to: "/tools" })}
          className="quiet-link mt-3 text-xs"
        >
          <Link2 className="size-3.5" />
          Bạn đã có link Shopee? Đổi link tại đây
        </button>
      )}
    </div>
  );
}
