import type { Metadata } from 'next'
import React from 'react'

import { HomePageView } from '@/components/home/HomePageView'
import { getHomepageData, type ServiceLocationCity } from '@/lib/homepage-data'
import type { HomepageSetting, Product, Testimonial } from '@/payload-types'

import '@/styles/homepage.css'

/** Fresh storefront data after CMS saves (pairs with `revalidateTag(..., { expire: 0 })` on globals). */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Punyakoti Taila — Wood-Pressed Oils from Karnataka',
  description:
    'Premium cold-pressed oils. Pressed on wooden ghanis, bottled within 72 hours, shipped to your kitchen.',
  openGraph: {
    title: 'Punyakoti Taila — Wood-Pressed Oils',
    description: 'Single-origin. Wooden-press. Bottled within 72 hours.',
    type: 'website',
  },
}

export default async function HomePage() {
  let homepage: Partial<HomepageSetting> | null = null
  let featuredProducts: Product[] = []
  let bestSellers: Product[] = []
  let bottleRowProducts: Product[] = []
  let testimonials: Testimonial[] = []
  let serviceLocations: ServiceLocationCity[] = []

  try {
    const data = await getHomepageData()
    homepage = data.homepage
    featuredProducts = data.featuredProducts
    bestSellers = data.bestSellers
    bottleRowProducts = data.bottleRowProducts
    testimonials = data.testimonials
    serviceLocations = data.serviceLocations
  } catch (err) {
    console.error('[HomePage] getHomepageData failed:', err)
  }

  return (
    <HomePageView
      homepage={homepage}
      featuredProducts={featuredProducts}
      bestSellers={bestSellers}
      bottleRowProducts={bottleRowProducts}
      testimonials={testimonials}
      serviceLocations={serviceLocations}
    />
  )
}
