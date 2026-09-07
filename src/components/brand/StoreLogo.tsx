import type { Store } from "@/src/data/mock";
import { cn } from "@/src/lib/utils";

const localLogos: Record<string, string> = {
  "Shopee": "shopee", "TikTok Shop": "tiktok", "Booking.com": "bookingdotcom",
  "Nike": "nike", "Adidas": "adidas", "Samsung": "samsung", "Grab": "grab",
};

export function StoreLogo({
  store,
  size = "md",
  className,
}: {
  store: Pick<Store, "short" | "color" | "name">;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "size-9 text-xs rounded-lg",
    md: "size-12 text-sm rounded-xl",
    lg: "size-16 text-lg rounded-2xl",
  } as const;

  return (
    <span
      aria-label={store.name}
      className={cn(
        "store-logo grid shrink-0 place-items-center border border-black/[0.04] bg-white font-bold tracking-tight",
        sizes[size],
        className,
      )}
      style={{ color: store.color }}
    >
      {localLogos[store.name] ? <img src={`/brands/${localLogos[store.name]}.svg`} alt="" className="h-[65%] w-[65%] object-contain" />
        : store.name === "Lazada" ? <svg viewBox="0 0 40 40" className="size-8" aria-hidden="true"><path d="m20 12 10-6 8 5v18L20 39 2 29V11l8-5 10 6Z" fill="#f46d31" /><path d="m20 20 18-9v18L20 39V20Z" fill="#f03792" /><path d="M2 11v18l18 10V20L2 11Z" fill="#a630ae" /></svg>
        : store.name === "Agoda" ? <span className="flex flex-col items-center"><span className="text-[11px] font-semibold tracking-tighter text-[#31333a]">agoda</span><span className="mt-0.5 flex gap-0.5">{['#e35364','#edac49','#67b972','#945dba','#5a9fdd'].map(color => <i key={color} className="size-1 rounded-full" style={{ background: color }} />)}</span></span>
        : store.name === "Tiki" ? <span className="text-lg font-bold tracking-tighter text-[#169fe3]">tiki</span>
        : store.name === "Canva" ? <span className="text-[11px] italic tracking-tighter text-[#0fa5b5]">Canva</span>
        : store.name === "Traveloka" ? <svg viewBox="0 0 40 40" className="size-8" aria-hidden="true"><path d="m3 28 14-7 4-14 7 12 10-3-6 11-13 5 2-9-18 5Z" fill="#22a9df" /><path d="m17 21 4-14 7 12-11 2Z" fill="#1278b6" /></svg>
        : <span className="text-xs">{store.short}</span>}
    </span>
  );
}
