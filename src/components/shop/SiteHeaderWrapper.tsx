import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

import { SiteHeader } from './SiteHeader'

/**
 * Fallback brand lock-up — used when no Media row has been linked to the
 * Header global yet. Points at the ImageKit-hosted PNG directly with a
 * `tr=` transform so we serve a header-sized WebP instead of the full
 * 2804×1536 source.
 *
 * Filename: the brand asset on ImageKit is `punyakoti-logo-no-bg.png`
 * (no `-1` suffix). If the admin uploads / picks a different file via
 * the CMS Header → Logo & Brand → Logo image field, that takes precedence.
 */
const FALLBACK_LOGO_URL =
  'https://ik.imagekit.io/zx7l7bhei/punyakoti-taila/brand/punyakoti-logo-no-bg.png?tr=w-400,f-auto,q-90'

/**
 * Best URL for an uploaded media doc.
 *  - `imagekitUrl` is the original source on ImageKit (PNG / SVG / etc).
 *  - `url` is what Payload generates for the public URL — when sharp
 *     conversions are configured this can be a `.jpeg` rewrite, which
 *     loses transparency. We prefer `imagekitUrl` when present so a
 *     transparent PNG logo stays transparent.
 */
function pickMediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as { url?: string | null; imagekitUrl?: string | null }
  if (m.imagekitUrl && typeof m.imagekitUrl === 'string') return m.imagekitUrl
  if (m.url && typeof m.url === 'string') return m.url
  return null
}

async function resolveLogoUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logoImage: any,
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<string | null> {
  if (!logoImage) return null

  // Already populated (depth >= 1) — read the URL fields directly.
  if (typeof logoImage === 'object') {
    return pickMediaUrl(logoImage)
  }

  // Came back as an ID (string / number). Fetch the media doc explicitly.
  try {
    const doc = await payload.findByID({
      collection: 'media',
      id: logoImage,
      depth: 0,
      overrideAccess: true,
    })
    return pickMediaUrl(doc)
  } catch (err) {
    console.error('[SiteHeaderWrapper] resolveLogoUrl failed:', err)
    return null
  }
}

/**
 * Renders the storefront header. Fetched fresh on every request — header
 * payload is small and admins expect saves in the CMS to show up
 * immediately. (The previous `unstable_cache` wrapping caused stale logo /
 * nav data to linger after edits.)
 */
export async function SiteHeaderWrapper() {
  const payload = await getPayload({ config })
  const header = await payload.findGlobal({
    slug: 'header',
    depth: 1,
    overrideAccess: true,
  })

  const bar = (header as { announcementBar?: unknown }).announcementBar as {
    enabled?: boolean
    text?: string
    highlight?: string
    link?: string
  } | undefined

  const navLinks = ((header as { navLinks?: unknown }).navLinks ?? []) as Array<{
    label: string
    href: string
    openInNewTab?: boolean
  }>

  const logoText =
    ((header as { logoText?: string }).logoText as string | undefined) ?? 'Punyakoti·'
  const logoTagline =
    ((header as { logoTagline?: string }).logoTagline as string | undefined) ?? 'T A I L A'

  const adminLogoUrl = await resolveLogoUrl(
    (header as { logoImage?: unknown }).logoImage,
    payload,
  )
  const logoImageUrl = adminLogoUrl ?? FALLBACK_LOGO_URL

  return (
    <SiteHeader
      announcementEnabled={bar?.enabled ?? true}
      announcementText={bar?.text ?? undefined}
      announcementHighlight={bar?.highlight ?? undefined}
      announcementLink={bar?.link ?? undefined}
      navLinks={navLinks.length > 0 ? navLinks : undefined}
      logoText={logoText}
      logoTagline={logoTagline}
      logoImageUrl={logoImageUrl}
    />
  )
}
