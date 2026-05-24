// This is Payload's legacy admin-preview footer component.
// The storefront uses src/components/shop/SiteFooter.tsx instead.
// Kept here for Payload live-preview compatibility.
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const footerData = (await getCachedGlobal('footer', 1)()) as any

  const legalLinks = (footerData?.legalLinks ?? []) as Array<{ label: string; href: string }>
  const tagline    = (footerData?.tagline as string | undefined) ?? 'Punyakoti Taila'

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <span className="text-sm text-gray-400">{tagline}</span>
          <nav className="flex flex-col md:flex-row gap-4">
            {legalLinks.map(({ label, href }) => (
              <Link className="text-white text-sm hover:underline" key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
