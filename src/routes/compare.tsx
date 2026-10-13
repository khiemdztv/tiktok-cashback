"use client";
import { useState } from "react";
import { Plus, Trash2, Scale, ArrowRight } from "lucide-react";
import { PageHeader, SiteLayout } from "@/src/components/layout/SiteLayout";
import { SearchBox } from "@/src/components/search/SearchBox";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { formatVnd } from "@/src/lib/format";
type Option = {
  id: number;
  name: string;
  price: string;
  voucher: string;
  rate: string;
  cap: string;
};
const blank = (id: number): Option => ({
  id,
  name: "",
  price: "",
  voucher: "",
  rate: "",
  cap: "",
});
export default function ComparePage() {
  const [options, setOptions] = useState<Option[]>([blank(1), blank(2)]);
  function update(id: number, key: keyof Option, value: string) {
    setOptions((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );
  }
  const computed = options.map((option) => {
    const price = Number(option.price),
      discount = Number(option.voucher),
      rate = Number(option.rate),
      cap = Number(option.cap);
    const valid =
      option.price !== "" &&
      Number.isFinite(price) &&
      price > 0 &&
      price <= 999999999 &&
      Number.isFinite(discount) &&
      discount >= 0 &&
      discount <= price &&
      Number.isFinite(rate) &&
      rate >= 0 &&
      rate <= 100 &&
      Number.isFinite(cap) &&
      cap >= 0;
    const cashback = Math.round(((price - discount) * rate) / 100);
    const returned = option.cap !== "" ? Math.min(cashback, cap) : cashback;
    return {
      ...option,
      valid,
      net: price - discount,
      cashback: returned,
      effective: price - discount - returned,
    };
  });
  const lowest = Math.min(
    ...computed.filter((item) => item.valid).map((item) => item.effective),
  );
  return (
    <SiteLayout>
      <PageHeader
        title="So sánh chi phí, theo dữ liệu của bạn."
        subtitle="Nhập giá và ưu đãi bạn đã kiểm tra tại nơi bán. Công cụ tính để bạn đối chiếu các lựa chọn, không xác nhận hay bảo đảm cashback."
      />
      <div className="container-page py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Các lựa chọn mua hàng</h2>
              <Button
                variant="outline"
                disabled={options.length >= 4}
                onClick={() =>
                  setOptions((current) => [
                    ...current,
                    blank(Math.max(...current.map((item) => item.id)) + 1),
                  ])
                }
              >
                <Plus />
                Thêm lựa chọn
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {computed.map((option, index) => (
                <section key={option.id} className="panel p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      Lựa chọn {index + 1}
                    </h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={options.length <= 2}
                      aria-label={`Xóa lựa chọn ${index + 1}`}
                      onClick={() =>
                        setOptions((current) =>
                          current.filter((item) => item.id !== option.id),
                        )
                      }
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <div className="mt-3 space-y-4">
                    <label className="block text-xs font-medium">
                      Tên cửa hàng / ghi chú
                      <Input
                        value={option.name}
                        onChange={(e) =>
                          update(option.id, "name", e.target.value)
                        }
                        placeholder="Ví dụ: cửa hàng A"
                        className="mt-2 h-11"
                      />
                    </label>
                    {[
                      {
                        key: "price",
                        label: "Giá sản phẩm (đ)",
                        max: 999999999,
                        placeholder: "Nhập giá đã kiểm tra",
                      },
                      {
                        key: "voucher",
                        label: "Giảm giá đã xác nhận (đ)",
                        max: 999999999,
                        placeholder: "0",
                      },
                      {
                        key: "rate",
                        label: "Cashback đã xác nhận (%)",
                        max: 100,
                        placeholder: "0",
                      },
                      {
                        key: "cap",
                        label: "Giới hạn cashback (đ, nếu có)",
                        max: 999999999,
                        placeholder: "Không giới hạn",
                      },
                    ].map((field) => (
                      <label
                        key={field.key}
                        className="block text-xs font-medium"
                      >
                        {field.label}
                        <Input
                          type="number"
                          inputMode="decimal"
                          min={0}
                          max={field.max}
                          step={field.key === "rate" ? "0.1" : "1"}
                          value={option[field.key as keyof Option]}
                          onChange={(e) =>
                            update(
                              option.id,
                              field.key as keyof Option,
                              e.target.value,
                            )
                          }
                          placeholder={field.placeholder}
                          className="mt-2 h-11"
                        />
                      </label>
                    ))}
                  </div>
                  <div
                    className="mt-5 rounded-xl bg-surface p-4"
                    aria-live="polite"
                  >
                    {option.valid ? (
                      <>
                        <dl className="space-y-2 text-xs">
                          <div className="flex justify-between gap-2">
                            <dt>Thanh toán sau giảm giá</dt>
                            <dd>{formatVnd(option.net)}</dd>
                          </div>
                          <div className="flex justify-between gap-2">
                            <dt>Hoàn tiền dự kiến</dt>
                            <dd>{formatVnd(option.cashback)}</dd>
                          </div>
                          <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-3">
                            <dt className="font-semibold">Chi phí hiệu dụng</dt>
                            <dd className="text-lg font-bold text-primary">
                              {formatVnd(option.effective)}
                            </dd>
                          </div>
                        </dl>
                        {computed.filter((item) => item.valid).length >= 2 &&
                          option.effective === lowest && (
                            <p className="mt-3 text-xs font-medium text-primary">
                              Thấp nhất trong các lựa chọn đã nhập
                            </p>
                          )}
                      </>
                    ) : (
                      <p className="text-xs leading-6 text-muted-foreground">
                        {option.price
                          ? "Kiểm tra số liệu: giá phải lớn hơn 0, giảm giá không vượt giá và cashback từ 0–100%."
                          : "Nhập giá sản phẩm để bắt đầu tính."}
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
          <aside className="space-y-5">
            <div className="panel p-6">
              <Scale className="size-6 text-primary" />
              <h2 className="mt-4 font-semibold">Hai số tiền khác nhau</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Số tiền thanh toán là giá sau giảm giá. Chi phí hiệu dụng trừ
                thêm cashback dự kiến, chỉ khi khoản hoàn được duyệt và chi trả.
              </p>
              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                Để cashback bằng 0 nếu chưa có chương trình được xác nhận. Công
                cụ không bao gồm phí vận chuyển hoặc phụ thu.
              </p>
            </div>
            <div className="panel p-6">
              <h2 className="font-semibold">Bạn chưa có giá?</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Tìm sản phẩm trước, kiểm tra giá ở nơi bán rồi quay lại đối
                chiếu.
              </p>
              <SearchBox size="md" showPaste={false} className="mt-4" />
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}
