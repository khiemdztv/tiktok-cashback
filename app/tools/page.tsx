import { LinkConverter } from "@/src/components/tools/LinkConverter";

export const metadata = {
  title: "Công cụ đổi link Shopee",
  description:
    "Đổi đường dẫn sản phẩm Shopee, sao chép và mở link mới. Không cần tài khoản.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return <LinkConverter />;
}
