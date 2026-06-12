import type { Payload } from 'payload'

import { seedWriteContext } from '@/seed/seedContext'
import { BOTTLE_ROW_PRODUCT_SLUGS } from '@/seed/bottleRowProductSlugs'
import { homepageTabDefaults } from '@/seed/homepageTabDefaults'
import { mergeMissing } from '@/seed/incrementalMerge'
import { imageAltForJournalSlug } from '@/seed/journalPostImages'
import { productIdsBySlugs } from '@/seed/resolveProductIds'

export type HomepageTabSeedResult = {
  slug: 'homepage-settings'
  status: 'created' | 'updated' | 'skipped' | 'forced'
  filledPaths: string[]
  force: boolean
}

type JournalPostRow = Record<string, unknown> & { slug?: string; image?: unknown }

const LEGACY_PRESS_PHRASES = [
  'press of the week',
  'wood-press diary',
  'press updates from erode',
  'visit the press',
  'now available in these cities',
  'sat next to the press',
]

function hasLegacyPressCopy(value: unknown): boolean {
  if (typeof value !== 'string') return false
  const lower = value.toLowerCase()
  return LEGACY_PRESS_PHRASES.some((phrase) => lower.includes(phrase))
}

/** Strip removed CMS fields and refresh copy that still mentions the old press editorial. */
function applyLegacyPressRemoval(
  merged: Record<string, unknown>,
  defaults: Record<string, unknown>,
  filledPaths: string[],
): void {
  for (const key of [
    'pressMarqueeEnabled',
    'pressMarquee',
  ] as const) {
    if (key in merged) {
      delete merged[key]
      filledPaths.push(`<removed>.${key}`)
    }
  }

  const hero = merged.hero as Record<string, unknown> | undefined
  if (hero) {
    for (const key of ['pressWeekKicker', 'pressWeekTitle'] as const) {
      if (key in hero) {
        delete hero[key]
        filledPaths.push(`hero.<removed>.${key}`)
      }
    }
  }

  const tradition = merged.tradition as Record<string, unknown> | undefined
  const defaultTradition = defaults.tradition as Record<string, unknown> | undefined
  if (tradition) {
    if ('ctaSecondary' in tradition) {
      delete tradition.ctaSecondary
      filledPaths.push('tradition.<removed>.ctaSecondary')
    }
    if (hasLegacyPressCopy(tradition.mediaCaptionLeft) && defaultTradition?.mediaCaptionLeft) {
      tradition.mediaCaptionLeft = defaultTradition.mediaCaptionLeft
      filledPaths.push('tradition.mediaCaptionLeft')
    }
  }

  const poetic = merged.poetic as Record<string, unknown> | undefined
  const defaultPoetic = defaults.poetic as Record<string, unknown> | undefined
  if (poetic?.eyebrow && hasLegacyPressCopy(poetic.eyebrow) && defaultPoetic?.eyebrow) {
    poetic.eyebrow = defaultPoetic.eyebrow
    filledPaths.push('poetic.eyebrow')
  }

  const newsletter = merged.newsletter as Record<string, unknown> | undefined
  const defaultNewsletter = defaults.newsletter as Record<string, unknown> | undefined
  if (
    newsletter &&
    defaultNewsletter &&
    (hasLegacyPressCopy(newsletter.eyebrow) || hasLegacyPressCopy(newsletter.body))
  ) {
    Object.assign(newsletter, defaultNewsletter)
    filledPaths.push('newsletter')
  }

  const journal = merged.journal as { posts?: JournalPostRow[] } | undefined
  const defaultPosts = (defaults.journal as { posts?: JournalPostRow[] } | undefined)?.posts
  if (journal?.posts && defaultPosts) {
    const replacement = defaultPosts.find((p) => p.slug === 'erode-origin-story') ?? defaultPosts[1]
    for (let i = 0; i < journal.posts.length; i++) {
      const post = journal.posts[i]
      if (post.slug === 'erode-press-diary' || hasLegacyPressCopy(post.title)) {
        journal.posts[i] = { ...replacement, image: post.image ?? replacement?.image }
        filledPaths.push(`journal.posts.${String(post.slug ?? i)}`)
      }
    }
  }
}

async function wireJournalPostImages(
  payload: Payload,
  posts: JournalPostRow[] | undefined,
): Promise<string[]> {
  if (!Array.isArray(posts)) return []
  const filled: string[] = []
  for (const post of posts) {
    if (post.image) continue
    const slug = post.slug ?? ''
    const alt = imageAltForJournalSlug(slug)
    if (!alt) continue
    const id = await mediaIdByAlt(payload, alt)
    if (!id) continue
    post.image = id
    filled.push(`journal.posts.${slug}.image`)
  }
  return filled
}

async function mediaIdByAlt(payload: Payload, alt: string): Promise<string | number | null> {
  try {
    const res = await payload.find({
      collection: 'media',
      where: { alt: { equals: alt } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    return res.docs[0]?.id ?? null
  } catch {
    return null
  }
}

/**
 * Writes tab-based homepage defaults into Globals → Homepage.
 *
 * Default (no `force`): **incremental** — only newly-added fields / empty
 *   slots in the existing global are filled. Edits the admin made survive.
 *
 * `force=true`: overwrites the entire global with the defaults document.
 *
 * Media wiring: image slots default to known ImageKit assets (matched by `alt`,
 * set during `runImageKitMediaSeed`). Missing media is silently skipped so the
 * seed still works on a fresh DB without ImageKit assets.
 */
export async function runHomepageTabSeed(
  payload: Payload,
  opts?: { force?: boolean },
): Promise<HomepageTabSeedResult> {
  const force = opts?.force === true

  const existing = await payload.findGlobal({
    slug: 'homepage-settings',
    depth: 0,
    overrideAccess: true,
  })

  const [
    cinematicImg,
    heroImg,
    traditionImg,
    processBanner,
    processBg,
    poeticBg,
    statsBg,
    faqBg,
  ] = await Promise.all([
    mediaIdByAlt(payload, 'home/hero-04-bottles-ingredients'),
    mediaIdByAlt(payload, 'home/hero-05-warm-golden-bottle'),
    mediaIdByAlt(payload, 'process/traditional-ghani-village'),
    mediaIdByAlt(payload, 'process/ghana-press-oil-flowing'),
    mediaIdByAlt(payload, 'process/wood-press-machine-moody'),
    mediaIdByAlt(payload, 'ingredients/oil-ripples-wooden-bowl'),
    mediaIdByAlt(payload, 'ingredients/raw-seeds-peanuts-coconut'),
    mediaIdByAlt(payload, 'ingredients/mortar-pestle-filling'),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaults: any = JSON.parse(JSON.stringify(homepageTabDefaults))
  if (cinematicImg) defaults.cinematic.image = cinematicImg
  if (heroImg) defaults.hero.image = heroImg
  if (traditionImg) defaults.tradition.image = traditionImg
  if (processBanner) defaults.processSteps.bannerImage = processBanner
  if (processBg) defaults.processSection.backgroundImage = processBg
  if (poeticBg) defaults.poetic.backgroundImage = poeticBg
  if (statsBg) defaults.statsBand.backgroundImage = statsBg
  if (faqBg) defaults.faq.backgroundImage = faqBg

  const bottleRowProductIds = await productIdsBySlugs(payload, BOTTLE_ROW_PRODUCT_SLUGS)
  if (bottleRowProductIds.length > 0) {
    defaults.bottleRow = {
      ...defaults.bottleRow,
      products: bottleRowProductIds,
    }
  }

  const defaultJournalPosts = defaults.journal?.posts as JournalPostRow[] | undefined
  await wireJournalPostImages(payload, defaultJournalPosts)

  // Force path — overwrite wholesale.
  if (force) {
    await payload.updateGlobal({
      slug: 'homepage-settings',
      overrideAccess: true,
      context: seedWriteContext,
      data: defaults,
    })
    return {
      slug: 'homepage-settings',
      status: 'forced',
      filledPaths: ['<root>'],
      force: true,
    }
  }

  // Incremental path — fill only missing fields.
  const { merged, filledPaths } = mergeMissing(
    existing as unknown as Record<string, unknown>,
    defaults,
  )

  const existingBottleProducts = (existing as { bottleRow?: { products?: unknown[] } })?.bottleRow
    ?.products
  const bottleProductsMissing =
    !Array.isArray(existingBottleProducts) || existingBottleProducts.length === 0
  if (bottleProductsMissing && bottleRowProductIds.length > 0) {
    const br = (merged.bottleRow as Record<string, unknown> | undefined) ?? {}
    merged.bottleRow = { ...br, products: bottleRowProductIds }
    filledPaths.push('bottleRow.products')
  }

  applyLegacyPressRemoval(merged, defaults, filledPaths)

  const mergedJournal = merged.journal as { posts?: JournalPostRow[] } | undefined
  const journalImagePaths = await wireJournalPostImages(payload, mergedJournal?.posts)
  filledPaths.push(...journalImagePaths)

  if (filledPaths.length === 0) {
    return {
      slug: 'homepage-settings',
      status: 'skipped',
      filledPaths: [],
      force: false,
    }
  }

  const looksEmpty =
    !existing || typeof existing !== 'object' || !('cinematicEnabled' in (existing as object))

  await payload.updateGlobal({
    slug: 'homepage-settings',
    overrideAccess: true,
    context: seedWriteContext,
    data: merged,
  })

  return {
    slug: 'homepage-settings',
    status: looksEmpty ? 'created' : 'updated',
    filledPaths,
    force: false,
  }
}
