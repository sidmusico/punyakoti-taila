import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Payload } from 'payload'

import { syncAssetsToImageKit } from '@/lib/imagekit/syncAssets'
import { runHomepageTabSeed } from '@/seed/runHomepageTabSeed'
import { runImageKitMediaSeed } from '@/seed/runImageKitMediaSeed'
import { runMediaCatalogSeed } from '@/seed/runMediaCatalogSeed'
import { runPlpCatalogSeed } from '@/seed/runPlpCatalogSeed'
import { runProductCatalogSeed } from '@/seed/runProductCatalogSeed'
import { runServiceLocationsSeed } from '@/seed/runServiceLocationsSeed'
import { runSitePagesSeed } from '@/seed/runSitePagesSeed'
import { runStorefrontGlobalsSeed } from '@/seed/runStorefrontGlobalsSeed'
import { runTestimonialsSeed } from '@/seed/runTestimonialsSeed'

export type FullSeedStep = {
  step: string
  summary: { total: number; created: number; updated: number; skipped: number; errors: number }
  results: unknown[]
}

export interface FullSiteSeedOptions {
  /**
   * Mirror `assets/` → ImageKit → Payload media before catalog seeds.
   * Requires ImageKit env vars. Default `true`.
   */
  syncAssets?: boolean
}

function summarize(rows: { status: string }[]) {
  return {
    total: rows.length,
    created: rows.filter((r) => r.status === 'created').length,
    updated: rows.filter(
      (r) => r.status === 'updated' || r.status === 'images_updated' || r.status === 'forced',
    ).length,
    skipped: rows.filter((r) => r.status === 'skipped').length,
    errors: rows.filter((r) => r.status === 'error').length,
  }
}

function homepageSummary(result: { status: string }) {
  return {
    total: 1,
    created: result.status === 'created' ? 1 : 0,
    updated: result.status === 'updated' || result.status === 'forced' ? 1 : 0,
    skipped: result.status === 'skipped' ? 1 : 0,
    errors: 0,
  }
}

/**
 * Complete idempotent site seed (order matters).
 *
 * Pipeline: sync-assets → media → ImageKit media → products → PLP → testimonials →
 * service locations → homepage → CMS pages → storefront globals.
 *
 * Not a DB reset — creates missing docs and fills empty globals. Re-run safely.
 */
export async function runFullSiteSeed(
  payload: Payload,
  opts: FullSiteSeedOptions = {},
): Promise<{ steps: FullSeedStep[] }> {
  const steps: FullSeedStep[] = []
  const syncAssets = opts.syncAssets !== false

  if (syncAssets) {
    try {
      const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
      const assetsRoot = path.join(repoRoot, 'assets')
      const { summary, results } = await syncAssetsToImageKit({ payload, assetsRoot })
      steps.push({
        step: 'sync-assets',
        summary: {
          total: summary.scanned,
          created: summary.uploaded + summary.seeded,
          updated: summary.updated + summary.seedUpdated,
          skipped: summary.uploadSkipped + summary.seedSkipped,
          errors: summary.uploadErrors + summary.seedErrors,
        },
        results,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      // eslint-disable-next-line no-console
      console.warn('[runFullSiteSeed] sync-assets skipped:', message)
      steps.push({
        step: 'sync-assets',
        summary: { total: 0, created: 0, updated: 0, skipped: 0, errors: 1 },
        results: [{ status: 'error', error: message }],
      })
    }
  }

  const media = await runMediaCatalogSeed(payload)
  steps.push({ step: 'media', summary: summarize(media.results), results: media.results })

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
  steps.push({ step: 'plp', summary: summarize(plp.results), results: plp.results })

  const testimonials = await runTestimonialsSeed(payload)
  steps.push({
    step: 'testimonials',
    summary: summarize(testimonials.results),
    results: testimonials.results,
  })

  const serviceLocations = await runServiceLocationsSeed(payload)
  steps.push({
    step: 'service-locations',
    summary: summarize(serviceLocations.results),
    results: serviceLocations.results,
  })

  const homepage = await runHomepageTabSeed(payload)
  steps.push({
    step: 'homepage',
    summary: homepageSummary(homepage),
    results: [homepage],
  })

  const pages = await runSitePagesSeed(payload)
  steps.push({ step: 'pages', summary: summarize(pages.results), results: pages.results })

  const globals = await runStorefrontGlobalsSeed(payload)
  steps.push({
    step: 'storefront-globals',
    summary: summarize(globals.results),
    results: globals.results,
  })

  return { steps }
}
