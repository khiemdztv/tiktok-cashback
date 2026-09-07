import Page from "@/src/routes/stores.$store";
import { notFound } from "next/navigation";
import { storeBySlug } from "@/src/data/mock";

export function generateMetadata({ params }: { params: { store: string } }) {
  const store = storeBySlug(params.store);
  return { title: store ? `${store.name} — Cashback và ưu đãi | Săn Tiền Về` : "Không tìm thấy cửa hàng | Săn Tiền Về" };
}

export default function RoutePage({ params }: { params: { store: string } }) {
  if (!storeBySlug(params.store)) notFound();
  return <Page />;
}
