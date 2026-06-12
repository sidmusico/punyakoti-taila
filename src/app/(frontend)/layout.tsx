import type { Metadata } from 'next'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { SiteHeaderWrapper } from '@/components/shop/SiteHeaderWrapper'
import { SiteFooter } from '@/components/shop/SiteFooter'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { NewsletterPopup, type NewsletterPopupData } from '@/components/shop/NewsletterPopup'
import { getPayload } from 'payload'
import config from '@payload-config'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getStorefrontBundle } from '@/utilities/getStorefrontBundle'

/** Crash-safe: the global's table may not exist until `pnpm cms:sync` runs. */
async function getNewsletterPopupData(): Promise<NewsletterPopupData> {
  try {
    const payload = await getPayload({ config })
    const doc = await payload.findGlobal({ slug: 'newsletter-popup' as never, depth: 1 })
    return JSON.parse(JSON.stringify(doc)) as NewsletterPopupData
  } catch {
    return null // component falls back to its code defaults
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const storefrontBundle = JSON.parse(JSON.stringify(await getStorefrontBundle())) as Awaited<
    ReturnType<typeof getStorefrontBundle>
  >
  const newsletterPopup = await getNewsletterPopupData()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        {/* Google Fonts — loaded here to avoid Tailwind v4 PostCSS @import ordering conflict */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Manrope:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-body)', background: 'var(--cream-200)', color: 'var(--ink-900)', minHeight: '100vh' }}>
        <Providers storefrontBundle={storefrontBundle}>
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          <SiteHeaderWrapper />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
          <NewsletterPopup data={newsletterPopup} />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Punyakoti Taila — Wood-Pressed Oils from Karnataka',
    template: '%s | Punyakoti Taila',
  },
  description:
    'Premium cold-pressed, wood-pressed oils from Raibag, Karnataka. Single-origin, unrefined, bottled within 72 hours of pressing.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
