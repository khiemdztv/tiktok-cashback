import { Link } from "@/src/lib/navigation";
import { Home, Link2, Percent, Scale, Store, Ticket } from "lucide-react";

const items = [
  { to: "/", label: "Trang chủ", icon: Home, exact: true },
  { to: "/cashback", label: "Cashback", icon: Percent, exact: false },
  { to: "/vouchers", label: "Voucher", icon: Ticket, exact: false },
  { to: "/stores", label: "Cửa hàng", icon: Store, exact: false },
  { to: "/compare", label: "So sánh", icon: Scale, exact: false },
  { to: "/tools", label: "Công cụ", icon: Link2, exact: false },
] as const;

export function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
      <ul className="grid grid-cols-6 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
