import type { Payload } from 'payload'

import { applyDatabaseUrl, maskDatabaseUrl, type Target } from './cli-target'

/**
 * Load Payload after `DATABASE_URL` is set for the chosen target.
 * Must dynamic-import `payload.config` so `postgresPoolOptions()` reads the
 * correct connection string (static imports bake in local `.env` at load time).
 */
export async function loadPayloadForTarget(target: Target): Promise<Payload> {
  const url = applyDatabaseUrl(target)
  // eslint-disable-next-line no-console
  console.log(`[payload] Connecting → ${maskDatabaseUrl(url)}`)

  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('../src/payload.config'),
  ])

  return getPayload({ config })
}
