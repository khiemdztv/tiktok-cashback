"use client";
import { Link, useNavigate } from "@/src/lib/navigation";
import { Link2, Menu, Search, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/src/components/brand/Logo";
import { Button } from "@/src/components/ui/button";
const nav = [
  { to: "/stores", label: "Cửa hàng" },
  { to: "/shopee-vouchers", label: "Voucher" },
  { to: "/cashback", label: "Cashback" },
  { to: "/compare", label: "So sánh chi phí" },
  { to: "/how-it-works", label: "Cách hoạt động" },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const navigate = useNavigate();
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (q.trim().length < 2) return;
    navigate({ to: "/search", search: { q: q.trim() } });
    setOpen(false);
    setSearchOpen(false);
  }
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container-page flex h-[76px] items-center gap-5">
        <Logo compact />
        <nav aria-label="Điều hướng chính" className="hidden gap-1 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-accent text-primary" }}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <form
            onSubmit={submit}
            role="search"
            className="hidden w-[235px] items-center gap-2 rounded-full border border-border bg-white px-3 lg:flex"
          >
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Tìm sản phẩm hoặc cửa hàng"
              placeholder="Bạn đang tìm gì?"
              minLength={2}
              maxLength={120}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="grid size-7 shrink-0 place-items-center rounded-full hover:bg-accent"
            >
              <ArrowRight className="size-4" />
            </button>
          </form>
          <Button
            asChild
            variant="outline"
            className="hidden h-10 rounded-full xl:inline-flex"
          >
            <Link to="/tools">
              <Link2 /> Công cụ
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Tìm kiếm"
            aria-expanded={searchOpen}
            aria-controls="header-search"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setOpen(false);
            }}
          >
            <Search />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label="Menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => {
              setOpen(!open);
              setSearchOpen(false);
            }}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {searchOpen && (
        <form
          id="header-search"
          onSubmit={submit}
          role="search"
          className="container-page flex gap-2 border-t border-border py-4"
        >
          <input
            autoFocus
            minLength={2}
            maxLength={120}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Tìm kiếm trên điện thoại"
            placeholder="Tên sản phẩm hoặc cửa hàng"
            className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-white px-3"
          />
          <Button type="submit" className="h-11">
            Tìm
          </Button>
        </form>
      )}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Menu mở rộng"
          className="container-page grid gap-1 border-t border-border py-4 xl:hidden"
        >
          {[
            ...nav,
            { to: "/tools", label: "Công cụ đổi link" },
            { to: "/about", label: "Về Cashback" },
            { to: "/contact", label: "Liên hệ & hợp tác" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
