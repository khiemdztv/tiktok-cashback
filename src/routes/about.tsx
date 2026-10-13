"use client";
import { ArrowRight, Search, ShieldCheck, Layers } from "lucide-react";
import { SiteLayout, PageHeader } from "@/src/components/layout/SiteLayout";
import { Button } from "@/src/components/ui/button";
import { Link } from "@/src/lib/navigation";
export default function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="Thông tin tốt hơn cho mỗi quyết định mua."
        subtitle="Cashback là một sản phẩm giai đoạn đầu, đang xây dựng trải nghiệm khám phá ưu đãi và mua sắm thông minh cho người Việt."
      />
      <div className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div className="max-w-2xl">
            <p className="eyebrow">Vì sao chúng tôi xây dựng Cashback</p>
            <h2 className="mt-4 text-3xl font-semibold">
              Ưu đãi chỉ có ích khi bạn hiểu cách áp dụng.
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-8 text-muted-foreground">
              <p>
                Giá bán, mã giảm giá và chương trình tiền hoàn thường nằm ở
                nhiều nơi. Việc tìm kiếm thông tin và đọc điều kiện trở thành
                một bước riêng trong mỗi lần mua online.
              </p>
              <p>
                Cashback hướng tới một điểm bắt đầu đơn giản: giúp bạn tìm sản
                phẩm, xem ưu đãi đã kết nối và kiểm tra điều kiện trước khi tiếp
                tục tại cửa hàng.
              </p>
              <p>
                Chúng tôi ưu tiên phạm vi sản phẩm rõ ràng và dữ liệu có nguồn.
                Không đưa mức hoàn chưa xác nhận vào giá sản phẩm, không coi
                liên kết tiếp thị là cam kết chi trả cashback.
              </p>
            </div>
            <Button asChild className="mt-6">
              <Link to="/search">
                Trải nghiệm tìm kiếm
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <aside className="rounded-2xl bg-[#e8eedf] p-7">
            <p className="eyebrow">Trạng thái sản phẩm</p>
            <h2 className="mt-4 text-xl font-semibold">
              Đang phát triển, từng bước có ích.
            </h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-semibold">Hiện có</dt>
                <dd className="mt-2 leading-7 text-muted-foreground">
                  Tìm kiếm sản phẩm, voucher Shopee từ nguồn đã kết nối, thư mục
                  cửa hàng, công cụ so sánh chi phí và đổi link.
                </dd>
              </div>
              <div className="border-t border-primary/15 pt-5">
                <dt className="font-semibold">Chưa cung cấp</dt>
                <dd className="mt-2 leading-7 text-muted-foreground">
                  Tài khoản người dùng, ví tiền, theo dõi và chi trả cashback
                  trực tiếp.
                </dd>
              </div>
            </dl>
          </aside>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Dễ khám phá",
              text: "Một nơi để bắt đầu tìm sản phẩm và thông tin ưu đãi.",
            },
            {
              icon: ShieldCheck,
              title: "Rõ điều kiện",
              text: "Phân biệt giá tìm được, giảm giá và tiền hoàn sau giao dịch.",
            },
            {
              icon: Layers,
              title: "Xây dựng có chọn lọc",
              text: "Tập trung vào chức năng có ích, mở rộng khi nguồn dữ liệu và quy trình sẵn sàng.",
            },
          ].map((item) => (
            <section key={item.title} className="panel p-6">
              <item.icon className="size-5 text-primary" />
              <h2 className="mt-4 font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.text}
              </p>
            </section>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-surface p-7">
          <div>
            <h2 className="text-xl font-semibold">
              Cùng phát triển trải nghiệm mua sắm tốt hơn.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Kết nối với Cashback về nguồn ưu đãi, affiliate hoặc phản hồi sản
              phẩm.
            </p>
          </div>
          <Link to="/contact" className="quiet-link">
            Liên hệ đội ngũ
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
