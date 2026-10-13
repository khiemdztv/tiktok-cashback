import type { MetadataRoute } from "next";
import { merchants } from "@/src/data/catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/stores",
    "/cashback",
    "/shopee-vouchers",
    "/vouchers",
    "/compare",
    "/tools",
    "/about",
    "/contact",
    "/how-it-works",
    "/privacy",
    "/terms",
    ...merchants.map((store) => `/stores/${store.slug}`),
  ];
  return paths.map((path) => ({ url: `https://cashback.id.vn${path}` }));
}
