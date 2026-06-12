/**
 * Patch cloud Supabase Auth URL config (Site URL + redirect allow list).
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=... pnpm auth:configure-urls
 *   SUPABASE_ACCESS_TOKEN=... pnpm auth:configure-urls -- https://punyakoti-taila.vercel.app
 *
 * Token: https://supabase.com/dashboard/account/tokens
 */
import 'dotenv/config'

const PROJECT_REF = 'dvjirzgoedmgofrmxwwj'

function siteUrlFromArgv(): string {
  const flag = process.argv.find((a) => a.startsWith('https://'))
  if (flag) return flag.replace(/\/$/, '')
  const fromEnv =
    process.env.NEXT_PUBLIC_SERVER_URL_PROD?.trim() ||
    (process.env.NEXT_PUBLIC_SERVER_URL?.includes('localhost')
      ? undefined
      : process.env.NEXT_PUBLIC_SERVER_URL)
  return (fromEnv ?? 'https://punyakoti-taila.vercel.app').replace(/\/$/, '')
}

async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim()
  if (!token) {
    console.error(
      'Missing SUPABASE_ACCESS_TOKEN.\n' +
        'Create one at https://supabase.com/dashboard/account/tokens then run:\n' +
        '  SUPABASE_ACCESS_TOKEN=... pnpm auth:configure-urls',
    )
    process.exit(1)
  }

  const siteUrl = siteUrlFromArgv()
  const uri_allow_list = [
    `${siteUrl}/auth/callback`,
    'https://*.vercel.app/auth/callback',
    'http://localhost:3000/auth/callback',
    'http://127.0.0.1:3000/auth/callback',
  ].join(',')

  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      site_url: siteUrl,
      uri_allow_list,
      external_email_enabled: true,
      /** Sign in immediately after register (no inbox confirm). Set false in Dashboard for stricter prod. */
      mailer_autoconfirm: true,
    }),
  })

  const body = await res.text()
  if (!res.ok) {
    console.error(`[auth:configure-urls] Failed (${res.status}):`, body)
    process.exit(1)
  }

  console.log('[auth:configure-urls] Updated cloud Supabase Auth URLs:')
  console.log(`  site_url: ${siteUrl}`)
  for (const u of uri_allow_list.split(',')) console.log(`  redirect: ${u}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
