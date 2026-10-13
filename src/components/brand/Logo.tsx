import { Link } from "@/src/lib/navigation";
import Image from "next/image";
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className={`relative block shrink-0 overflow-hidden ${compact ? "h-12 w-[158px]" : "h-14 w-[190px]"}`}
      aria-label="Cashback — Trang chủ"
    >
      <Image
        src="/cashback.id.vn.png"
        alt="cashback.id.vn"
        width={1254}
        height={1254}
        priority
        sizes={compact ? "158px" : "190px"}
        className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2"
      />
    </Link>
  );
}
