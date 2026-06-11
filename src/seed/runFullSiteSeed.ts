import type { Payload } from 'payload'

import { runImageKitMediaSeed } from '@/seed/runImageKitMediaSeed'
import { runMediaCatalogSeed } from '@/seed/runMediaCatalogSeed'
import { runPlpCatalogSeed } from '@/seed/runPlpCatalogSeed'
import { runProductCatalogSeed } from '@/seed/runProductCatalogSeed'
import { runSitePagesSeed } from '@/seed/runSitePagesSeed'
import { runStorefrontGlobalsSeed } from '@/seed/runStorefrontGlobalsSeed'

export type FullSeedStep = {
  step: string
  summary: { total: number; created: number; skipped: number; errors: number }
  results: unknown[]
}

function summarize(rows: { status: string }[]) {
  return {
    total: rows.length,
    created: rows.filter((r) => r.status === 'created').length,
    skipped: rows.filter((r) => r.status === 'skipped').length,
    errors: rows.filter((r) => r.status === 'error').length,
  }
}

/**
 * Full idempotent site seed for a fresh dev DB (order matters).
 * Not a DB reset — only creates missing docs / fills empty globals.
 *
 * - `products` step includes **categories** (same as GET /api/seed-products).
 * - **Media** is seeded first so catalog images exist even if you skip products later.
 */
export async function runFullSiteSeed(payload: Payload): Promise<{ steps: FullSeedStep[] }> {
  const steps: FullSeedStep[] = []

  const media = await runMediaCatalogSeed(payload)
  steps.push({
    step: 'media',
    summary: summarize(media.results),
    results: media.results,
  })

  const imagekitMedia = await runImageKitMediaSeed(payload)
  steps.push({
    step: 'imagekit-media',
    summary: summarize(imagekitMedia.results),
    results: imagekitMedia.results,
  })

  const products = await runProductCatalogSeed(payload)
  steps.push({
    step: 'products',
    summary: summarize(products.results),
    results: products.results,
  })

  const plp = await runPlpCatalogSeed(payload)
  steps.push({
    step: 'plp',
    summary: summarize(plp.results),
    results: plp.results,
  })

  const pages = await runSitePagesSeed(payload)
  steps.push({
    step: 'pages',
    summary: summarize(pages.results),
    results: pages.results,
  })

  const globals = await runStorefrontGlobalsSeed(payload)
  steps.push({
    step: 'storefront-globals',
    summary: summarize(globals.results),
    results: globals.results,
  })

  return { steps }
}
