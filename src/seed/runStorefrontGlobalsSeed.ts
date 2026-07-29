import type { Payload } from 'payload'

import { isHomepageGlobalUnset } from '@/seed/homepageTabDefaults'
import { seedWriteContext } from '@/seed/seedContext'
import { readGeneratedGlobalJson } from '@/seed/readGeneratedGlobalJson'
import { runHomepageTabSeed } from '@/seed/runHomepageTabSeed'
import {
  accountSeedDefaults,
  cartSeedDefaults,
  newsletterPopupSeedDefaults,
  orderSuccessSeedDefaults,
  productDetailSeedDefaults,
  shopListingSeedDefaults,
} from '@/seed/storefrontSeedDefaults'
import { emailTemplatesSeedDefaults } from '@/seed/emailTemplatesSeedDefaults'

export type GlobalSeedResult = {
  kind: 'global'
  title: string
  slug: string
  status: 'created' | 'skipped' | 'error'
  id?: string | number
  error?: string
}

type GlobalSeedDef = {
  adminTitle: string
  slug: 'shop-listing' | 'product-detail' | 'cart' | 'account' | 'order-success' | 'newsletter-popup'
  jsonFile: string
  fallbackDefaults: Record<string, unknown>
  isUnset: (doc: Record<string, unknown>) => boolean
}

const storefrontGlobalSeeds: GlobalSeedDef[] = [
  {
    adminTitle: 'Shop listing',
    slug: 'shop-listing',
    jsonFile: 'shop-listing.json',
    fallbackDefaults: JSON.parse(JSON.stringify(shopListingSeedDefaults)) as Record<
      string,
      unknown
    >,
    isUnset: (doc) => {
      const plp = doc.plp as Record<string, unknown> | undefined
      return !plp?.headline || !plp?.introWhenCategory
    },
  },
  {
    adminTitle: 'Product detail',
    slug: 'product-detail',
    jsonFile: 'product-detail.json',
    fallbackDefaults: JSON.parse(JSON.stringify(productDetailSeedDefaults)) as Record<
      string,
      unknown
    >,
    isUnset: (doc) => {
      const pdp = doc.pdp as Record<string, unknown> | undefined
      const labels = pdp?.variantSizeLabels as unknown[] | undefined
      return !pdp?.ratingDisplay || pdp.starsCount == null || !labels?.length
    },
  },
  {
    adminTitle: 'Cart',
    slug: 'cart',
    jsonFile: 'cart.json',
    fallbackDefaults: JSON.parse(JSON.stringify(cartSeedDefaults)) as Record<string, unknown>,
    isUnset: (doc) => {
      const cd = doc.cartDrawer as Record<string, unknown> | undefined
      return !cd?.title
    },
  },
  {
    adminTitle: 'Account',
    slug: 'account',
    jsonFile: 'account.json',
    fallbackDefaults: JSON.parse(JSON.stringify(accountSeedDefaults)) as Record<string, unknown>,
    isUnset: (doc) => {
      const a = doc.account as Record<string, unknown> | undefined
      return !a?.pageTitle
    },
  },
  {
    adminTitle: 'Order confirmation',
    slug: 'order-success',
    jsonFile: 'order-success.json',
    fallbackDefaults: JSON.parse(JSON.stringify(orderSuccessSeedDefaults)) as Record<
      string,
      unknown
    >,
    isUnset: (doc) => {
      const o = doc.orderSuccess as Record<string, unknown> | undefined
      return !o?.thankYouHeadline
    },
  },
  {
    adminTitle: 'Newsletter popup',
    slug: 'newsletter-popup',
    jsonFile: 'newsletter-popup.json',
    fallbackDefaults: JSON.parse(JSON.stringify(newsletterPopupSeedDefaults)) as Record<
      string,
      unknown
    >,
    isUnset: (doc) => {
      const content = doc.content as Record<string, unknown> | undefined
      return !content?.headlinePre
    },
  },
]

/** Storefront globals + homepage-settings (same rules as GET /api/seed-pages globals section). */
export async function runStorefrontGlobalsSeed(
  payload: Payload,
): Promise<{ results: GlobalSeedResult[] }> {
  const results: GlobalSeedResult[] = []

  for (const g of storefrontGlobalSeeds) {
    try {
      const existingGlobal = await payload.findGlobal({
        slug: g.slug,
        depth: 0,
        overrideAccess: true,
      })
      const doc = existingGlobal as unknown as Record<string, unknown>
      if (!g.isUnset(doc)) {
        results.push({
          kind: 'global',
          title: g.adminTitle,
          slug: g.slug,
          status: 'skipped',
        })
        continue
      }
      const fromFile = await readGeneratedGlobalJson(g.jsonFile)
      const data = fromFile && Object.keys(fromFile).length > 0 ? fromFile : g.fallbackDefaults
      await payload.updateGlobal({
        slug: g.slug,
        overrideAccess: true,
        context: seedWriteContext,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
      })
      results.push({
        kind: 'global',
        title: g.adminTitle,
        slug: g.slug,
        status: 'created',
        id: fromFile ? `from-src/seed/generated/${g.jsonFile}` : 'from-code-defaults',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      results.push({
        kind: 'global',
        title: g.adminTitle,
        slug: g.slug,
        status: 'error',
        error: message,
      })
    }
  }

  try {
    const existingHp = await payload.findGlobal({
      slug: 'homepage-settings',
      depth: 0,
      overrideAccess: true,
    })
    if (!isHomepageGlobalUnset(existingHp)) {
      results.push({
        kind: 'global',
        title: 'Homepage settings (global)',
        slug: 'homepage-settings',
        status: 'skipped',
      })
    } else {
      const fromFile = await readGeneratedGlobalJson('homepage-settings.json')
      if (fromFile && Object.keys(fromFile).length > 0) {
        await payload.updateGlobal({
          slug: 'homepage-settings',
          overrideAccess: true,
          context: seedWriteContext,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: fromFile as any,
        })
        results.push({
          kind: 'global',
          title: 'Homepage settings (global)',
          slug: 'homepage-settings',
          status: 'created',
          id: 'from-src/seed/generated/homepage-settings.json',
        })
      } else {
        const hpResult = await runHomepageTabSeed(payload)
        results.push({
          kind: 'global',
          title: 'Homepage settings (global)',
          slug: 'homepage-settings',
          status: hpResult.status === 'created' ? 'created' : 'skipped',
          id: hpResult.status === 'created' ? 'from-code-tab-defaults' : undefined,
        })
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    results.push({
      kind: 'global',
      title: 'Homepage settings (global)',
      slug: 'homepage-settings',
      status: 'error',
      error: message,
    })
  }

  try {
    const existingEmail = await payload.findGlobal({
      slug: 'email-templates',
      depth: 0,
      overrideAccess: true,
    })
    const confirmed = (existingEmail as { orderConfirmed?: { subject?: string } })?.orderConfirmed
    if (confirmed?.subject) {
      results.push({
        kind: 'global',
        title: 'Email templates',
        slug: 'email-templates',
        status: 'skipped',
      })
    } else {
      await payload.updateGlobal({
        slug: 'email-templates',
        overrideAccess: true,
        context: seedWriteContext,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: emailTemplatesSeedDefaults as any,
      })
      results.push({
        kind: 'global',
        title: 'Email templates',
        slug: 'email-templates',
        status: 'created',
        id: 'from-code-defaults',
      })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    results.push({
      kind: 'global',
      title: 'Email templates',
      slug: 'email-templates',
      status: 'error',
      error: message,
    })
  }

  return { results }
}
