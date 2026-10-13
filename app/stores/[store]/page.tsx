import Page from "@/src/routes/stores.$store";
import { notFound } from "next/navigation";
import { merchantBySlug as storeBySlug } from "@/src/data/catalog";

export function generateMetadata({ params }: { params: { store: string } }) {
  const store = storeBySlug(params.store);
  return {
    title: store ? `Khám phá ${store.name}` : "Không tìm thấy cửa hàng",
    description: store?.description,
    alternates: { canonical: `/stores/${params.store}` },
  };
}

export default function RoutePage({ params }: { params: { store: string } }) {
  if (!storeBySlug(params.store)) notFound();
  return <Page />;
}
