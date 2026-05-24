import type { Metadata } from 'next'
import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { OilVariant } from '@/components/ui/pt/Bottle'
import { Icons } from '@/components/ui/pt/Icons'
import { PDPActions } from '@/components/shop/PDPActions'
import { ProductGallery } from '@/components/shop/ProductGallery'
import type { Media, Product } from '@/payload-types'
import { getStorefrontBundle } from '@/utilities/getStorefrontBundle'
import { labelForVariantSize } from '@/utilities/variantSizeLabel'

interface PDPProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 2,
    limit: 1,
  })
  return (docs[0] as Product) ?? null
}

export async function generateMetadata({ params }: PDPProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.meta?.title ?? product.name,
    description: product.meta?.description ?? product.tagline ?? product.description ?? '',
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    select: { slug: true },
    limit: 100,
    depth: 0,
  })
  return docs.map((p) => ({ slug: p.slug }))
}

function BenefitIcon({ icon, size = 16 }: { icon?: string | null; size?: number }) {
  switch (icon) {
    case 'drop':   return <Icons.drop size={size} />
    case 'leaf':   return <Icons.leaf size={size} />
    case 'shield': return <Icons.shield size={size} />
    case 'star':   return <Icons.star size={size} />
    case 'heart':  return <Icons.heart size={size} />
    default:       return <Icons.leaf size={size} />
  }
}

export default async function ProductPage({ params }: PDPProps) {
  const { slug } = await params
  const { storefront } = await getStorefrontBundle()
  const pdp = storefront.pdp
  const product = await getProduct(slug)

  if (!product) notFound()

  const oilVariant = (product.oilVariant as OilVariant | null) ?? 'sesame'
  const sizeRows = storefront.pdp?.variantSizeLabels

  const variantsSorted = [...(product.variants ?? [])].sort((a, b) => {
    if (a.isDefault === b.isDefault) return 0
    return a.isDefault ? -1 : 1
  })
  const defaultVariant = variantsSorted[0] ?? product.variants?.[0]

  const gallerySlides = (product.images ?? [])
    .map((row) => {
      const img = row.image
      if (typeof img !== 'object' || !img || !('url' in img) || !img.url) return null
      const m = img as Media
      const src = m.url
      if (!src) return null
      return {
        src,
        alt: (row.alt && row.alt.trim()) || m.alt || product.name,
        width: m.width,
        height: m.height,
      }
    })
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  // Build sizes array for PDPActions (default variant first)
  const sizes = variantsSorted.map((v) => ({
    label: labelForVariantSize(v.size, sizeRows),
    price: v.price,
    sku: v.sku,
    subscribePrice: v.subscribePrice ?? undefined,
    mrp: v.mrp ?? undefined,
  }))

  const starCount = Math.min(
    5,
    Math.max(
      1,
      typeof product.ratingStars === 'number'
        ? product.ratingStars
        : typeof pdp?.starsCount === 'number'
          ? pdp.starsCount
          : 5,
    ),
  )

  const ratingLine = product.ratingDisplay?.trim() || pdp?.ratingDisplay || '4.9'
  const reviewsLine = product.reviewsDisplay?.trim() || pdp?.reviewsDisplay || '612 reviews'

  // Batch data
  const batch = product.batch
  const pressDate = batch?.pressDate
    ? new Date(batch.pressDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : undefined

  return (
    <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-12">
      <div className="grid md:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20">
        {/* ── GALLERY ─────────────────────────────────────────────────────── */}
        <ProductGallery slides={gallerySlides} oilVariant={oilVariant} />

        {/* ── INFO PANEL ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* header */}
          <div>
            {product.tag && (
              <span
                className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
                style={{ background: 'var(--mustard-100)', color: 'var(--mustard-700)' }}
              >
                {product.tag}
              </span>
            )}
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.05, color: 'var(--green-900)', margin: 0 }}>
              {product.name}
            </h1>
            {product.tagline && (
              <p className="mt-2 text-base" style={{ color: 'var(--ink-500)' }}>{product.tagline}</p>
            )}
            {product.region && (
              <div className="mt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--wood-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {product.region}
              </div>
            )}
          </div>

          {/* ratings */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <Icons.star
                  key={i}
                  size={14}
                  fill={i <= starCount ? 'var(--mustard-500)' : 'none'}
                  style={{ color: 'var(--mustard-500)', opacity: i <= starCount ? 1 : 0.28 }}
                />
              ))}
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--green-900)' }}>{ratingLine}</span>
            <span className="text-sm" style={{ color: 'var(--ink-400)' }}>· {reviewsLine}</span>
          </div>

          <hr style={{ borderColor: 'var(--cream-400)', margin: 0 }} />

          {/* interactive actions (client component) */}
          <PDPActions product={{
            id: String(product.id),
            slug,
            name: product.name,
            v: oilVariant,
            sizes: sizes.map(s => ({
              label: s.label,
              price: s.price,
              sku: s.sku,
            })),
            price: defaultVariant?.price ?? 0,
            mrp: defaultVariant?.mrp ?? undefined,
            subscribePrice: defaultVariant?.subscribePrice ?? undefined,
          }} />

          {/* batch card */}
          {batch && (
            <div className="rounded-xl p-5" style={{ background: 'var(--green-950)', color: 'var(--cream-100)' }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mustard-400)' }}>
                  {pdp?.batchBadge ?? 'Current batch'}
                </span>
                {batch.batchNumber && (
                  <span className="text-xs" style={{ color: 'var(--ink-300)' }}>#{batch.batchNumber}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: pdp?.labelPressDate ?? 'Press date', value: pressDate },
                  { label: pdp?.labelTemperature ?? 'Temperature', value: batch.pressTemperature },
                  { label: pdp?.labelYield ?? 'Yield', value: batch.yield },
                  { label: pdp?.labelOrigin ?? 'Origin', value: batch.farmLocation },
                ].filter(row => row.value).map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ color: 'var(--ink-400)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                    <div style={{ color: 'var(--cream-200)', fontWeight: 500, marginTop: 2 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* shipping */}
          {pdp?.shippingBullets && pdp.shippingBullets.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {pdp.shippingBullets.map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--ink-500)' }}>
                  <span className="mt-0.5 shrink-0" style={{ color: 'var(--green-700)' }}>
                    {icon === 'truck' && <Icons.truck size={15} />}
                    {icon === 'package' && <Icons.package size={15} />}
                    {icon === 'shield' && <Icons.shield size={15} />}
                    {icon === 'leaf' && <Icons.leaf size={15} />}
                    {icon === 'star' && <Icons.star size={15} />}
                    {icon === 'drop' && <Icons.drop size={15} />}
                  </span>
                  {text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── DESCRIPTION ─────────────────────────────────────────────────────── */}
      {(product.description || product.usageNote) && (
        <section className="mt-20 max-w-3xl">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 32, color: 'var(--green-900)', marginBottom: 16 }}>
            {pdp?.aboutHeading ?? 'About this oil'}
          </h2>
          {product.description && (
            <p className="text-base leading-relaxed" style={{ color: 'var(--ink-700)' }}>{product.description}</p>
          )}
          {product.usageNote && (
            <div className="mt-5 p-5 rounded-xl" style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Icons.drop size={14} style={{ color: 'var(--mustard-600)' }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--mustard-600)' }}>{pdp?.howToUseHeading ?? 'How to use'}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-600)' }}>{product.usageNote}</p>
            </div>
          )}
        </section>
      )}

      {/* ── BENEFITS ────────────────────────────────────────────────────────── */}
      {product.benefits && product.benefits.length > 0 && (
        <section className="mt-16">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 32, color: 'var(--green-900)', marginBottom: 12 }}>
            {pdp?.benefitsHeading ?? "Why it's good for you"}
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {product.benefits.map(({ icon, title, description: body }) => (
              <div key={title} className="p-5 rounded-2xl" style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}>
                <div className="w-9 h-9 rounded-full grid place-items-center mb-4" style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}>
                  <BenefitIcon icon={icon} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--green-900)', margin: '0 0 8px' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-500)' }}>{body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
