import Page from "@/src/routes/stores.$store";
import { notFound } from "next/navigation";
import { storeBySlug } from "@/src/data/mock";

export function generateMetadata({ params }: { params: { store: string } }) {
  const store = storeBySlug(params.store);
  return { title: store ? `${store.name} — Cashback và ưu đãi | cashback.id.vn` : "Không tìm thấy cửa hàng | cashback.id.vn" };
}

export default function RoutePage({ params }: { params: { store: string } }) {
  if (!storeBySlug(params.store)) notFound();
  return <Page />;
}
