# Razorpay (Standard Checkout)

## Environment

```env
RAZORPAY_KEY_ID=rzp_test_...          # server — creates the order
RAZORPAY_KEY_SECRET=...               # server ONLY — never sent to the browser
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...   # client — must be the SAME key id as above
```

Never commit secrets. Set the same three on Vercel for production (swap `rzp_test_` → `rzp_live_`).

## Flow / APIs

`CheckoutClient` → `POST /api/checkout` (recomputes pricing **server-side** from product variants + CMS shipping/promo, creates the Razorpay order **and** a PENDING Payload order linked to the signed-in customer) → opens Razorpay Checkout.js → on success `POST /api/verify-payment` (HMAC verify → `finalizePaidOrder` marks the order **paid + confirmed**, idempotent → sends the confirmation email) → redirects to `/order/success?ref=<razorpay_order_id>`, which fetches the order and renders the real summary. The order then appears under **/account** (customer link) and in **Admin → Orders**.

| Route | Purpose |
|-------|---------|
| `POST /api/create-order` | Create order from an explicit amount (**paise**, min 100) |
| `POST /api/checkout` | Cart checkout → Razorpay order + `key` |
| `POST /api/verify-payment` | HMAC signature verify → Payload `orders` doc |

The signature is verified with `crypto.timingSafeEqual` over `` `${order_id}|${payment_id}` `` using `RAZORPAY_KEY_SECRET` (`src/lib/razorpay/server.ts`).

---

## ⚠️ Fixing "no UPI" and "International cards are not supported"

Both are **Razorpay account settings**, not code. Diagnose your account's enabled methods with the test keys:

```bash
set -a; . ./.env; set +a
curl -s -u "$RAZORPAY_KEY_ID:$RAZORPAY_KEY_SECRET" https://api.razorpay.com/v1/methods | python3 -m json.tool | grep -E '"(upi|card|netbanking|wallet)"'
```

On this account today: **`upi: false`**, `card: true`, netbanking + wallet enabled. That is exactly why UPI is missing and only cards/netbanking/wallet appear.

**Code change (test keys):** checkout opens with **cards disabled** so you are not sent into the “international cards” retry loop. Use **Net banking** (works without UPI) or enable UPI below.

### 1. Enable UPI — **Dashboard only** (cannot be done from this repo or MCP)

[Razorpay Dashboard](https://dashboard.razorpay.com/) → ensure **Test mode** is on (top switch) → **Account & Settings** → **Payment Methods** → enable **UPI** (accept terms if prompted). Some accounts need KYC/bank details before UPI activates; test mode usually allows UPI after toggle.

Confirm:

```bash
set -a && . ./.env && set +a
curl -s -u "$RAZORPAY_KEY_ID:$RAZORPAY_KEY_SECRET" https://api.razorpay.com/v1/methods | python3 -c "import sys,json; print('upi:', json.load(sys.stdin).get('upi'))"
```

You want `upi: True`. UPI appears in Checkout immediately once enabled (checkout already prefers UPI first via `src/lib/razorpay/checkoutDisplayConfig.ts`).

### 2. "International cards are not supported"
Indian Razorpay accounts reject international-BIN cards by default (this is correct — keep it off unless you truly sell abroad). The card you entered had an international BIN. Use a **domestic** test card, UPI, or net banking (below).

---

## ✅ Test payments (test keys)

You can complete a full test payment **right now** — netbanking is already enabled:

| Method | How to test |
|--------|-------------|
| **Net banking** (works now) | Pick **any** bank → Razorpay shows a simulator page → click **Success**. |
| **UPI** (after step 1) | VPA `success@razorpay` = success · `failure@razorpay` = failure. |
| **Card** | Use Razorpay's official domestic test cards — see <https://razorpay.com/docs/payments/payments/test-card-details/>. Common domestic success card: `4111 1111 1111 1111`, any future expiry, any CVV, OTP `1111`. If it's flagged international on your account, use net banking / UPI instead. |

A successful test payment should: verify the signature, create a `PT-…` order in Payload (**Admin → Orders**, with the real amount + method), clear the cart, and redirect to `/order/success`.

---

## Going to production

1. Complete Razorpay KYC / account activation (live mode).
2. Swap all three env vars to `rzp_live_…` keys (local `.env` + Vercel).
3. In the **live** dashboard, enable the payment methods you want (UPI, cards, net banking, wallets).
4. Keep **international cards off** unless you sell outside India.
5. (Recommended) Add a Razorpay **webhook** (`payment.captured` / `order.paid`) as a server-side source of truth so orders are recorded even if the browser closes before `/api/verify-payment` runs. The current flow relies on the client success handler.
6. `RAZORPAY_KEY_SECRET` stays server-only — it is never bundled to the client (only `NEXT_PUBLIC_RAZORPAY_KEY_ID` is).

## Order confirmation emails (Resend)

Transactional order emails go through **Resend** (`src/lib/email/sendOrderEmails.ts`). **Order confirmation** is sent when payment finalizes (`status` → `confirmed`). **Further updates** (shipped, out for delivery, delivered, cancelled, refunded) are sent from the Payload Orders `afterChange` hook when you change status in the admin. Env:

```env
RESEND_API_KEY=re_...
RESEND_FROM=Punyakoti Taila <orders@yourdomain.com>   # defaults to onboarding@resend.dev
```

If `RESEND_API_KEY` is unset the send no-ops (logged) and checkout is never blocked.

⚠️ **Test/unverified account:** with no verified domain, Resend only delivers to the **account owner's** email and rejects other recipients. To email real customers, verify a sending domain in the Resend dashboard and point `RESEND_FROM` at an address on it. (Current account: domain `chargeme.co.in` is unverified.)

## Troubleshooting

- **Modal won't open / "Invalid response from payment server"** — check the three env vars are set and `RAZORPAY_KEY_ID` == `NEXT_PUBLIC_RAZORPAY_KEY_ID`; look at the dev server log for `[checkout]` / `[create-order]`.
- **"Payment verification failed"** — signature mismatch; confirm `RAZORPAY_KEY_SECRET` matches the key id used to create the order.
- **A method still missing** — it isn't enabled on the account (run the `/v1/methods` curl above).

## MCP (Cursor, project-local)

All servers live in **`.cursor/mcp.json`** (gitignored). Template: **`.cursor/mcp.json.example`**.

| Server | Purpose |
|--------|---------|
| `supabase-taila-prod` | Cloud project `dvjirzgoedmgofrmxwwj` |
| `supabase-taila-local` | `http://127.0.0.1:54321/mcp` when `supabase start` is running |
| `rzp-mcp-server` | Razorpay API tools |

Restart MCP / Cursor after edits.

### Razorpay `AUTH_HEADER`

Set `AUTH_HEADER` to `Basic` + base64 of `key_id:key_secret` (no trailing newline — do **not** use plain `echo … | base64` on macOS).

```bash
pnpm mcp:setup   # reads .env, verifies keys against Razorpay API, updates .cursor/mcp.json
```

Or manually:

```bash
printf 'Basic %s' "$(printf '%s' "$RAZORPAY_KEY_ID:$RAZORPAY_KEY_SECRET" | base64 | tr -d '\n')"
```

Paste the one-line output into `env.AUTH_HEADER`, save, and **restart Cursor** so the `rzp-mcp-server` tools load. Remove the duplicate from `~/.cursor/mcp.json` if you only want this project to use Razorpay MCP.
