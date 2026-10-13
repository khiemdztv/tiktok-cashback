import { Link } from "@/src/lib/navigation";
import { Mail, ArrowUpRight } from "lucide-react";
import { Logo } from "@/src/components/brand/Logo";
import { FACEBOOK_URL, ZALO_URL, FacebookIcon, ZaloIcon } from "./SocialLinks";
const columns = [
  {
    title: "Khám phá",
    links: [
      ["Cửa hàng", "/stores"],
      ["Voucher Shopee", "/shopee-vouchers"],
      ["Cashback", "/cashback"],
      ["So sánh chi phí", "/compare"],
    ],
  },
  {
    title: "Cashback",
    links: [
      ["Về sản phẩm", "/about"],
      ["Cách hoạt động", "/how-it-works"],
      ["Liên hệ & hợp tác", "/contact"],
      ["Công cụ đổi link", "/tools"],
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      ["Câu hỏi thường gặp", "/how-it-works#faq"],
      ["Điều khoản sử dụng", "/terms"],
      ["Quyền riêng tư", "/privacy"],
    ],
  },
];
export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-white pb-24 lg:pb-0">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
            Mua sắm thông minh hơn, bắt đầu từ thông tin rõ ràng. Một sản phẩm
            đang phát triển dành cho người mua online tại Việt Nam.
          </p>
          <a href="mailto:admin@cashback.id.vn" className="quiet-link mt-5">
            <Mail className="size-4" />
            admin@cashback.id.vn
            <ArrowUpRight className="size-4" />
          </a>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold">{column.title}</h2>
            <ul className="mt-5 space-y-3">
              {column.links.map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page border-t border-border py-6 text-xs leading-6 text-muted-foreground">
        <p>
          Cashback không bán hàng hoặc trực tiếp chi trả tiền hoàn. Ưu đãi phụ
          thuộc điều kiện của từng chương trình; liên kết mua sắm có thể là liên
          kết tiếp thị.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} cashback.id.vn · Powered by{" "}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              khiemdztv
            </a>
          </p>
          <div className="flex gap-5">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-primary"
            >
              <FacebookIcon className="size-4" />
              Facebook
            </a>
            <a
              href={ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-primary"
            >
              <ZaloIcon className="size-5" />
              Zalo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
