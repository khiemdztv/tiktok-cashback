import type { Store } from "@/src/data/mock";
import { cn } from "@/src/lib/utils";

const localLogos: Record<string, string> = {
  Shopee: "shopee", Lazada: "lazada", "TikTok Shop": "tiktok", Tiki: "tiki",
  Agoda: "agoda", "Booking.com": "bookingdotcom", Traveloka: "traveloka",
  Nike: "nike", Adidas: "adidas", Samsung: "samsung", "FPT Shop": "fptshop",
  Canva: "canva", Grab: "grab",
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
      {localLogos[store.name]
        ? <img src={`/brands/${localLogos[store.name]}.svg`} alt="" className="h-[72%] w-[78%] object-contain" />
        : <span className="text-xs">{store.short}</span>}
    </span>
  );
}
