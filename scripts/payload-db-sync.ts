/**
 * Connect to Payload with Drizzle dev push enabled so the DB schema matches `payload.config`
 * (new tables/columns/enums). This is a **migrate-style push**, not a reset — existing rows are kept
 * unless Drizzle must perform a destructive step (rare; watch CLI output).
 *
 * **Routine after changing collections/globals/admin:** run the single command (from repo root):
 *   `pnpm cms:sync`
 * That runs `generate:importmap` → `generate:types` → this script.
 *
 * If Drizzle stops on an enum prompt (no TTY), either:
 *   1) Run `pnpm cms:sync` from a normal terminal and choose an option, or
 *   2) `pnpm db:local:fresh` — resets local Supabase DB then syncs (**wipes** local Postgres data).
 *
 * After tables exist, you can use `pnpm dev:safe` (PAYLOAD_DISABLE_DB_PUSH=true) so Next dev never hangs on push.
 * The script exits the process explicitly so the shell returns (Payload keeps the DB pool open).
 *
 * Usage: `pnpm payload:db-sync` (DB only) or `pnpm cms:sync` (import map + types + DB).
 */
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../src/payload.config'

async function main() {
  // eslint-disable-next-line no-console
  console.log('[payload-db-sync] Connecting (Drizzle push may run — watch for prompts)…')
  const payload = await getPayload({ config })
  await payload.findGlobal({ slug: 'shop-listing', depth: 0 })
  // eslint-disable-next-line no-console
  console.log('[payload-db-sync] OK — `shop_listing` is reachable.')
  // Payload keeps the pg pool open; without this, the process never exits (pnpm looks "stuck").
  process.exit(0)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[payload-db-sync] Failed:', err)
  process.exit(1)
})
