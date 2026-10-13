import Link from "next/link";
import { Button } from "@/src/components/ui/button";
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="max-w-xl text-center">
        <p className="eyebrow">Cashback / 404</p>
        <h1 className="mt-5 text-3xl font-semibold">
          Trang này chưa được tìm thấy.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Đường dẫn có thể đã thay đổi. Bạn có thể tiếp tục khám phá từ trang
          chủ hoặc tìm một cửa hàng.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/stores">Tìm cửa hàng</Link>
          </Button>
        </div>
        <a
          href="mailto:admin@cashback.id.vn"
          className="quiet-link mt-7 text-xs"
        >
          admin@cashback.id.vn
        </a>
      </div>
    </main>
  );
}
