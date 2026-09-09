const { test } = require("node:test");
const assert = require("node:assert/strict");
const ts = require("typescript");
const fs = require("node:fs");
const vm = require("node:vm");
const exportsObject = {};
const compiled = ts.transpileModule(fs.readFileSync("src/lib/shopee-sale-calendar.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
vm.runInNewContext(compiled, { exports: exportsObject, Date });
const { featuredShopeeCampaign } = exportsObject;
const campaigns = [9, 10, 11, 12].map((month) => ({ name: `${month}.${month}`, slug: `${month}-${month}`, month, day: month }));

test("9.9 starts at midnight Vietnam, not midnight UTC or end of day", () => {
  const before = featuredShopeeCampaign(campaigns, new Date("2026-09-08T16:59:59Z"));
  assert.equal(before.isLive, false);
  assert.equal(before.date.toISOString(), "2026-09-08T17:00:00.000Z");
  for (const time of ["2026-09-08T17:00:00Z", "2026-09-09T01:39:00Z", "2026-09-09T16:59:59Z"]) {
    const sale = featuredShopeeCampaign(campaigns, new Date(time));
    assert.equal(sale.slug, "9-9");
    assert.equal(sale.isLive, true);
  }
});

test("past sale advances to next month, and December rolls into next year", () => {
  const next = featuredShopeeCampaign(campaigns, new Date("2026-09-09T17:00:00Z"));
  assert.equal(next.slug, "10-10");
  assert.equal(next.isLive, false);
  assert.equal(featuredShopeeCampaign(campaigns, new Date("2026-12-12T17:00:00Z")).date.toISOString(), "2027-09-08T17:00:00.000Z");
});
