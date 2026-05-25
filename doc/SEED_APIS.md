# Payload seed HTTP APIs

All routes are **GET** handlers under `/api/…`. They **do not** reset Postgres; they only **create missing documents** or **fill globals that still look empty** (idempotent skips when data already exists).

## Auth

| Environment | Access |
|-------------|--------|
| `NODE_ENV === 'development'` | Open (no secret). |
| Production / staging | Send `CRON_SECRET` as header `x-cron-secret: <secret>` **or** query `?secret=<secret>`. |

Same pattern as the existing seed routes.

## Before you seed (schema)

After changing **collections**, **globals**, or **database** shape, run:

```bash
pnpm cms:sync
```

That updates the DB schema and regenerates types. Seed routes assume tables already exist.

---

## Quick “fresh CMS content” (recommended)

| Endpoint | Purpose |
|----------|---------|
| **`GET /api/seed-all`** | Runs the full pipeline in order: **media → products (includes categories) → pages → storefront + homepage globals**. Best single call for a new empty DB. |

Example (local):

```bash
curl -sS "http://localhost:3000/api/seed-all" | jq .
```

---

## Granular endpoints

| Endpoint | What it seeds | Source module / data |
|----------|----------------|----------------------|
| **`GET /api/seed-categories`** | `categories` | `src/seed/productCatalogSeed.ts` → `CATALOG_CATEGORIES` |
| **`GET /api/seed-media`** | `media` (Unsplash URLs → `public/media`) | `CATALOG_MEDIA` |
| **`GET /api/seed-products`** | `categories` + `products` | Same as above + `CATALOG_PRODUCTS` |
| **`GET /api/seed-site-pages`** | `pages` only (full block `layout` per slug) | `src/seed/sitePagesSeed.ts` → `SITE_PAGES_SEED` |
| **`GET /api/seed-storefront-globals`** | Globals: `shop-listing`, `product-detail`, `cart`, `account`, `order-success`, and `homepage-settings` when empty | `src/seed/storefrontSeedDefaults.ts` and optional `src/seed/generated/*.json` |
| **`GET /api/seed-homepage`** | **`homepage-settings` only** — tab-based homepage bands (all sections). Idempotent unless **`?force=1`** (overwrites existing). | `src/seed/homepageTabDefaults.ts` via `runHomepageTabSeed.ts` |
| **`GET /api/seed-pages`** | **Pages + storefront globals** (same as calling site-pages + storefront-globals in one response) | Combines `runSitePagesSeed` + `runStorefrontGlobalsSeed` |

### Export CMS snapshot (optional)

| Endpoint | Purpose |
|----------|---------|
| **`GET /api/export-storefront-seed`** | Writes `src/seed/generated/*.json` from the current DB (for committing defaults). See `.cursor/skills/payload-storefront-seed-sync/SKILL.md`. |

---

## Suggested order (manual composition)

If you do **not** use `seed-all`, a safe order is:

1. **`/api/seed-categories`** (or rely on **`/api/seed-products`**, which creates categories too).
2. **`/api/seed-media`** — optional before products; products will still upload any missing hero image per product.
3. **`/api/seed-products`** — demo catalog + images.
4. **`/api/seed-site-pages`** — CMS routes / block layouts.
5. **`/api/seed-storefront-globals`** — PLP/PDP/cart copy and homepage global when empty.

To **re-bootstrap only the homepage** (e.g. after a schema change) without touching other globals, use **`GET /api/seed-homepage`** (add **`?force=1`** to overwrite non-empty content).

`GET /api/seed-pages` is equivalent to **4 + 5** in a single JSON payload (two logical groups in `results`).

---

## Response shape

- **Single-resource routes** (`seed-categories`, `seed-media`, `seed-products`, `seed-site-pages`, `seed-storefront-globals`):

  `{ "summary": { "total", "created", "skipped", "errors" }, "results": [ … ] }`

- **`/api/seed-all`**:

  `{ "summary": { "steps", "created", "skipped", "errors" }, "steps": [ { "step", "summary", "results" }, … ] }`

---

## Data sources (repo)

| Data | File |
|------|------|
| Category + media + product catalog | `src/seed/productCatalogSeed.ts` |
| Page layouts (all storefront slugs) | `src/seed/sitePagesSeed.ts` |
| Storefront global **code** defaults | `src/seed/storefrontSeedDefaults.ts` |
| Homepage global **tab defaults** (seed / empty-DB fill) | `src/seed/homepageTabDefaults.ts` |
| Storefront global **exported** overrides | `src/seed/generated/*.json` (optional) |
| Orchestration helpers | `src/seed/runCategoriesSeed.ts`, `runMediaCatalogSeed.ts`, `runProductCatalogSeed.ts`, `runSitePagesSeed.ts`, `runStorefrontGlobalsSeed.ts`, `runHomepageTabSeed.ts`, `runFullSiteSeed.ts` |
| Media upload helper | `src/seed/seedMediaUpload.ts` |
| Shared auth | `src/seed/seedApiAuth.ts` |

---

## Not covered by these seeds

- **`users`** — create the first admin via Payload UI or your auth flow.
- **`posts`**, **`testimonials`**, **`reviews`**, **`orders`** — not part of these GET seeds.
- **`header`** / **`footer`** globals — rely on Payload defaults or edit in admin.
- **`site-settings`** global — not updated by these routes (edit in admin).

---

## Wipe vs seed

| Command / route | Effect |
|-----------------|--------|
| **`pnpm db:local:fresh`** | **Resets** local Supabase Postgres, then you still need **`pnpm cms:sync`** and seed APIs. |
| Any **`/api/seed-*`** above | **Non-destructive** content seed only. |

---

## Image licensing note

Catalog images use **Unsplash** URLs during fetch only; copies are stored under `public/media`. See comments in `productCatalogSeed.ts`.
