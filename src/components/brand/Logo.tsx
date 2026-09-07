import { Link } from "@/src/lib/navigation";
import Image from "next/image";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className={`brand-logo group relative block shrink-0 overflow-hidden ${compact ? "h-10 w-[142px]" : "h-11 w-[150px] sm:w-[180px]"}`} aria-label="cashback.id.vn - Trang chủ">
      <Image
        src="/cashback.id.vn.png"
        alt="cashback.id.vn"
        width={1254}
        height={1254}
        priority
        sizes={compact ? "142px" : "(max-width: 639px) 150px, 180px"}
        className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2 transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </Link>
  );
}
