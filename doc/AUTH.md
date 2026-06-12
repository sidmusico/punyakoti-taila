# Storefront authentication (Supabase + Payload)

Storefront shoppers authenticate through **Supabase Auth**. Profile, orders, and addresses live in Payload’s **`customers`** collection, linked by `supabaseUserId`.

Payload **`users`** is **admin/CMS only** (`/admin` login). Do not use it for the shop login page.

## Architecture

```
Shopper → Supabase Auth (phone OTP | Google | email/password)
              ↓ session cookies (@supabase/ssr)
         Next.js /auth/callback + middleware
              ↓ ensureCustomer()
         Payload `customers` (profile, order links)
              ↓
         Payload `orders.customer` → customers
```

| Login method | Supabase API | Notes |
|--------------|--------------|-------|
| Mobile + OTP | `signInWithOtp` + `verifyOtp` | India: configure Twilio (or compatible) on cloud |
| Google | `signInWithOAuth({ provider: 'google' })` | OAuth client in Google Cloud + Supabase |
| Email + password | `signUp` / `signInWithPassword` | Enabled in Supabase Auth → Email |

---

## Part 1 — Local Supabase (`supabase start`)

### 1.1 Environment variables

Add to `.env` (keys from `supabase status`):

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase status>
SUPABASE_SERVICE_ROLE_KEY=<service_role key — server only, never NEXT_PUBLIC_>
```

Local default service role JWT (supabase demo):

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Ni7s9BfPKCEtY`

### 1.2 `supabase/config.toml` (already updated in repo)

- **SMS OTP** enabled with test numbers (no real SMS locally)
- **Google** block ready — set `client_id` / `secret` env vars when you have OAuth credentials
- **Redirect URLs** include `http://localhost:3000/auth/callback`

Restart auth after config changes:

```bash
supabase stop && supabase start
```

### 1.3 Phone OTP (local testing)

In `supabase/config.toml`:

```toml
[auth.sms.test_otp]
"919876543210" = "123456"
```

In the app login UI, use `9876543210` (we prepend `+91`).

### 1.4 Google (local)

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client (Web).
2. **Authorized redirect URI**: `http://127.0.0.1:54321/auth/v1/callback`
3. Copy Client ID + Secret to `.env`:

```bash
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=...
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=...
```

4. In `supabase/config.toml`, set `[auth.external.google] enabled = true` (and keep `skip_nonce_check = true` for local dev) once creds are in `.env`.

### 1.5 Email (local)

Emails are captured in **Mailpit**: http://127.0.0.1:54324

### 1.6 Payload schema

After pulling auth code:

```bash
pnpm cms:sync
```

Creates the `customers` collection and updates `orders.customer` → `customers`.

---

## Part 2 — Cloud Supabase (production)

Do this in the [Supabase Dashboard](https://supabase.com/dashboard) for project **dvjirzgoedmgofrmxwwj** (or your linked project).

### 2.1 API keys → Vercel / `.env.production`

**Project Settings → API**

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` (server only) |

### 2.2 URL configuration (required for Google SSO)

**Authentication → URL Configuration** in the [Supabase Dashboard](https://supabase.com/dashboard/project/dvjirzgoedmgofrmxwwj/auth/url-configuration).

| Setting | Value |
|---------|--------|
| **Site URL** | `https://punyakoti-taila.vercel.app` |
| **Redirect URLs** | `https://punyakoti-taila.vercel.app/auth/callback` |
| | `https://*.vercel.app/auth/callback` |
| | `http://localhost:3000/auth/callback` |

If **Site URL** is still `http://localhost:3000`, Google sign-in from production will redirect to localhost with `?code=…` — update Site URL and add the redirect URLs above.

**Vercel:** set `NEXT_PUBLIC_SERVER_URL=https://punyakoti-taila.vercel.app` (Production env). Local `.env` keeps `http://localhost:3000`.

**CLI (optional):** with a [Supabase access token](https://supabase.com/dashboard/account/tokens):

```bash
SUPABASE_ACCESS_TOKEN=your_token pnpm auth:configure-urls
```

### 2.3 Email provider

**Authentication → Providers → Email**

- Enable Email provider
- Confirm email: optional for MVP (disable for faster signup; enable for production trust)
- Configure SMTP or use Supabase built-in (limits apply)

### 2.4 Phone / OTP (India)

**Authentication → Providers → Phone**

- Enable Phone signups
- Configure **Twilio** (recommended for India SMS):
  - Twilio Account SID, Auth Token, Message Service SID
  - Set in Supabase Phone settings (or env for self-hosted)

Without Twilio, phone OTP **will not send real SMS** in production.

### 2.5 Google OAuth

**Authentication → Providers → Google**

1. [Google Cloud Console](https://console.cloud.google.com/) → OAuth 2.0 Client (Web application).
2. **Authorized redirect URI** (required — not your Next.js URL):
   - `https://dvjirzgoedmgofrmxwwj.supabase.co/auth/v1/callback`
3. Paste Client ID + Client Secret in Supabase **Authentication → Providers → Google**.
4. Local dev uses the **same** cloud Supabase project (`NEXT_PUBLIC_SUPABASE_URL=https://dvjirzgoedmgofrmxwwj.supabase.co` in `.env`) so Google sign-in hits the provider you configured in the dashboard.

**Common failure:** `OAuth state parameter missing` in Supabase Auth logs usually means the Google redirect URI points at `http://localhost:3000/auth/callback` instead of the Supabase `/auth/v1/callback` URL above.

### 2.6 Auth hooks (optional, later)

**Database → Webhooks** or Auth Hooks can call your app when users sign up — not required; the app syncs customers on login via `ensureCustomer()`.

### 2.7 Database

Payload Drizzle push / migrations run against the same Postgres (`DATABASE_URL`). The `customers` table is created by Payload `cms:sync`, not by Supabase migrations.

---

## Part 3 — App routes

| Route | Purpose |
|-------|---------|
| `/login` | Phone OTP, email/password, Google |
| `/auth/callback` | OAuth code exchange + customer sync |
| `/account` | Profile overview (requires session) |
| `/account/profile` | Edit name, phone, etc. |
| `POST /api/auth/logout` | Sign out |
| `POST /api/auth/sync` | Ensure Payload customer row exists |

---

## Part 4 — What we need from you (cloud)

To finish **production** phone + Google login, please provide or confirm:

1. **Google OAuth** — Client ID + Secret (Web application), with redirect URI `https://<ref>.supabase.co/auth/v1/callback`
2. **Twilio** (or SMS provider Supabase supports) — for Indian mobile OTP in prod
3. **Production site URL** — `https://punyakoti-taila.vercel.app` for Vercel `NEXT_PUBLIC_SERVER_URL` and Supabase Site URL
4. **Prod Supabase MCP** — when connected in Cursor (`project-0-punyakoti-taila-supabase-taila-prod`), the agent can read project URL/keys, run advisors, and inspect auth-related tables. Auth provider settings (Google, Twilio, redirect URLs) are still configured in the Supabase Dashboard (MCP cannot toggle Auth providers today).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Google redirects to wrong URL | Match redirect URIs in Google Console + Supabase URL config |
| OTP never arrives locally | Use `auth.sms.test_otp` numbers; check `supabase/config.toml` |
| OTP never arrives in prod | Configure Twilio under Phone provider |
| `/account` redirects to login | Check `NEXT_PUBLIC_SUPABASE_*` env vars; cookies blocked? |
| Admin vs shopper confused | `/admin` = Payload users; `/login` = Supabase only |
