# Supabase dashboard email templates

Paste into **Supabase Dashboard → Authentication → Email templates** (Source view).

Repo copies: `supabase/templates/confirmation.html`, `magic_link.html`, and `recovery.html`.

## Confirm sign up

**Subject:** `Confirm your email — Punyakoti Taila`

**Body:** full file `supabase/templates/confirmation.html` (uses `{{ .ConfirmationURL }}`).

Logo (ImageKit, same as storefront header):  
`https://ik.imagekit.io/zx7l7bhei/punyakoti-taila/brand/punyakoti-logo-no-bg.png?tr=w-280,f-auto,q-90`

## Magic link / OTP

**Subject:** `Your sign-in code — Punyakoti Taila`

**Body:** `supabase/templates/magic_link.html` (`{{ .Token }}`, `{{ .ConfirmationURL }}`).

## Reset password

**Subject:** `Reset your password — Punyakoti Taila`

**Body:** `supabase/templates/recovery.html`.

**Important:** Do **not** use `{{ .ConfirmationURL }}` for reset. That path uses PKCE and often fails with `login?error=auth_callback` (especially when opening the email on another device). The repo template links directly to your app with `token_hash`:

`{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery`

`RedirectTo` is the `redirectTo` from the app (`/auth/callback?next=/login/reset-password`).

### Supabase redirect allow-list (cloud)

In **Authentication → URL configuration → Redirect URLs**, add **exact** entries (in addition to `/auth/callback`):

- `https://punyakoti-taila.vercel.app/auth/callback?next=%2Flogin%2Freset-password`
- For local reset testing: `http://localhost:3000/auth/callback?next=%2Flogin%2Freset-password`

If the reset callback URL is not allow-listed, Supabase may send users to Site URL with `?code=` only, which breaks password reset.

## Theme colors

| Role | Hex |
|------|-----|
| Page bg | `#efe9db` |
| Card | `#fdfaf2` |
| Border | `#e7e0cf` |
| CTA / headline | `#244023` |
| Body | `#6b665a` |
| Muted | `#8a8578` |
| Accent | `#c4a035` |
