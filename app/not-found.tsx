import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-background px-6 text-center"><div><p className="text-7xl font-bold text-primary">404</p><h1 className="mt-5 text-2xl font-bold">Chưa tìm thấy trang này</h1><p className="mt-3 text-muted-foreground">Đường dẫn có thể đã thay đổi. Mình về trang chủ nhé.</p><Link className="mt-7 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground" href="/">Về cashback.id.vn</Link></div></main>;
}
