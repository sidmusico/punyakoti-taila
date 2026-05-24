import type { Metadata } from 'next'
import React from 'react'
import type { Media } from '@/payload-types'
import { CartPageView } from '@/components/shop/CartPageView'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getStorefrontBundle } from '@/utilities/getStorefrontBundle'

export async function generateMetadata(): Promise<Metadata> {
  const { storefront } = await getStorefrontBundle()
  const c = storefront.cartPage
  return {
    title: c?.metaTitle ?? 'Your cart',
    description: c?.metaDescription ?? undefined,
  }
}

function mediaSrc(m: unknown): string | null {
  if (m && typeof m === 'object' && 'url' in m && typeof (m as Media).url === 'string') {
    return getMediaUrl((m as Media).url)
  }
  return null
}

export default async function CartRoutePage() {
  const { storefront } = await getStorefrontBundle()
  const hero = storefront.cartPage?.heroImage
  const heroImageUrl = mediaSrc(hero)

  return <CartPageView cartPage={storefront.cartPage} heroImageUrl={heroImageUrl} />
}
