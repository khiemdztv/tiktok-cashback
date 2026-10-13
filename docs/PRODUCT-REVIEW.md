# Cashback product review

Reviewed 13 October 2026. Product: Cashback, https://cashback.id.vn.
Public contact: admin@cashback.id.vn.

## Audit

The application uses Next.js 14 App Router, React 18, TypeScript, Tailwind,
Radix primitives, Lucide icons, Sonner notifications and Prisma/PostgreSQL.
Route wrappers in `app/` render views from `src/routes/`. The retained
navigation adapter uses Next.js routing. Deployment is configured for Vercel.

Working integrations:

- Product discovery and optional AI analysis via server-side You.com requests,
  with input validation, rate limits and in-memory caches.
- Shopee vouchers stored in PostgreSQL and served by a filtered API.
  AccessTrade is preferred when configured; scraper support and the Vietnam
  midnight cron schedule are retained.
- Shopee link conversion, with URL validation, result display and copy/open
  actions. The converter does not create a consumer order.
- Legacy administration and postback processing remain separate from the
  public shopping experience. The public phone lookup stays retired.

The schema retains Order, Link and ShopeeVoucher models. There is no current
consumer authentication, public wallet or verified cashback payment flow.
No schema migrations were introduced for this redesign.

The main weaknesses were inconsistent visual styles, claims derived from sample
data, incomplete comparison behavior, unclear cashback eligibility, a broad
mobile navigation, and identical inherited canonical URLs. The earlier search
pipeline deducted sample vouchers and cashback from extracted product prices.

## Design system

- Primary: forest green #245D3D. Text: #192B23. Background: #FAF9F6.
- Neutral panels and a restrained sage surface separate content without
  decorative gradients or glass cards.
- Be Vietnam Pro with 400–700 weights, a consistent small spacing scale,
  12/16/24px corners and two subtle shadow levels.
- Shared layout, page headings, buttons, search fields, filter chips, merchant
  cards, connected voucher cards, FAQ and data-state components.
- Existing cashback.id.vn PNG logo and local merchant SVGs are preserved.
- Visible keyboard focus, proper labels, reduced-motion support and native
  selects. Mobile navigation has five actions; link conversion stays in the
  secondary tools area.

Reference principles were reviewed from [Stripe](https://stripe.com),
[Rakuten](https://www.rakuten.com), and [Wise](https://wise.com).
No partner identity, promotional rate, endorsement or traction was taken from
these references.

## Product changes

The homepage now starts with useful discovery, followed by categories, vouchers
from the connected source, merchant discovery, a concise process explanation,
real tools, FAQ and a partnership contact.

The merchant directory presents identities and category information without
implying partnerships or cashback availability. Merchant detail pages show a
transparent unavailable state for unverified cashback; Shopee details can show
vouchers from the connected backend.

The generic voucher entry shares the connected Shopee experience rather than
publishing sample codes. Filters, searching, retry, loading, empty states and
load-more behavior are retained or improved. The API excludes offers that
have not started and orders the newest view by actual update time.

Search has platform filtering, sorting, source timestamps, retry and clear
unknown-price states. Incentives are not deducted unless verified; current API
contracts retain numeric fields, returning zero deductions, null cashback
value, and an additive unverified status. Product cards explain unknown
incentives instead of presenting 0% as an active cashback rate.

The comparison tool accepts two to four user-entered choices, discount values,
cashback rates and optional cashback caps. It separates the payment amount
from the effective cost after a potential later rebate, and validates invalid
numbers. It starts without sample purchase data.

About, help, privacy, terms and a new contact page describe the actual scope of
the emerging product. Official email links work through mailto; there is no
contact form claiming unconfigured delivery.

Metadata uses individual canonical URLs and meaningful titles. A sitemap and
robots file were added. Search is excluded from indexing. Organization
structured data contains only the public product identity, URL, logo and email.

## Verification and limits

Run `npm test`, `npm run typecheck` and `npm run build`.
Tests cover voucher normalization, rejected expired/future/unsafe offers,
Vietnam sale timing, price extraction without fabricated deductions and safe
unknown-price behavior.

Browser QA checks mobile, tablet and desktop routes, clipped controls, merchant
search, calculator arithmetic, search filtering, voucher query filters,
loading/empty/error handling, converter validation/results, contact links,
mobile menu and unknown merchants. Intercepted fixtures are confined to the QA
browser and never saved to application or database data.

During the first build the legacy statistics route could not reach PostgreSQL;
the build still completed. Subsequent live checks returned HTTP 200 for the
voucher API, with nine AccessTrade-sourced records, and fourteen results for a
product-search request with no unverified deductions. UI success/error paths
were also tested using session-only fixtures. Affiliate click delivery and
converter provider availability are separate from UI tests; no payment or
consumer cashback transaction was created.

Cashback data integration with verified rates, eligibility and provider
destinations remains necessary before publishing live cashback offers.
Consumer accounts, transaction tracking, wallet balances and payouts are not
implemented in the public experience.
