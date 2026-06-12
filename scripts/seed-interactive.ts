/**
 * Interactive content seed — pick database (local/prod) then seed action.
 *
 * Usage:
 *   pnpm seed                    # menus for target + action
 *   pnpm seed -- local           # local DB, then action menu
 *   pnpm seed -- prod all        # prod + full seed (with confirmation)
 *   pnpm seed -- local homepage  # local + homepage tab seed
 */
import 'dotenv/config'

import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { syncAssetsToImageKit } from '../src/lib/imagekit/syncAssets'
import { runCategoriesSeed } from '../src/seed/runCategoriesSeed'
import { runFullSiteSeed } from '../src/seed/runFullSiteSeed'
import { runHomepageTabSeed } from '../src/seed/runHomepageTabSeed'
import { runImageKitMediaSeed } from '../src/seed/runImageKitMediaSeed'
import { runMediaCatalogSeed } from '../src/seed/runMediaCatalogSeed'
import { runPlpCatalogSeed } from '../src/seed/runPlpCatalogSeed'
import { runProductCatalogSeed } from '../src/seed/runProductCatalogSeed'
import { runSitePagesSeed } from '../src/seed/runSitePagesSeed'
import { runStorefrontGlobalsSeed } from '../src/seed/runStorefrontGlobalsSeed'
import { runTestimonialsSeed } from '../src/seed/runTestimonialsSeed'

import {
  applyDatabaseUrl,
  confirmProd,
  pickTarget,
  type Target,
} from './cli-target'

type SeedKey =
  | 'all'
  | 'categories'
  | 'media'
  | 'imagekit-media'
  | 'products'
  | 'plp'
  | 'site-pages'
  | 'storefront-globals'
  | 'homepage'
  | 'pages'
  | 'testimonials'
  | 'sync-assets'

const SEED_OPTIONS: Array<{ key: SeedKey; label: string; force?: boolean }> = [
  { key: 'all', label: 'Full site seed (media → products → PLP → pages → testimonials → globals)' },
  { key: 'sync-assets', label: 'Sync local assets/ → ImageKit → Payload media' },
  { key: 'imagekit-media', label: 'ImageKit catalog → Payload media docs' },
  { key: 'categories', label: 'Categories only' },
  { key: 'media', label: 'Media catalog (legacy Unsplash URLs)' },
  { key: 'products', label: 'Products + categories' },
  { key: 'plp', label: 'PLP catalog (chip categories + district products)', force: true },
  { key: 'site-pages', label: 'CMS pages (block layouts)' },
  { key: 'storefront-globals', label: 'Storefront globals (shop, cart, account, …)' },
  { key: 'homepage', label: 'Homepage settings tab (all homepage bands)', force: true },
  { key: 'pages', label: 'Site pages + storefront globals' },
  { key: 'testimonials', label: 'Testimonials with portrait images', force: true },
]

function summarize(rows: { status: string }[]) {
  return {
    total: rows.length,
    created: rows.filter((r) => r.status === 'created').length,
    updated: rows.filter((r) => r.status === 'updated').length,
    skipped: rows.filter((r) => r.status === 'skipped').length,
    errors: rows.filter((r) => r.status === 'error').length,
  }
}

async function askForce(actionLabel: string): Promise<boolean> {
  const rl = readline.createInterface({ input, output })
  const answer = (
    await rl.question(`\nForce overwrite for "${actionLabel}"? [y/N]: `)
  ).trim()
  rl.close()
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes'
}

async function pickSeed(argv: string[]): Promise<SeedKey> {
  const known = SEED_OPTIONS.map((o) => o.key)
  const flag = argv.find((a) => known.includes(a as SeedKey))
  if (flag) return flag as SeedKey

  console.log('\n  Choose seed action\n')
  SEED_OPTIONS.forEach((opt, i) => {
    console.log(`  ${i + 1}) ${opt.label}`)
  })

  const rl = readline.createInterface({ input, output })
  const answer = (await rl.question(`\nEnter 1–${SEED_OPTIONS.length} [1]: `)).trim() || '1'
  rl.close()

  const idx = Math.max(0, Math.min(SEED_OPTIONS.length - 1, parseInt(answer, 10) - 1))
  return SEED_OPTIONS[idx]?.key ?? 'all'
}

async function runSeedAction(key: SeedKey, force: boolean) {
  const payload = await getPayload({ config })

  switch (key) {
    case 'all': {
      const { steps } = await runFullSiteSeed(payload)
      console.log(JSON.stringify({ summary: steps.map((s) => ({ step: s.step, ...s.summary })) }, null, 2))
      return
    }
    case 'categories': {
      const { results } = await runCategoriesSeed(payload)
      console.log(JSON.stringify({ summary: summarize(results), results }, null, 2))
      return
    }
    case 'media': {
      const { results } = await runMediaCatalogSeed(payload)
      console.log(JSON.stringify({ summary: summarize(results), results }, null, 2))
      return
    }
    case 'imagekit-media': {
      const { results } = await runImageKitMediaSeed(payload)
      console.log(JSON.stringify({ summary: summarize(results), results }, null, 2))
      return
    }
    case 'products': {
      const { results } = await runProductCatalogSeed(payload)
      console.log(JSON.stringify({ summary: summarize(results), results }, null, 2))
      return
    }
    case 'plp': {
      const { results } = await runPlpCatalogSeed(payload, { force })
      console.log(JSON.stringify({ summary: summarize(results), results }, null, 2))
      return
    }
    case 'site-pages': {
      const { results } = await runSitePagesSeed(payload)
      console.log(JSON.stringify({ summary: summarize(results), results }, null, 2))
      return
    }
    case 'storefront-globals': {
      const { results } = await runStorefrontGlobalsSeed(payload)
      console.log(JSON.stringify({ summary: summarize(results), results }, null, 2))
      return
    }
    case 'homepage': {
      const result = await runHomepageTabSeed(payload, { force })
      console.log(JSON.stringify(result, null, 2))
      return
    }
    case 'pages': {
      const pages = await runSitePagesSeed(payload)
      const globals = await runStorefrontGlobalsSeed(payload)
      console.log(
        JSON.stringify(
          {
            pages: { summary: summarize(pages.results), results: pages.results },
            storefrontGlobals: { summary: summarize(globals.results), results: globals.results },
          },
          null,
          2,
        ),
      )
      return
    }
    case 'testimonials': {
      const { results } = await runTestimonialsSeed(payload, { force })
      console.log(JSON.stringify({ summary: summarize(results), results }, null, 2))
      return
    }
    case 'sync-assets': {
      const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
      const assetsRoot = path.join(repoRoot, 'assets')
      console.log(`[seed] Syncing ${assetsRoot} → ImageKit → Payload…\n`)
      const { summary } = await syncAssetsToImageKit({
        payload,
        assetsRoot,
        onEvent: (event) => {
          if (event.type === 'file-done' || event.type === 'summary') {
            console.log(JSON.stringify(event))
          }
        },
      })
      console.log(JSON.stringify({ summary }, null, 2))
      return
    }
    default:
      throw new Error(`Unknown seed: ${key}`)
  }
}

async function main() {
  const argv = process.argv.slice(2).filter((a) => a !== '--')
  const target = await pickTarget(argv, 'Content seed')
  applyDatabaseUrl(target)

  const seedKey = await pickSeed(argv)
  const option = SEED_OPTIONS.find((o) => o.key === seedKey)!
  const known = SEED_OPTIONS.map((o) => o.key)
  const seedFromArgv = argv.some((a) => known.includes(a as SeedKey))
  const forceFlag = argv.includes('--force') || argv.includes('-f')
  let force = false
  if (option.force) {
    force = forceFlag || (!seedFromArgv && (await askForce(option.label)))
  }

  const ok = await confirmProd(target, `Run "${option.label}"`)
  if (!ok) {
    console.log('Cancelled.')
    process.exit(0)
  }

  console.log(`\n[seed] ${option.label} → ${target}\n`)

  await runSeedAction(seedKey, force)
  console.log('\n[seed] Done.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed] Error:', err instanceof Error ? err.message : err)
  process.exit(1)
})
