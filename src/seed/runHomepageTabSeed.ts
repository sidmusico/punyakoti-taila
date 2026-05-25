import type { Payload } from 'payload'

import { homepageTabDefaults, isHomepageGlobalUnset } from '@/seed/homepageTabDefaults'

export type HomepageTabSeedResult = {
  slug: 'homepage-settings'
  status: 'created' | 'skipped'
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
 * Skips when the global already looks configured unless `force` is true.
 *
 * Media wiring: image slots default to known ImageKit assets (matched by `alt`,
 * set during `runImageKitMediaSeed`). Missing media is silently skipped so the
 * seed still works on a fresh DB without ImageKit assets.
 */
export async function runHomepageTabSeed(
  payload: Payload,
  opts?: { force?: boolean },
): Promise<HomepageTabSeedResult> {
  const existing = await payload.findGlobal({
    slug: 'homepage-settings',
    depth: 0,
    overrideAccess: true,
  })

  if (!opts?.force && !isHomepageGlobalUnset(existing)) {
    return { slug: 'homepage-settings', status: 'skipped' }
  }

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
  const data: any = JSON.parse(JSON.stringify(homepageTabDefaults))
  if (cinematicImg) data.cinematic.image = cinematicImg
  if (heroImg) data.hero.image = heroImg
  if (traditionImg) data.tradition.image = traditionImg
  if (processBanner) data.processSteps.bannerImage = processBanner
  if (processBg) data.processSection.backgroundImage = processBg
  if (poeticBg) data.poetic.backgroundImage = poeticBg
  if (statsBg) data.statsBand.backgroundImage = statsBg
  if (faqBg) data.faq.backgroundImage = faqBg

  await payload.updateGlobal({
    slug: 'homepage-settings',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data,
  })

  return { slug: 'homepage-settings', status: 'created' }
}
