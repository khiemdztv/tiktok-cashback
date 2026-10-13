const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function load(path, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    URL,
    require: (name) => {
      if (dependencies[name]) return dependencies[name];
      throw new Error("Unexpected dependency: " + name);
    },
  });
  return exports;
}
const catalog = load("src/data/catalog.ts");
const { toSmartSearchResult } = load("lib/search-products.ts", {
  "@/src/data/catalog": catalog,
});
test("discovered product prices are not reduced by sample cashback or voucher data", () => {
  for (const merchant of catalog.merchants) {
    const result = toSmartSearchResult(
      {
        title: "Sản phẩm kiểm thử",
        url: merchant.website + "/product/test",
        description: "Giá 1.000.000 đ",
      },
      undefined,
      "test",
      "Sản phẩm kiểm thử",
    );
    assert.ok(result, merchant.name);
    assert.equal(result.price, 1000000);
    assert.equal(result.voucherValue, 0);
    assert.equal(result.cashbackRate, 0);
    assert.equal(result.cashbackValue, null);
    assert.equal(result.effectivePrice, result.price);
    assert.equal(result.incentiveStatus, "unverified");
  }
});
test("unknown price stays unknown; unsafe product links are rejected", () => {
  const result = toSmartSearchResult(
    {
      title: "Sản phẩm kiểm thử",
      url: "https://shopee.vn/product/test",
      description: "Chưa có giá",
    },
    undefined,
    "test",
    "Sản phẩm kiểm thử",
  );
  assert.equal(result.price, null);
  assert.equal(result.effectivePrice, null);
  assert.equal(result.cashbackValue, null);
  assert.equal(
    toSmartSearchResult(
      { url: "javascript:alert(1)" },
      undefined,
      "test",
      "query",
    ),
    null,
  );
});
