import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { Media } from '@/payload-types'
import { Icons } from '@/components/ui/pt/Icons'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getStorefrontBundle } from '@/utilities/getStorefrontBundle'

export async function generateMetadata(): Promise<Metadata> {
  const { storefront } = await getStorefrontBundle()
  return { title: storefront.orderSuccess?.metaTitle ?? 'Order confirmed' }
}

function mediaSrc(m: unknown): string | null {
  if (m && typeof m === 'object' && 'url' in m && typeof (m as Media).url === 'string') {
    return getMediaUrl((m as Media).url)
  }
  return null
}

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; name?: string }>
}) {
  const { id, name: nameParam } = await searchParams
  const name = nameParam ? decodeURIComponent(nameParam).trim() : ''
  const { storefront } = await getStorefrontBundle()
  const o = storefront.orderSuccess
  const steps = o?.timelineSteps?.filter((s) => s.label) ?? []

  const wordmarkSrc = mediaSrc(o?.headerWordmark) ?? '/logo-wordmark.svg'
  const celebrationSrc = mediaSrc(o?.celebrationImage)

  const hasExplicitActive = steps.some((s) => s.active)
  const activeIndex = hasExplicitActive
    ? Math.max(0, steps.findIndex((s) => s.active))
    : (() => {
        const i = steps.findIndex((s) => !s.done)
        return i === -1 ? Math.max(0, steps.length - 1) : i
      })()

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream-200)' }}>
      {/* Top bar — payment-order.jsx OrderSuccess */}
      <header
        className="flex items-center justify-between px-5 sm:px-10 md:px-20 py-5 border-b"
        style={{ borderColor: 'var(--cream-400)' }}
      >
        <Link href="/" className="inline-block">
          <Image
            src={wordmarkSrc}
            alt=""
            width={168}
            height={28}
            className="h-6 w-auto object-contain object-left"
          />
        </Link>
        <span className="text-xs shrink-0" style={{ color: 'var(--ink-500)' }}>
          {o?.headerAsideLabel}
        </span>
      </header>

      <section className="pt-page-container py-12 md:py-16 lg:py-20 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <div
            className="w-14 h-14 rounded-full grid place-items-center"
            style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}
          >
            <Icons.check size={26} />
          </div>

          {id ? (
            <div className="mt-6 text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--ink-500)' }}>
              {interpolate(o?.orderRefEyebrowTemplate ?? 'Order #{id}', { id })}
            </div>
          ) : null}

          <h1
            className="mt-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              color: 'var(--green-900)',
            }}
          >
            {name && o?.thankYouLinePrefix ? (
              <>
                {o.thankYouLinePrefix}{' '}
                <span className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>
                  {name}
                  {o?.thankYouNameSuffix ?? '.'}
                </span>
              </>
            ) : (
              o?.thankYouHeadline
            )}
          </h1>

          {o?.thankYouBody ? (
            <p className="mt-6 text-base md:text-lg max-w-xl leading-relaxed" style={{ color: 'var(--ink-700)' }}>
              {o.thankYouBody}
            </p>
          ) : null}

          {id && !name ? (
            <p className="mt-2 text-sm font-mono" style={{ color: 'var(--ink-400)' }}>
              {o?.orderRefPrefix} {id}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            {o?.trackOrderLabel ? (
              <Link
                href={o?.trackOrderHref ?? '/account'}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-95"
                style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
              >
                {o.trackOrderLabel}
              </Link>
            ) : null}
            {o?.downloadInvoiceLabel?.trim() ? (
              <Link
                href={o?.downloadInvoiceHref ?? '#'}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold border transition-opacity hover:opacity-90"
                style={{ borderColor: 'var(--wood-300)', color: 'var(--green-900)' }}
              >
                {o.downloadInvoiceLabel}
              </Link>
            ) : null}
          </div>

          {o?.confirmationNote ? (
            <p className="mt-6 text-sm max-w-lg" style={{ color: 'var(--ink-500)' }}>
              {o.confirmationNote}
            </p>
          ) : null}
        </div>

        <div className="relative w-full max-w-md mx-auto lg:max-w-none">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl grid place-items-center"
            style={{ background: 'var(--cream-100)', border: '1px solid var(--cream-400)' }}
          >
            {celebrationSrc ? (
              <Image src={celebrationSrc} alt="" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 90vw" />
            ) : (
              <Icons.drop size={64} style={{ color: 'var(--wood-400)' }} />
            )}
            {(o?.heroImageCaptionLeft || o?.heroImageCaptionRight) && (
              <div
                className="absolute bottom-5 left-5 right-5 flex justify-between gap-4 text-[10px] uppercase tracking-[0.18em]"
                style={{ color: celebrationSrc ? 'var(--cream-100)' : 'var(--ink-500)' }}
              >
                <span>{o?.heroImageCaptionLeft}</span>
                <span style={{ color: celebrationSrc ? 'var(--mustard-200)' : 'var(--mustard-700)' }}>
                  {o?.heroImageCaptionRight}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Horizontal timeline */}
      {steps.length > 0 ? (
        <section className="pt-page-container pb-16 md:pb-20">
          <div className="text-[11px] uppercase tracking-[0.18em] mb-8" style={{ color: 'var(--ink-500)' }}>
            {o?.nextStepsTitle}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((s, i) => {
              const isActive = hasExplicitActive ? Boolean(s.active) : i === activeIndex
              return (
                <div key={`${s.label}-${i}`} className="relative">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full shrink-0 grid place-items-center border-[3px] mt-0.5"
                      style={{
                        background: s.done
                          ? 'var(--green-800)'
                          : isActive
                            ? 'var(--mustard-500)'
                            : 'var(--cream-300)',
                        borderColor: 'var(--cream-200)',
                        color: 'var(--cream-100)',
                      }}
                    >
                      {s.done ? <Icons.check size={12} /> : isActive ? <span className="w-2 h-2 rounded-full bg-[var(--green-900)]" /> : null}
                    </div>
                    <div className="min-w-0">
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--green-900)' }}>
                        {s.label}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--ink-500)' }}>{s.sub}</div>
                      {s.stamp ? (
                        <div className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: 'var(--ink-400)' }}>
                          {s.stamp}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ) : null}

      <section className="pt-page-container pb-20">
        <div
          className="rounded-2xl p-6 md:p-8 max-w-xl mx-auto text-center md:text-left"
          style={{ background: 'var(--mustard-100)', border: '1px solid var(--mustard-200)' }}
        >
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--mustard-800)' }}>{o?.upsellTitle}</div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--wood-700)' }}>{o?.upsellBody}</p>
          <Link
            href={o?.upsellCtaHref ?? '/shop'}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-95"
            style={{ background: 'var(--mustard-500)', color: 'var(--green-950)' }}
          >
            {o?.upsellCtaLabel}
          </Link>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl text-sm font-medium border text-center transition-opacity hover:opacity-90"
            style={{ borderColor: 'var(--wood-300)', color: 'var(--green-900)' }}
          >
            {o?.continueShoppingLabel}
          </Link>
          <Link
            href="/account"
            className="px-6 py-3 rounded-xl text-sm font-medium text-center transition-opacity hover:opacity-95"
            style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
          >
            {o?.viewOrdersLabel}
          </Link>
        </div>
      </section>
    </div>
  )
}
