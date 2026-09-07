import { Link } from "@/src/lib/navigation";
import Image from "next/image";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className={`brand-logo group relative block shrink-0 ${compact ? "h-12 w-[160px]" : "h-14 w-[185px] sm:w-[220px]"}`}
      aria-label="cashback.id.vn - Trang chủ"
    >
      <Image
        src="/cashback.id.vn.png"
        alt="cashback.id.vn"
        width={1254}
        height={1254}
        priority
        sizes={compact ? "160px" : "(max-width: 639px) 210px, 250px"}
        className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2 transition-transform duration-300 group-hover:scale-[1.05]"
      />
      {/* Shimmer overlay */}
      <span className="logo-shimmer pointer-events-none absolute inset-0" aria-hidden="true" />
    </Link>
  );
}

