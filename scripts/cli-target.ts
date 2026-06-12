import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

export type Target = 'local' | 'prod'

export const LOCAL_DATABASE_URL =
  process.env.DATABASE_URL_LOCAL?.trim() ||
  (process.env.DATABASE_URL?.includes('127.0.0.1') ||
  process.env.DATABASE_URL?.includes('localhost')
    ? process.env.DATABASE_URL
    : 'postgresql://postgres:postgres@127.0.0.1:54325/postgres?sslmode=disable')

export const PROD_DATABASE_URL = process.env.DATABASE_URL_PROD?.trim()

export const TARGETS: Record<Target, { label: string; url: string | undefined }> = {
  local: {
    label: 'Local — Supabase Postgres (127.0.0.1:54325)',
    url: LOCAL_DATABASE_URL,
  },
  prod: {
    label: 'Production — Supabase pooler (cloud)',
    url: PROD_DATABASE_URL,
  },
}

export function maskDatabaseUrl(url: string): string {
  try {
    const u = new URL(url.replace(/^postgresql:/, 'postgres:'))
    if (u.password) u.password = '****'
    return u.toString().replace(/^postgres:/, 'postgresql:')
  } catch {
    return url.replace(/:([^:@/]+)@/, ':****@')
  }
}

export function resolveDatabaseUrl(target: Target): string {
  const url = TARGETS[target].url
  if (!url) {
    throw new Error(
      'Missing DATABASE_URL_PROD in .env.\n' +
        'Add:\nDATABASE_URL_PROD=postgresql://postgres.dvjirzgoedmgofrmxwwj:...@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require',
    )
  }
  return url
}

export function applyDatabaseUrl(target: Target): string {
  const url = resolveDatabaseUrl(target)
  process.env.DATABASE_URL = url
  return url
}

export async function pickTarget(argv: string[], title: string): Promise<Target> {
  const flag = argv.find((a) => a === 'local' || a === 'prod')
  if (flag === 'local' || flag === 'prod') return flag

  console.log(`\n  ${title} — choose database\n`)
  ;(['local', 'prod'] as const).forEach((key, i) => {
    const t = TARGETS[key]
    const url = t.url ? maskDatabaseUrl(t.url) : '(not configured)'
    console.log(`  ${i + 1}) ${t.label}`)
    console.log(`     ${url}\n`)
  })

  const rl = readline.createInterface({ input, output })
  const answer = (await rl.question('Enter 1 or 2 [1]: ')).trim() || '1'
  rl.close()

  return answer === '2' ? 'prod' : 'local'
}

export async function confirmProd(target: Target, action: string): Promise<boolean> {
  if (target !== 'prod') return true
  const url = resolveDatabaseUrl('prod')
  const rl = readline.createInterface({ input, output })
  const confirm = (
    await rl.question(`\n${action} on PRODUCTION?\n  ${maskDatabaseUrl(url)}\nType "yes" to continue: `)
  ).trim()
  rl.close()
  return confirm.toLowerCase() === 'yes'
}
