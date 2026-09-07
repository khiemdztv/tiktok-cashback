import { ShoppingBag, Plane, Hotel, Shirt, Laptop, GraduationCap, PanelsTopLeft, Utensils, type LucideIcon } from "lucide-react";

const icons: Record<string, { icon: LucideIcon; color: string }> = {
  "mua-sam": { icon: ShoppingBag, color: "#2c8a63" },
  "du-lich": { icon: Plane, color: "#487ea9" },
  "khach-san": { icon: Hotel, color: "#b48b53" },
  "thoi-trang": { icon: Shirt, color: "#b2778c" },
  "cong-nghe": { icon: Laptop, color: "#637fb1" },
  "hoc-tap": { icon: GraduationCap, color: "#8a74b1" },
  "phan-mem": { icon: PanelsTopLeft, color: "#589c9a" },
  "an-uong": { icon: Utensils, color: "#b6845f" },
};

export function CategoryIcon({ slug }: { slug: string }) {
  const { icon: Icon, color } = icons[slug] || icons["mua-sam"];
  return <span className="category-icon grid size-12 place-items-center rounded-2xl" style={{ color, backgroundColor: `${color}10` }}><Icon className="size-6" strokeWidth={1.6} aria-hidden="true" /></span>;
}
