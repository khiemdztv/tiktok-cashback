import { Link, useNavigate } from "@/src/lib/navigation";
import { Link2, Menu, Search, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/src/components/brand/Logo";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const nav = [
  { to: "/cashback", label: "Khám phá" },
  { to: "/cashback", label: "Cashback" },
  { to: "/vouchers", label: "Voucher" },
  { to: "/stores", label: "Cửa hàng" },
  { to: "/compare", label: "So sánh giá" },
] as const;

export function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpenSearch(false);
    setOpenMenu(false);
    navigate({ to: "/search", search: { q: q.trim() } });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.slice(1).map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeProps={{ className: "text-foreground bg-secondary" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={submit} className="hidden items-center md:flex">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm cửa hàng, sản phẩm..."
                aria-label="Tìm cửa hàng, sản phẩm"
                className="h-9 w-44 rounded-full border-border bg-secondary/60 pl-9 text-sm xl:w-56"
              />
            </div>
          </form>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Tìm kiếm"
            onClick={() => setOpenSearch((v) => !v)}
          >
            <Search className="size-5" />
          </Button>

          <Link
            to="/how-it-works"
            className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:block"
          >
            Cách hoạt động
          </Link>

          <Button asChild variant="outline" className="hidden rounded-full lg:inline-flex" size="sm">
            <Link to="/tools"><Link2 className="mr-1.5 size-3.5" /> Công cụ</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Menu"
            aria-expanded={openMenu}
            aria-controls="mobile-menu"
            onClick={() => setOpenMenu((v) => !v)}
          >
            {openMenu ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {openSearch && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <form onSubmit={submit} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              aria-label="Tìm kiếm trên điện thoại"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Bạn đang muốn mua gì?"
              className="h-11 rounded-xl pl-9"
            />
          </form>
        </div>
      )}

      {openMenu && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav id="mobile-menu" className="container-page flex flex-col py-2">
            {nav.slice(1).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpenMenu(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/how-it-works"
              onClick={() => setOpenMenu(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Cách hoạt động
            </Link>
            <Button asChild variant="outline" className="my-3 rounded-full"><Link to="/tools" onClick={() => setOpenMenu(false)}><Link2 className="mr-2 size-4" /> Công cụ đổi link</Link></Button>
          </nav>
        </div>
      )}
    </header>
  );
}
