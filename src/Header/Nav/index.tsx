'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

// This component is a legacy Payload template component.
// The storefront uses SiteHeader / SiteHeaderWrapper instead.
// Kept here for Payload live-preview compatibility.
export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navLinks = ((data as any)?.navLinks ?? []) as Array<{ label: string; href: string }>

  return (
    <nav className="flex gap-3 items-center">
      {navLinks.map(({ label, href }) => (
        <Link key={href} href={href} className="text-sm hover:opacity-70 transition-opacity">
          {label}
        </Link>
      ))}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
