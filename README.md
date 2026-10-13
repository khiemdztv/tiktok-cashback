# Cashback · cashback.id.vn

An early-stage Vietnamese shopping discovery product. Find products, explore
connected Shopee vouchers and compare user-entered purchase costs. Official
contact: [admin@cashback.id.vn](mailto:admin@cashback.id.vn).

## Local development

```sh
npm install
npm run dev
```

Configure local environment variables using `.env.example`. Never commit real
environment files or credentials. The app uses Next.js 14, React, TypeScript,
Tailwind, Radix, Lucide and Prisma/PostgreSQL.

## Checks and production

```sh
npm test
npm run typecheck
npm run build
npm start
```

There is no separate configured ESLint command. The Next.js build performs its
available validation and TypeScript checks.

Vercel uses `vercel-build` for Prisma generation, migration deployment and the
Next.js build. `vercel.json` retains the voucher sync schedule.

## Integrations

- `DATABASE_URL`: PostgreSQL for stored vouchers, links and retained legacy
  records.
- `YOU_API_KEY` (or `YDC_API_KEY`): product search and optional AI analysis.
  `SEARCH_RATE_LIMIT_PER_DAY` controls the request limit.
- `SHOPEE_AFFILIATE_ID`: Shopee link conversion through the existing provider.
- `ACCESSTRADE_API_KEY`: connected voucher data. Existing scraper fallback is
  retained; optional browser settings are documented in `.env.example`.
- `CRON_SECRET`: authenticates the scheduled voucher sync.
- Legacy administrative and Telegram settings remain server-side; no public
  consumer registration or payment settings are introduced by this redesign.

An unavailable integration shows a genuine error or empty state. Product
search does not deduct unverified cashback or sample voucher values from prices.
`src/data/catalog.ts` contains public merchant identities, shopping categories
and help content. The retained `mock.ts` and old sample card modules are not
used by public routes or search calculations.

## Product scope

- Home, product search, merchant directory/details and connected voucher views.
- Manual comparison of two to four options with optional confirmed rebates.
- A secondary `/tools` page for Shopee link conversion, copy and open actions.
- About, help/FAQ, contact, privacy, terms and unavailable-page handling.
- The public phone-based order lookup stays retired (HTTP 410). Retained legacy
  administration and data models are not presented as a consumer wallet.

There are no live verified cashback rates, public account balances or payout
promises. Merchant inclusion does not imply an official partnership. Opening
a merchant or affiliate link does not guarantee a shopper cashback payment.

See [the product audit and implementation review](docs/PRODUCT-REVIEW.md) for
design decisions, data limitations and validation scope.
