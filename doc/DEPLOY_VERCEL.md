# Deploy to Vercel (main branch)

Connect this GitHub repo in [Vercel](https://vercel.com/new). Vercel auto-detects **Next.js** + **pnpm** (`pnpm-lock.yaml`). Every push to **`main`** triggers a production deployment.

## 1. Import project

1. Vercel → **Add New** → **Project** → import `agentic-sid/punyakoti-taila` (or your fork).
2. **Framework Preset:** Next.js (auto).
3. **Root Directory:** `.` (repo root).
4. **Build Command:** `pnpm build` (set in `vercel.json`).
5. **Install Command:** `pnpm install` (set in `vercel.json`).
6. **Production Branch:** `main`.

Do **not** override the output directory — Next.js default is correct.

## 2. Environment variables

Add these in **Project Settings → Environment Variables** for **Production** (and **Preview** if you want preview deploys to work fully).

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Supabase → **Connect** → copy the **pooler** URI (not `db.*.supabase.co`). Example for this project: `postgresql://postgres.dvjirzgoedmgofrmxwwj:YOUR_PASSWORD@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require` — URL-encode `@` in passwords (`taila@punyakoti` → `taila%40punyakoti`). Reset the DB password under **Settings → Database** if auth fails. |
| `PAYLOAD_SECRET` | Yes | Long random string (same as local). |
| `PAYLOAD_DISABLE_DB_PUSH` | Yes | `true` — schema is synced via `pnpm cms:sync` locally/CI, not at runtime on Vercel. |
| `NEXT_PUBLIC_SERVER_URL` | Yes | Canonical site URL, no trailing slash, e.g. `https://punyakotitaila.com` or `https://your-project.vercel.app` until custom domain is live. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `https://dvjirzgoedmgofrmxwwj.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Dashboard → **Project Settings → API** → `anon` key |
| `IMAGEKIT_PUBLIC_KEY` | Yes | ImageKit dashboard |
| `IMAGEKIT_PRIVATE_KEY` | Yes | ImageKit dashboard |
| `IMAGEKIT_URL_ENDPOINT` | Yes | e.g. `https://ik.imagekit.io/zx7l7bhei` |
| `IMAGEKIT_FOLDER` | Yes | e.g. `/punyakoti-taila` |
| `CRON_SECRET` | Yes | Random secret; protects `/api/seed-*` and `/api/sync-assets` in production |
| `PREVIEW_SECRET` | Recommended | Payload live preview |
| `RAZORPAY_KEY_ID` | For checkout | Razorpay keys |
| `RAZORPAY_KEY_SECRET` | For checkout | Razorpay keys |
| `RESEND_API_KEY` | For email | Resend |
| `RESEND_AUDIENCE_ID` | Optional | Newsletter audience |

Vercel sets automatically (do not add manually):

- `VERCEL_URL` — preview hostname
- `VERCEL_PROJECT_PRODUCTION_URL` — production hostname (without `https://`)

Copy values from your local `.env` where they already work. **Never commit `.env`.**

## 3. One-time production database setup

Before the first deploy (or right after), sync Payload schema to **cloud Postgres**:

```bash
# From your machine, with prod DATABASE_URL in the shell (not committed):
export DATABASE_URL='postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?sslmode=require'
pnpm cms:sync
```

This creates `customers`, storefront globals tables, etc. on Supabase.

Optional — seed demo content on production (destructive on some routes; read `doc/SEED_APIS.md`):

```bash
curl -s -H "x-cron-secret: $CRON_SECRET" "https://<your-domain>/api/seed-all?secret=$CRON_SECRET"
```

## 4. Supabase Auth (production URLs)

In Supabase Dashboard → **Authentication → URL Configuration**:

| Setting | Value |
|---------|--------|
| Site URL | `https://<your-production-domain>` |
| Redirect URLs | `https://<your-production-domain>/auth/callback`, `https://*.vercel.app/auth/callback`, `http://localhost:3000/auth/callback` |

Google OAuth redirect in **Google Cloud Console** stays:

`https://dvjirzgoedmgofrmxwwj.supabase.co/auth/v1/callback`

See `doc/AUTH.md` for full auth setup.

## 5. Custom domain

1. Vercel → **Project → Settings → Domains** → add `punyakotitaila.com` (and `www` if needed).
2. Update `NEXT_PUBLIC_SERVER_URL` to the final HTTPS URL.
3. Update Supabase Site URL + redirect URLs to match.
4. Redeploy (empty commit or **Redeploy** in Vercel).

## 6. Deploy flow

```
git push origin main  →  Vercel build  →  Production URL live
```

Build steps: `pnpm install` → `pnpm build` → `postbuild` runs `next-sitemap`.

Admin panel: `https://<your-domain>/admin` — create the first Payload **admin user** on prod if none exists.

## 7. Verify after deploy

- [ ] Homepage loads with ImageKit images
- [ ] `/shop` PLP loads
- [ ] `/login` → Google sign-in → `/account`
- [ ] `/admin` login (Payload users, separate from storefront auth)
- [ ] Add env vars missing from build logs if build failed

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails TypeScript | Run `pnpm build` locally; fix errors before push |
| `Missing NEXT_PUBLIC_SUPABASE_URL` | Add Supabase env vars in Vercel |
| DB connection / SSL errors | Use pooler URI with `?sslmode=require`; `payload.config.ts` sets `ssl.rejectUnauthorized: false` for Supabase. Prefer **Session pooler** (port 5432) for Payload |
| Admin 500 / missing tables | Run `pnpm cms:sync` against prod `DATABASE_URL` |
| Google login redirect error | Supabase + Google redirect URIs (see §4) |
| Images 404 | Run `/api/sync-assets` or seed media; check ImageKit env vars |
| Seed routes 401 | Pass `CRON_SECRET` via header or `?secret=` |

## Node version

`package.json` engines: Node `^18.20.2 || >=20.9.0`. Vercel defaults to Node 20.x — no extra config needed.
