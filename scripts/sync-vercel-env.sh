#!/usr/bin/env bash
# Sync production env vars to Vercel project punyakoti-taila from local .env.
# Prereqs: vercel login, .env at repo root, .vercel/project.json (or vercel link).
#
# Usage:
#   pnpm vercel:env:sync          # add missing keys only
#   pnpm vercel:env:sync --dry-run
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Install Vercel CLI: pnpm dlx vercel login"
  exit 1
fi

if [[ ! -f .env ]]; then
  echo "Missing .env — copy from .env.example"
  exit 1
fi

# shellcheck disable=SC1091
set -a
source .env
set +a

PROD_URL="${VERCEL_PRODUCTION_URL:-https://punyakoti-taila.vercel.app}"
if [[ -z "${DATABASE_URL_PROD:-}" ]]; then
  echo "DATABASE_URL_PROD is not set in .env (required for Vercel DATABASE_URL)."
  exit 1
fi

# Keys to set on Vercel (production). Values from .env unless noted.
declare -A VALUES
VALUES[DATABASE_URL]="$DATABASE_URL_PROD"
VALUES[PAYLOAD_SECRET]="${PAYLOAD_SECRET:-}"
VALUES[PAYLOAD_DISABLE_DB_PUSH]="true"
VALUES[NEXT_PUBLIC_SERVER_URL]="$PROD_URL"
VALUES[CRON_SECRET]="${CRON_SECRET:-}"
VALUES[PREVIEW_SECRET]="${PREVIEW_SECRET:-}"
VALUES[RAZORPAY_KEY_ID]="${RAZORPAY_KEY_ID:-}"
VALUES[RAZORPAY_KEY_SECRET]="${RAZORPAY_KEY_SECRET:-}"
VALUES[NEXT_PUBLIC_RAZORPAY_KEY_ID]="${NEXT_PUBLIC_RAZORPAY_KEY_ID:-$RAZORPAY_KEY_ID}"
VALUES[RESEND_API_KEY]="${RESEND_API_KEY:-}"
VALUES[RESEND_FROM]="${RESEND_FROM:-}"
VALUES[IMAGEKIT_PUBLIC_KEY]="${IMAGEKIT_PUBLIC_KEY:-}"
VALUES[IMAGEKIT_PRIVATE_KEY]="${IMAGEKIT_PRIVATE_KEY:-}"
VALUES[IMAGEKIT_URL_ENDPOINT]="${IMAGEKIT_URL_ENDPOINT:-}"
VALUES[IMAGEKIT_FOLDER]="${IMAGEKIT_FOLDER:-/punyakoti-taila}"
VALUES[NEXT_PUBLIC_SUPABASE_URL]="${NEXT_PUBLIC_SUPABASE_URL:-}"
VALUES[NEXT_PUBLIC_SUPABASE_ANON_KEY]="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"

# Optional — set in .env when you use them
OPTIONAL_KEYS=(
  SUPABASE_SERVICE_ROLE_KEY
  SUPABASE_AUTH_HOOK_SECRET
  RAZORPAY_CHECKOUT_CONFIG_ID
  RESEND_AUDIENCE_ID
  NEXT_PUBLIC_RAZORPAY_HIDE_CARDS
)

for key in "${OPTIONAL_KEYS[@]}"; do
  val="${!key:-}"
  if [[ -n "$val" ]]; then
    VALUES[$key]="$val"
  fi
done

PLACEHOLDER_RE='YOUR_|REPLACE_WITH|generate_a_long|YOUR_SECRET'
missing_required=()
for key in DATABASE_URL PAYLOAD_SECRET CRON_SECRET PREVIEW_SECRET NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY; do
  val="${VALUES[$key]:-}"
  if [[ -z "$val" ]] || echo "$val" | grep -qiE "$PLACEHOLDER_RE"; then
    missing_required+=("$key")
  fi
done

if ((${#missing_required[@]} > 0)); then
  echo "Fix these in .env before syncing (empty or placeholder):"
  printf '  - %s\n' "${missing_required[@]}"
  exit 1
fi

if [[ ! -d .vercel ]] || [[ ! -f .vercel/project.json ]]; then
  echo "Linking project (team + punyakoti-taila)…"
  mkdir -p .vercel
  printf '%s\n' '{"orgId":"team_1Vj8FYJpcEGsM9ePBXOYlTM1","projectId":"prj_1FUc6w44AxLMEsBuJhZBt8a9v31S"}' > .vercel/project.json
fi

echo "Fetching existing Production env keys from Vercel…"
EXISTING="$(vercel env ls production 2>/dev/null | awk 'NR>1 {print $1}' | sort -u || true)"

add_key() {
  local key="$1"
  local value="$2"
  if echo "$EXISTING" | grep -qx "$key"; then
    echo "  skip (exists): $key"
    return
  fi
  if [[ -z "$value" ]]; then
    echo "  skip (empty): $key"
    return
  fi
  if $DRY_RUN; then
    echo "  would add: $key"
    return
  fi
  printf '%s' "$value" | vercel env add "$key" production --force >/dev/null
  echo "  added: $key"
}

echo "Syncing to Production…"
for key in "${!VALUES[@]}"; do
  add_key "$key" "${VALUES[$key]}"
done

echo "Done. Redeploy production for changes to apply: vercel --prod or push to main."
if $DRY_RUN; then
  echo "(dry-run — no changes written)"
fi
