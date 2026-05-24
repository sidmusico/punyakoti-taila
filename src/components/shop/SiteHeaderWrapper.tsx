import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { SiteHeader } from './SiteHeader'

const getHeaderSettings = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.findGlobal({ slug: 'header', depth: 1 })
  },
  ['header-global'],
  { tags: ['global_header'], revalidate: 3600 },
)

export async function SiteHeaderWrapper() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const header = (await getHeaderSettings()) as any

  const bar = header.announcementBar as {
    enabled?: boolean
    text?: string
    highlight?: string
    link?: string
  } | undefined

  const navLinks = (header.navLinks ?? []) as Array<{
    label: string
    href: string
    openInNewTab?: boolean
  }>

  /* Logo — logoImage is an uploaded media object (depth: 1) */
  const logoText    = (header.logoText    as string | undefined) ?? 'Punyakoti·'
  const logoTagline = (header.logoTagline as string | undefined) ?? 'T A I L A'
  const logoImage   = header.logoImage as { url?: string } | null | undefined
  const logoImageUrl = logoImage?.url ?? null

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
