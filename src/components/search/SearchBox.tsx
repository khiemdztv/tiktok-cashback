import { useNavigate } from "@/src/lib/navigation";
import { Link2, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { popularSearches } from "@/src/data/mock";
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
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  useEffect(() => setQ(defaultValue), [defaultValue]);

  const suggestions = q.trim()
    ? popularSearches.filter((s) => s.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 5)
    : popularSearches.slice(0, 5);

  const go = (value: string) => {
    if (!value.trim()) return;
    navigate({ to: "/search", search: { q: value.trim() } });
  };

  return (
    <div className={cn("relative w-full", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-lift transition-all",
          focused && "border-primary/60 ring-4 ring-primary/10",
          size === "lg" ? "pl-4" : "pl-3",
        )}
      >
        <Search className={cn("shrink-0 text-muted-foreground", size === "lg" ? "size-5" : "size-4")} />
        <input
          aria-label="Tìm sản phẩm hoặc cửa hàng"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Bạn đang muốn mua gì?"
          className={cn(
            "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
            size === "lg" ? "h-12 text-base md:text-lg" : "h-10 text-sm",
          )}
        />
        <Button type="submit" className="rounded-xl" size={size === "lg" ? "lg" : "default"}>
          Tìm kiếm
        </Button>
      </form>

      {focused && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-lift">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(s)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-secondary"
              >
                <Search className="size-4 text-muted-foreground" />
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      {showPaste && (
        <button
          type="button"
          onClick={() => navigate({ to: "/tools" })}
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <Link2 className="size-4" />
          Dán link sản phẩm
        </button>
      )}
    </div>
  );
}
