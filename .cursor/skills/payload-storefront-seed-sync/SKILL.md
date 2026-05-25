---
name: payload-storefront-seed-sync
description: >-
  After editing Payload CMS storefront globals or homepage settings, export JSON
  snapshots into the repo for prod seeding. Use when changing Shop listing,
  Product detail, Cart, Account, Order confirmation, or Homepage, or when
  preparing a Supabase/Payload deploy.
---

# Payload storefront ↔ seed sync

## When to use

- You changed any of these **Globals**: `shop-listing`, `product-detail`, `cart`, `account`, `order-success`, or **`homepage-settings`** (tab-based: one admin tab per homepage band).
- You want **version-controlled** CMS defaults that match local, so production can bootstrap the same content.
- You are wiring **prod** after local development.

Payload does not auto-write files on save. The workflow is: **edit in admin → export API → commit JSON**.

## Homepage (tabs + code defaults)

- **Admin:** Globals → **Homepage** — each tab maps to a storefront section; use **Show this section** to hide a band.
- **Code defaults** (used when the DB row is still “empty” or when you call the homepage seed API): `src/seed/homepageTabDefaults.ts` and `src/seed/runHomepageTabSeed.ts`.
- **Dedicated seed HTTP API:** `GET /api/seed-homepage` — same auth as other seed routes. Use **`?force=1`** to overwrite existing homepage content with the tab defaults (e.g. after a schema migration).
- **Storefront bundle seed** (`GET /api/seed-storefront-globals`, `GET /api/seed-pages`, `GET /api/seed-all`): still fills `homepage-settings` when `isHomepageGlobalUnset` is true; prefers `src/seed/generated/homepage-settings.json` when that file exists and the global is unset, otherwise applies tab defaults via `runHomepageTabSeed`.

## Export (local snapshot → repo files)

1. Run the dev server (`pnpm dev`) with a database that has the content you want to freeze.
2. Call:

   `GET http://localhost:3000/api/export-storefront-seed`

   In non-development environments, pass the same secret as seed routes:

   - Header `x-cron-secret: <CRON_SECRET>`, or
   - Query `?secret=<CRON_SECRET>`

3. Confirm files were written under `src/seed/generated/`:

   - `shop-listing.json`
   - `product-detail.json`
   - `cart.json`
   - `account.json`
   - `order-success.json`
   - `homepage-settings.json`

4. **Commit** those JSON files with your code change (or immediately after a CMS tuning session).

## Initial seed / prod bootstrap

`GET /api/seed-pages` creates **Pages** entries when missing and seeds each storefront global when it still looks empty (heuristic per global — see `src/app/api/seed-pages/route.ts`). It prefers the matching file from `src/seed/generated/<slug>.json` when present; otherwise it uses defaults from `src/seed/storefrontSeedDefaults.ts` (other globals) and **`homepageTabDefaults`** for an empty **homepage** when no JSON export exists.

See **`doc/SEED_APIS.md`** for the full list, including **`GET /api/seed-homepage`**.

## Agent checklist after CMS edits

1. Remind the user to run **export** and commit `src/seed/generated/*.json` if they want the repo to mirror their CMS.
2. If they add new global fields, run `pnpm run generate:types` and fix any TypeScript consumers.
3. Do not put secrets in JSON exports.

## Product catalog seed (categories + demo products)

`GET /api/seed-products` creates **categories**, **media** (fetched from Unsplash URLs in `src/seed/productCatalogSeed.ts` and stored under `public/media`), and **five published products** with variants, when missing. Same auth as other seed routes: allowed in development, or pass `x-cron-secret` / `?secret=` matching `CRON_SECRET`.

Granular routes and a one-shot orchestrator are documented in **`doc/SEED_APIS.md`** (`GET /api/seed-categories`, `GET /api/seed-media`, `GET /api/seed-site-pages`, `GET /api/seed-storefront-globals`, `GET /api/seed-homepage`, `GET /api/seed-all`, and the combined `GET /api/seed-pages`).

After schema changes, run `pnpm generate:types`. From the repo root, `pnpm seed:products` prints example `curl` commands.

## Limitations

- **Media / uploads**: exported JSON references media IDs from the local DB. Production needs the **same uploads seeded** or you must re-point fields in prod admin.
- **Products / orders**: storefront JSON export does not include products; use `GET /api/seed-products` for the bundled demo catalog or your own import pipeline.
