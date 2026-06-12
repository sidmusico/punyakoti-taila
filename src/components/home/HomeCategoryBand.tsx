import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Icons } from '@/components/ui/pt/Icons'
import { PtEyebrow } from '@/components/ui/pt/PtEyebrow'
import { IMAGEKIT_CATALOG } from '@/seed/imagekitCatalog.generated'

type CategoryTile = {
  title: string
  sub: string
  href: string
  imageAlt: string
}

/** Tiles link to the seeded category slugs (see src/seed/productCatalogSeed.ts). */
const TILES: CategoryTile[] = [
  {
    title: 'Cooking oils',
    sub: 'Sesame, coconut, groundnut & more for the everyday kitchen',
    href: '/shop?category=cooking-oils',
    imageAlt: 'groundnut-oil/lifestyle-kitchen',
  },
  {
    title: 'Wellness oils',
    sub: 'Castor, almond — slow-pressed for hair, skin & rituals',
    href: '/shop?category=wellness-oils',
    imageAlt: 'coconut-oil/wellness-spa',
  },
  {
    title: 'Infused & specialty',
    sub: 'Kachi ghani mustard, black sesame & limited presses',
    href: '/shop?category=infused-specialty',
    imageAlt: 'sesame-oil/hero-dark-moody',
  },
]

function imageUrlForAlt(alt: string): string | null {
  return IMAGEKIT_CATALOG.find((e) => e.alt === alt)?.url ?? null
}

export function HomeCategoryBand({
  eyebrow = 'Shop by need',
  headline = 'Find your oil',
}: {
  eyebrow?: string | null
  headline?: string | null
}) {
  return (
    <section className="hp-container py-14 md:py-20">
      <div className="mb-8 md:mb-10">
        <PtEyebrow>{eyebrow}</PtEyebrow>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
            color: 'var(--green-900)',
            margin: '8px 0 0',
          }}
        >
          {headline}
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {TILES.map((tile) => {
          const src = imageUrlForAlt(tile.imageAlt)
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className="group relative block overflow-hidden rounded-2xl"
              style={{ aspectRatio: '4/3', boxShadow: 'var(--sh-sm)', background: 'var(--cream-200)' }}
            >
              {src && (
                <Image
                  src={src}
                  alt={tile.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
              {/* legibility gradient */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(15,26,14,0) 38%, rgba(15,26,14,0.72) 100%)',
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 22,
                        color: 'var(--cream-100)',
                        lineHeight: 1.1,
                      }}
                    >
                      {tile.title}
                    </div>
                    <p
                      className="mt-1 text-[13px] leading-snug"
                      style={{ color: 'var(--cream-300)', maxWidth: '32ch' }}
                    >
                      {tile.sub}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
                    style={{ background: 'var(--cream-100)', color: 'var(--green-900)' }}
                  >
                    <Icons.arrowRight size={15} />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
