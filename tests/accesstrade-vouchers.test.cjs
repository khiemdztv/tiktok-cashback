const { test } = require("node:test");
const assert = require("node:assert/strict");
const ts = require("typescript");
const fs = require("node:fs");
const vm = require("node:vm");
const exportsObject = {};
const compiled = ts.transpileModule(fs.readFileSync("lib/accesstrade-vouchers.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
vm.runInNewContext(compiled, { exports: exportsObject, Date, URL });
const { parseAccessTradeOffers } = exportsObject;
const now = new Date("2026-09-09T02:00:00Z");
const offer = {
  id: "example", domain: "shopee.vn", name: "[LiBaGi]-Giảm 60%-tối đa 0 VNĐ cho đơn tối thiểu 80,000 VNĐ",
  link: "https://shopee.vn/shop/123", aff_link: "https://go.isclix.com/deep_link/example",
  start_time: "2026-09-08", end_time: "2026-09-09",
  coupons: [{ coupon_code: "LIBA60", coupon_desc: "Giảm 60%-tối đa 0 VNĐ cho đơn tối thiểu 80,000 VNĐ" }],
};

test("normalizes provider VND values without Shopee API money scaling", () => {
  const voucher = parseAccessTradeOffers({ data: [offer] }, "9-9", now)[0];
  assert.equal(voucher.discountValue, 60);
  assert.equal(voucher.discountType, "percent");
  assert.equal(voucher.minSpend, 80000);
  assert.equal(voucher.maxDiscount, 0);
  assert.equal(voucher.affiliateUrl, offer.aff_link);
  assert.equal(voucher.endDate.toISOString(), "2026-09-09T16:59:59.999Z");
  const fixed = { ...offer, name: "Giảm 6,000 VNĐ cho đơn tối thiểu 249,000 VNĐ", coupons: [{ coupon_code: "RHINVC2" }] };
  const parsed = parseAccessTradeOffers({ data: [fixed] }, "9-9", now)[0];
  assert.equal(parsed.discountValue, 6000);
  assert.equal(parsed.minSpend, 249000);
});

test("rejects expired, future, non-Shopee, and unsafe claim URLs", () => {
  for (const change of [
    { end_time: "2026-09-08" }, { start_time: "2026-09-10" }, { end_time: "invalid" },
    { link: "https://shopee.vn.evil.test/" }, { link: "javascript:alert(1)" },
  ]) assert.equal(parseAccessTradeOffers({ data: [{ ...offer, ...change }] }, "9-9", now).length, 0);
  assert.equal(parseAccessTradeOffers({ data: [offer] }, "9-9", new Date("2026-09-09T17:00:00Z")).length, 0);
});

test("deduplicates repeated offers but preserves distinct coupon codes", () => {
  assert.equal(parseAccessTradeOffers({ data: [offer, offer] }, "9-9", now).length, 1);
  const multi = { ...offer, coupons: [{ coupon_code: "ONE" }, { coupon_code: "TWO" }] };
  const rows = parseAccessTradeOffers({ data: [multi] }, "9-9", now);
  assert.equal(rows.length, 2);
  assert.notEqual(rows[0].shopeeVoucherId, rows[1].shopeeVoucherId);
});
