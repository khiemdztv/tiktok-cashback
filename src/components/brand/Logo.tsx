import { Link } from "@/src/lib/navigation";
import { RotateCcw } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
        <RotateCcw className="size-6 transition-transform duration-500 group-hover:-rotate-45" strokeWidth={1.8} />
        <span className="absolute text-[10px] font-bold">%</span>
      </span>
      {!compact && (
        <span className="text-[17px] font-extrabold tracking-tight">
          Săn Tiền <span className="text-primary">Về</span>
        </span>
      )}
    </Link>
  );
}
