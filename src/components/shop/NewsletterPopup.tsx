'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import { Bottle, type OilVariant } from '@/components/ui/pt/Bottle'
import { Icons } from '@/components/ui/pt/Icons'

/* Local type — mirrors the `newsletter-popup` global. Kept loose so the
   component works before `pnpm cms:sync` regenerates payload-types. */
export type NewsletterPopupData = {
  enabled?: boolean | null
  delaySeconds?: number | null
  snoozeDays?: number | null
  panel?: {
    kickerLine?: string | null
    title?: string | null
    titleItalic?: string | null
    image?: { url?: string | null; imagekitUrl?: string | null; alt?: string | null } | number | null
    bottleVariant?: string | null
    footerLeft?: string | null
    footerRight?: string | null
  } | null
  content?: {
    eyebrow?: string | null
    headlinePre?: string | null
    headlineItalic?: string | null
    headlinePost?: string | null
    body?: string | null
    bullets?: Array<{ icon?: string | null; text?: string | null }> | null
    emailLabel?: string | null
    emailPlaceholder?: string | null
    ctaLabel?: string | null
    privacyPrefix?: string | null
    privacyLinkLabel?: string | null
    privacyHref?: string | null
    privacySuffix?: string | null
    dismissLabel?: string | null
    successTitle?: string | null
    successBody?: string | null
  } | null
} | null

const STORAGE_DONE = 'pt-news-subscribed'
const STORAGE_SNOOZE = 'pt-news-snooze-until'

function BulletIcon({ icon }: { icon?: string | null }) {
  const size = 14
  switch (icon) {
    case 'mail': return <Icons.mail size={size} />
    case 'shield': return <Icons.shield size={size} />
    case 'check': return <Icons.check size={size} />
    case 'drop': return <Icons.drop size={size} />
    case 'star': return <Icons.star size={size} />
    default: return <Icons.leaf size={size} />
  }
}

function renderTitle(title: string, italic?: string | null) {
  if (!italic || !title.includes(italic)) return title
  const idx = title.indexOf(italic)
  return (
    <>
      {title.slice(0, idx)}
      <em className="pt-display-italic" style={{ color: 'var(--mustard-400)' }}>{italic}</em>
      {title.slice(idx + italic.length)}
    </>
  )
}

export function NewsletterPopup({ data }: { data: NewsletterPopupData }) {
  const enabled = data?.enabled !== false
  const delayMs = Math.max(0, data?.delaySeconds ?? 6) * 1000
  const snoozeDays = Math.max(0, data?.snoozeDays ?? 7)

  const p = data?.panel ?? {}
  const c = data?.content ?? {}

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  const dismiss = React.useCallback(() => {
    setOpen(false)
    try {
      localStorage.setItem(STORAGE_SNOOZE, String(Date.now() + snoozeDays * 86400000))
    } catch { /* ignore */ }
  }, [snoozeDays])

  /* Show after delay unless subscribed or snoozed. */
  useEffect(() => {
    if (!enabled) return
    try {
      if (localStorage.getItem(STORAGE_DONE)) return
      const snoozedUntil = Number(localStorage.getItem(STORAGE_SNOOZE) ?? 0)
      if (snoozedUntil > Date.now()) return
    } catch {
      /* private mode — just show */
    }
    const t = setTimeout(() => setOpen(true), delayMs)
    return () => clearTimeout(t)
  }, [enabled, delayMs])

  /* Escape + scroll lock + autofocus while open. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusT = setTimeout(() => inputRef.current?.focus(), 350)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      clearTimeout(focusT)
    }
  }, [open, dismiss])

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('subscribe failed')
      setStatus('done')
      try {
        localStorage.setItem(STORAGE_DONE, '1')
      } catch { /* ignore */ }
    } catch {
      setStatus('error')
    }
  }

  if (!enabled || !open) return null

  const img = typeof p.image === 'object' && p.image ? p.image : null
  const imgSrc = img?.imagekitUrl || img?.url || null
  const successBody = (c.successBody ?? 'Your code is on its way to {email}.').replace('{email}', email)

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Newsletter signup"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(15,26,14,0.55)', backdropFilter: 'blur(6px)' }}
        onClick={dismiss}
        aria-hidden
      />

      {/* modal */}
      <div
        className="relative grid w-full max-w-[860px] overflow-hidden rounded-3xl md:grid-cols-[0.85fr_1fr]"
        style={{ background: 'var(--cream-100)', boxShadow: 'var(--sh-xl)' }}
      >
        {/* close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-cream-300"
          style={{ background: 'var(--cream-100)', color: 'var(--green-900)', boxShadow: 'var(--sh-sm)' }}
        >
          <Icons.close size={15} />
        </button>

        {/* ── left panel ── */}
        <div
          className="relative hidden md:flex flex-col justify-between p-7"
          style={{ background: 'linear-gradient(160deg, #5C3D1E 0%, #3B2512 55%, #241608 100%)', color: 'var(--cream-200)' }}
        >
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--cream-300)', opacity: 0.75, fontFamily: 'var(--font-mono)' }}>
              {p.kickerLine ?? 'Punyakoti Taila'}
            </div>
            <div className="mt-1.5" style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--cream-100)' }}>
              {renderTitle(p.title ?? 'Goodness, bottled.', p.titleItalic ?? 'bottled.')}
            </div>
          </div>

          <div className="grid flex-1 place-items-center py-6">
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={img?.alt ?? ''}
                width={300}
                height={380}
                className="max-h-[340px] w-auto rounded-2xl object-cover"
                style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.45)' }}
              />
            ) : (
              <div style={{ filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.5))' }}>
                <Bottle variant={(p.bottleVariant as OilVariant) ?? 'sesame'} size={230} />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--cream-300)', opacity: 0.75, fontFamily: 'var(--font-mono)' }}>
            <span>{p.footerLeft ?? 'Pure tradition'}</span>
            <span>{p.footerRight ?? 'Pure goodness'}</span>
          </div>
        </div>

        {/* ── right panel ── */}
        <div className="p-7 sm:p-9">
          {status === 'done' ? (
            <div className="flex h-full flex-col items-start justify-center gap-4 py-10">
              <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}>
                <Icons.check size={22} />
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', color: 'var(--green-900)', margin: 0 }}>
                {c.successTitle ?? 'Check your inbox.'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--ink-500)' }}>{successBody}</p>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl px-6 py-3 text-sm font-semibold"
                style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
              >
                Keep shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--mustard-500)' }} />
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--mustard-700)' }}>
                  {c.eyebrow ?? 'Join the family'}
                </span>
              </div>

              <h2 className="mt-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)', lineHeight: 1.1, color: 'var(--green-900)', margin: '16px 0 0' }}>
                {c.headlinePre ?? 'Fifteen'}{' '}
                <em className="pt-display-italic" style={{ color: 'var(--mustard-600)' }}>
                  {c.headlineItalic ?? 'percent off,'}
                </em>
                <br />
                {c.headlinePost ?? 'your first order.'}
              </h2>

              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--ink-500)' }}>
                {c.body ?? 'A short newsletter with member-only offers, new arrivals, and simple recipes — plus a 15% discount code for your first order.'}
              </p>

              <ul className="mt-5 flex list-none flex-col gap-3 p-0">
                {(c.bullets?.length
                  ? c.bullets
                  : [
                      { icon: 'star', text: 'Member-only offers & early access' },
                      { icon: 'mail', text: 'One short email a fortnight — no spam' },
                      { icon: 'shield', text: 'Unsubscribe anytime, in one click' },
                    ]
                ).map((b, i) => (
                  <li key={`${b.text}-${i}`} className="flex items-center gap-3 text-sm" style={{ color: 'var(--ink-700)' }}>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}>
                      <BulletIcon icon={b.icon} />
                    </span>
                    {b.text}
                  </li>
                ))}
              </ul>

              <form onSubmit={subscribe} className="mt-6">
                <label htmlFor="np-email" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink-400)' }}>
                  {c.emailLabel ?? 'Email'}
                </label>
                <div className="flex overflow-hidden rounded-xl border" style={{ borderColor: 'var(--cream-400)', background: 'var(--cream-200)' }}>
                  <input
                    id="np-email"
                    ref={inputRef}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (status === 'error') setStatus('idle')
                    }}
                    placeholder={c.emailPlaceholder ?? 'your@kitchen.in'}
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                    style={{ color: 'var(--ink-900)' }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="m-1 shrink-0 rounded-lg px-5 text-sm font-semibold transition-opacity disabled:opacity-60"
                    style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
                  >
                    {status === 'sending' ? '…' : (c.ctaLabel ?? 'Get my code')}
                  </button>
                </div>
                {status === 'error' && (
                  <p className="mt-2 text-xs" role="status" style={{ color: 'var(--terra-600)' }}>
                    Something went wrong — please try again.
                  </p>
                )}
              </form>

              <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--ink-400)' }}>
                {c.privacyPrefix ?? 'By subscribing you agree to our'}{' '}
                <Link href={c.privacyHref ?? '/privacy'} className="underline underline-offset-2" style={{ color: 'var(--ink-500)' }}>
                  {c.privacyLinkLabel ?? 'privacy policy'}
                </Link>
                . {c.privacySuffix ?? "We won't sell your address."}
              </p>

              <div className="mt-5 text-center">
                <button
                  onClick={dismiss}
                  className="text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--ink-400)' }}
                >
                  {c.dismissLabel ?? 'No thanks, keep shopping'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
