import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { Icons } from '@/components/ui/pt/Icons'
import { Bottle } from '@/components/ui/pt/Bottle'
import type { OilVariant } from '@/components/ui/pt/Bottle'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { NewsletterForm } from '@/components/shop/NewsletterForm'
import type { Product, Testimonial } from '@/payload-types'

// ── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Punyakoti Taila — Wood-Pressed Oils from Karnataka',
  description:
    'Premium cold-pressed oils from Raibag, Karnataka. Pressed on wooden ghanis, bottled within 72 hours, shipped to your kitchen.',
}

// ── Data fetching (cached) ────────────────────────────────────────────────────
const getHomepageData = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const [homepage, testimonials] = await Promise.all([
      payload.findGlobal({ slug: 'homepage-settings', depth: 2 }),
      payload.find({
        collection: 'testimonials',
        where: {
          and: [
            { status: { equals: 'approved' } },
            { featuredOnHome: { equals: true } },
          ],
        },
        limit: 3,
        sort: '-createdAt',
        depth: 0,
      }),
    ])

    return { homepage, testimonials: testimonials.docs }
  },
  ['homepage-data'],
  { tags: ['global_homepage-settings'], revalidate: 3600 },
)

// ── Icon helper ───────────────────────────────────────────────────────────────
function TrustIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'leaf':   return <Icons.leaf size={18} />
    case 'drop':   return <Icons.drop size={18} />
    case 'truck':  return <Icons.truck size={18} />
    case 'shield': return <Icons.shield size={18} />
    case 'star':   return <Icons.star size={18} />
    case 'check':  return <Icons.check size={18} />
    default:       return <Icons.leaf size={18} />
  }
}

function BenefitIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  switch (icon) {
    case 'drop':   return <Icons.drop size={size} />
    case 'leaf':   return <Icons.leaf size={size} />
    case 'shield': return <Icons.shield size={size} />
    case 'star':   return <Icons.star size={size} />
    default:       return <Icons.leaf size={size} />
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const { homepage, testimonials } = await getHomepageData()

  const hero        = homepage.hero
  const trustStrip  = homepage.trustStrip ?? []
  const featured    = homepage.featuredSection
  const process     = homepage.processSection
  const whySection  = homepage.whyColdPressed
  const newsletter  = homepage.newsletter
  const faqItems    = homepage.faq ?? []

  // Resolve featured products (populated at depth:2)
  const featuredProducts = (featured?.products ?? []) as Product[]

  // Helper to split headline italic
  function renderHeadlineItalic(full: string, italic: string, color: string) {
    if (!italic || !full.includes(italic)) return <>{full}</>
    const before = full.slice(0, full.indexOf(italic))
    return (
      <>
        {before}
        <em style={{ color, fontStyle: 'italic' }}>{italic}</em>
      </>
    )
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative grid md:grid-cols-[1.1fr_0.9fr] gap-12 px-8 md:px-20 pt-20 md:pt-28 pb-20">
        <div className="flex flex-col justify-center relative z-10">
          <div
            className="flex items-center gap-2.5 mb-7"
            style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mustard-600)' }}
          >
            <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--mustard-500)' }} />
            {hero?.eyebrow ?? 'Est. from a village press'}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.025em',
              color: 'var(--green-900)',
              margin: 0,
            }}
          >
            {hero?.headlineLine1 ?? 'Pressed slowly,'}<br />
            {renderHeadlineItalic(
              hero?.headlineLine2 ?? 'on wood.',
              hero?.headlineItalicWord ?? 'wood.',
              'var(--mustard-600)',
            )}
          </h1>

          <p className="mt-8 text-lg leading-relaxed max-w-[480px]" style={{ color: 'var(--ink-700)' }}>
            {hero?.body ?? "The way your grandmother's kitchen smelled."}
          </p>

          <div className="flex flex-wrap gap-3.5 mt-9">
            <Link
              href={hero?.primaryCTA?.href ?? '/shop'}
              className="inline-flex items-center justify-center gap-2 font-medium text-sm rounded-xl transition-colors hover:opacity-90"
              style={{ background: 'var(--green-800)', color: 'var(--cream-100)', padding: '16px 28px', minHeight: 52 }}
            >
              {hero?.primaryCTA?.label ?? 'Shop the collection'}
            </Link>
            <Link
              href={hero?.secondaryCTA?.href ?? '/about'}
              className="inline-flex items-center justify-center gap-2 font-medium text-sm rounded-xl border transition-colors hover:bg-cream-300"
              style={{ background: 'transparent', color: 'var(--green-900)', borderColor: 'var(--wood-300)', padding: '16px 28px', minHeight: 52 }}
            >
              {hero?.secondaryCTA?.label ?? 'Read our story'} <Icons.arrowRight size={16} />
            </Link>
          </div>

          <div className="flex items-center gap-5 mt-14">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Icons.star key={i} size={14} fill="var(--mustard-500)" style={{ color: 'var(--mustard-500)' }} />
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--ink-500)' }}>
              <strong style={{ color: 'var(--green-900)' }}>{hero?.reviewRating ?? '4.9 / 5'}</strong>
              {' · '}{hero?.reviewCount ?? '2,847 verified kitchens'}
            </p>
          </div>
        </div>

        {/* Bottle visual */}
        <div className="relative hidden md:flex items-center justify-center">
          <div
            className="relative w-full rounded-3xl overflow-hidden"
            style={{
              aspectRatio: '4/5',
              background: 'linear-gradient(135deg, #244023 0%, #0F1A0E 70%, #2B1C0F 100%)',
              boxShadow: 'var(--sh-xl)',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div style={{ filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.5))' }}>
                <Bottle variant="sesame" size={260} />
              </div>
            </div>
            <div
              className="absolute bottom-7 left-7 right-7 flex justify-between"
              style={{ color: 'var(--cream-100)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}
            >
              <span>{hero?.featuredBatch ?? 'Batch #047'}</span>
              <span style={{ color: 'var(--mustard-200)' }}>{hero?.featuredYear ?? 'Raibag · 2025'}</span>
            </div>
          </div>

          {/* floating proof card */}
          <div
            className="absolute -left-8 bottom-16 rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'var(--cream-100)', boxShadow: 'var(--sh-md)', maxWidth: 220 }}
          >
            <div className="w-10 h-10 rounded-full grid place-items-center shrink-0" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}>
              <Icons.leaf size={18} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--ink-500)' }}>
                Press of the week
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--green-900)' }}>
                {hero?.pressOfWeekName ?? 'Sesame · Erode'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--cream-400)', borderBottom: '1px solid var(--cream-400)' }}>
        <div className="max-w-[1240px] mx-auto px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustStrip.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full grid place-items-center shrink-0" style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}>
                <TrustIcon icon={item.icon} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: 'var(--green-900)' }}>{item.label}</div>
                <div className="text-xs" style={{ color: 'var(--ink-400)' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED OILS ────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-8 md:px-20 pt-24 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-10">
          <div className="max-w-2xl">
            <div
              className="flex items-center gap-2.5 mb-4"
              style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mustard-600)' }}
            >
              <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--mustard-500)' }} />
              {featured?.eyebrow ?? 'The collection'}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.02, letterSpacing: '-0.02em', color: 'var(--green-900)', margin: 0 }}>
              {featured?.headline ?? 'Six oils, one philosophy'}
            </h2>
            <p className="mt-4 text-lg" style={{ color: 'var(--ink-500)' }}>
              {featured?.body ?? 'Pressed slowly on wooden ghanis. Bottled within 72 hours. Always single-batch.'}
            </p>
          </div>
          <Link
            href={featured?.ctaHref ?? '/shop'}
            className="shrink-0 inline-flex items-center gap-2 text-sm font-medium pb-1 border-b transition-colors hover:opacity-70"
            style={{ color: 'var(--green-800)', borderColor: 'var(--green-800)' }}
          >
            {featured?.ctaLabel ?? 'Shop all'} <Icons.arrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {featuredProducts.map((p) => {
            const defaultVariant = p.variants?.find((v) => v.isDefault) ?? p.variants?.[0]
            const price = defaultVariant?.price ?? 0
            const size = defaultVariant?.size ?? ''
            const sku = defaultVariant?.sku ?? `${p.slug}-default`
            const variantLabel = size === '250ml' ? '250 ml' : size === '500ml' ? '500 ml' : size === '1L' ? '1 litre' : size
            const oilVariant = (p.oilVariant as OilVariant | null) ?? 'sesame'

            return (
              <div key={p.id} className="group">
                <Link href={`/shop/${p.slug}`}>
                  <div
                    className="rounded-2xl p-5 md:p-7 flex flex-col transition-all duration-[240ms] hover:-translate-y-1"
                    style={{ background: 'var(--cream-100)', boxShadow: 'var(--sh-sm)', position: 'relative' }}
                  >
                    {p.tag && (
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: 'var(--mustard-100)', color: 'var(--mustard-700)' }}>
                          {p.tag}
                        </span>
                      </div>
                    )}

                    <div className="rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--cream-200)', padding: '24px 12px 12px', aspectRatio: '1/1.1' }}>
                      <Bottle variant={oilVariant} size={150} />
                    </div>

                    <div className="mt-1">
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', color: 'var(--wood-600)', textTransform: 'uppercase' }}>
                        {p.region}
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 22, color: 'var(--green-900)', marginTop: 4 }}>
                        {p.name}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 gap-3">
                      <div>
                        <span className="font-semibold" style={{ fontSize: 18, color: 'var(--green-900)' }}>₹{price}</span>
                        <span className="text-xs ml-2" style={{ color: 'var(--ink-500)' }}>· {variantLabel}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="mt-2">
                  <AddToCartButton
                    productId={String(p.id)}
                    slug={p.slug}
                    name={p.name}
                    variantSize={variantLabel}
                    sku={sku}
                    price={price}
                    className="w-full"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── PROCESS / STORY ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-8 md:px-20 py-24 md:py-32"
        style={{ background: 'var(--green-950)', color: 'var(--cream-100)' }}
      >
        <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
          <div>
            <div
              className="flex items-center gap-2.5 mb-6"
              style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mustard-400)' }}
            >
              <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--mustard-500)' }} />
              {process?.eyebrow ?? 'How we press'}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--cream-100)', margin: 0 }}>
              {process?.headlineLine1 ?? 'The ghani has turned'}<br />
              <em style={{ color: 'var(--mustard-400)', fontStyle: 'italic' }}>
                {process?.headlineLine2 ?? 'for a thousand years.'}
              </em>
            </h2>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: 'var(--ink-300)' }}>
              {process?.body}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              {(process?.stats ?? []).map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: 'var(--mustard-400)', lineHeight: 1 }}>{value}</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--ink-400)' }}>{label}</div>
                </div>
              ))}
            </div>

            <Link
              href={process?.ctaHref ?? '/about'}
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium pb-1 border-b transition-opacity hover:opacity-70"
              style={{ color: 'var(--cream-200)', borderColor: 'rgba(245,239,224,0.3)' }}
            >
              {process?.ctaLabel ?? 'Read our story'} <Icons.arrowRight size={14} />
            </Link>
          </div>

          <div className="hidden md:block relative">
            <div
              className="rounded-3xl overflow-hidden grid place-items-center"
              style={{ background: 'linear-gradient(135deg, #8B6238 0%, #4A331C 60%, #2B1C0F 100%)', aspectRatio: '4/5' }}
            >
              <Image
                src="/assets/illustration-ghani.svg"
                alt="Wood ghani press illustration"
                width={300}
                height={400}
                className="opacity-60 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY COLD-PRESSED ────────────────────────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-8 md:px-20 py-24">
        <div className="text-center mb-14">
          <div
            className="flex items-center justify-center gap-2.5 mb-4"
            style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mustard-600)' }}
          >
            <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--mustard-500)' }} />
            {whySection?.eyebrow ?? 'Why it matters'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--green-900)' }}>
            {renderHeadlineItalic(
              whySection?.headline ?? 'Cold-pressed vs. refined — the difference you taste',
              whySection?.headlineItalic ?? 'the difference you taste',
              'var(--mustard-700)',
            )}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(whySection?.cards ?? []).map(({ icon, title, body }) => (
            <div key={title} className="rounded-2xl p-7" style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}>
              <div className="w-10 h-10 rounded-full grid place-items-center mb-5" style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}>
                <BenefitIcon icon={icon} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--green-900)', margin: '0 0 12px' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-500)' }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-20 py-20" style={{ background: 'var(--cream-300)' }}>
        <div className="max-w-[1240px] mx-auto">
          <div
            className="flex items-center gap-2.5 mb-10"
            style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mustard-600)' }}
          >
            <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--mustard-500)' }} />
            What kitchens say
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {(testimonials as Testimonial[]).map((t) => (
              <div key={t.id} className="rounded-2xl p-6" style={{ background: 'var(--cream-100)', boxShadow: 'var(--sh-sm)' }}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                    <Icons.star key={i} size={14} fill="var(--mustard-500)" style={{ color: 'var(--mustard-500)' }} />
                  ))}
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--green-900)', margin: '0 0 10px', lineHeight: 1.2 }}>
                  &ldquo;{t.title}&rdquo;
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-500)' }}>{t.body}</p>
                <div className="mt-4 pt-4 flex items-center gap-3" style={{ borderTop: '1px solid var(--cream-400)' }}>
                  <div className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold shrink-0" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}>
                    {t.customerName?.[0] ?? '?'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--ink-900)' }}>{t.customerName}</div>
                    <div className="text-xs" style={{ color: 'var(--ink-400)' }}>{t.customerLocation}</div>
                  </div>
                  {t.verifiedPurchase && (
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-20 py-20" style={{ background: 'var(--green-900)' }}>
        <div className="max-w-[640px] mx-auto text-center">
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--cream-100)', margin: '0 0 12px', lineHeight: 1.05 }}>
            {newsletter?.headline ?? 'The pressing calendar'}
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--ink-300)' }}>
            {newsletter?.body}
          </p>
          <NewsletterForm />
          <p className="mt-4 text-xs" style={{ color: 'var(--ink-400)' }}>
            {newsletter?.legalText ?? 'One email per batch. No spam. Unsubscribe anytime.'}
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-[760px] mx-auto px-8 py-20">
        <h2
          className="text-center mb-10"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: 'var(--green-900)' }}
        >
          Common questions
        </h2>
        <div className="flex flex-col gap-4">
          {faqItems.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-xl p-5 cursor-pointer"
              style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}
            >
              <summary className="list-none flex items-center justify-between font-medium text-sm" style={{ color: 'var(--green-900)' }}>
                {question}
                <Icons.chevDown size={16} className="shrink-0 ml-4" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--ink-500)' }}>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
