"use client";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5">
      <div className="panel max-w-lg p-8 text-center">
        <p className="eyebrow">Có lỗi xảy ra</p>
        <h1 className="mt-4 text-2xl font-semibold">
          Trang chưa thể hiển thị lúc này.
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Bạn có thể tải lại trang hoặc trở về trang chủ để tiếp tục khám phá.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset}>Thử lại</Button>
          <Button asChild variant="outline">
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
