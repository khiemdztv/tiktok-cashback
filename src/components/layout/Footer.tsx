import { Link } from "@/src/lib/navigation";
import { ArrowUpRight, Mail } from "lucide-react";

import { Logo } from "@/src/components/brand/Logo";
import { FACEBOOK_URL, ZALO_URL, FacebookIcon, ZaloIcon } from "./SocialLinks";

const columns = [
  {
    title: "cashback.id.vn",
    links: [
      { label: "Về chúng tôi", to: "/about" as const },
      { label: "Cách hoạt động", to: "/how-it-works" as const },
    ],
  },
  {
    title: "Khám phá",
    links: [
      { label: "Cashback", to: "/cashback" as const },
      { label: "Mã giảm giá Shopee", to: "/shopee-vouchers" as const },
      { label: "Voucher", to: "/vouchers" as const },
      { label: "Cửa hàng", to: "/stores" as const },
      { label: "So sánh giá", to: "/compare" as const },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "FAQ", to: "/how-it-works" as const },
      { label: "Điều khoản", to: "/terms" as const },
      { label: "Chính sách bảo mật", to: "/privacy" as const },
      { label: "Công cụ đổi link", to: "/tools" as const },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-[#f6f8f7] pb-20 lg:pb-0">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5 lg:py-16">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Nền tảng khám phá cashback, voucher và cách mua sắm online có lợi hơn cho người Việt.
          </p>
          <a href="mailto:admin@cashback.id.vn" className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground shadow-soft transition-colors hover:border-primary/30 hover:text-primary">
            <Mail className="size-4" /> admin@cashback.id.vn <ArrowUpRight className="size-3.5 text-muted-foreground" />
          </a>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-page pb-6 text-xs leading-relaxed text-muted-foreground">Cashback, voucher và giá hiển thị mang tính tham khảo; hãy kiểm tra ưu đãi và điều kiện tại đối tác trước khi mua.</div>
      <div className="border-t border-border bg-white/70">
        <div className="container-page flex flex-col gap-4 py-4 text-sm text-[#98a0af] md:flex-row md:items-center md:justify-between">
          <p>© 2026 cashback.id.vn - Powered by <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-[#00a9ae] hover:underline">khiemdztv</a></p>
          <div className="flex items-center gap-6"><a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary"><FacebookIcon /> Facebook</a><a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary"><ZaloIcon className="size-6" /> Zalo</a></div>
        </div>
      </div>
    </footer>
  );
}
