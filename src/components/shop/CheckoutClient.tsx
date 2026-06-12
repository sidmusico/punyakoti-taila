'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'

import { Icons } from '@/components/ui/pt/Icons'
import { useCartHydrated, useCartStore } from '@/store/cart'

/* ────────────────────────────────────────────────────────────────────────────
   Schemas — validated per step so users get feedback exactly where they are.
──────────────────────────────────────────────────────────────────────────── */

const contactSchema = z.object({
  email: z.string().email('Valid email required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile number required'),
})

const shippingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  line1: z.string().min(5, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
})

const fullSchema = contactSchema.merge(shippingSchema)
type CheckoutForm = z.infer<typeof fullSchema>
type FieldName = keyof CheckoutForm

const EMPTY_FORM: CheckoutForm = {
  email: '', phone: '', name: '', line1: '', line2: '', city: '', state: '', pincode: '',
}

/* ────────────────────────────────────────────────────────────────────────────
   Constants
──────────────────────────────────────────────────────────────────────────── */

const STEPS = ['Contact', 'Shipping', 'Delivery', 'Payment'] as const
type StepIndex = 0 | 1 | 2 | 3

type DeliveryMethod = {
  id: string
  label: string
  badge?: string
  /** null = free-shipping logic applies (free over threshold, else flat). */
  price: number | null
  etaDays: [number, number]
  note: (eta: string) => string
}

const DELIVERY_METHODS: DeliveryMethod[] = [
  { id: 'standard', label: 'Standard', price: null, etaDays: [4, 6], note: (eta) => eta },
  { id: 'express', label: 'Express', price: 89, etaDays: [1, 1], note: (eta) => `${eta} · before 6pm` },
  { id: 'carbon-neutral', label: 'Carbon-neutral', badge: 'B Corp', price: 49, etaDays: [3, 3], note: (eta) => `${eta} · cycle-courier in BLR` },
]

/** Demo promo codes — swap for a server lookup when the coupon system lands. */
const PROMO_CODES: Record<string, { pct: number; label: string }> = {
  WELCOME15: { pct: 15, label: 'WELCOME15' },
}

const GST_RATE = 0.05 // display-only: GST included in prices

function formatPrice(n: number) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

function formatEta([from, to]: [number, number]): string {
  const fmt = (offset: number) =>
    new Date(Date.now() + offset * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  if (from === to) return fmt(from)
  return `${fmt(from)} – ${fmt(to)}`
}

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void }
  }
}

/* ────────────────────────────────────────────────────────────────────────────
   Small presentational pieces (top-level so they aren't re-created per render)
──────────────────────────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden className="inline-block h-px w-6" style={{ background: 'var(--mustard-500)' }} />
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--mustard-700)' }}>
        {children}
      </span>
    </div>
  )
}

function Field({
  label, name, value, error, onChange, type = 'text', placeholder, half = false, autoComplete,
}: {
  label: string
  name: FieldName
  value: string
  error?: string
  onChange: (name: FieldName, value: string) => void
  type?: string
  placeholder?: string
  half?: boolean
  autoComplete?: string
}) {
  return (
    <div className={half ? 'col-span-2 sm:col-span-1' : 'col-span-2'}>
      <label htmlFor={`co-${name}`} className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink-400)' }}>
        {label}
      </label>
      <input
        id={`co-${name}`}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all focus:ring-1"
        style={{
          background: 'var(--cream-100)',
          borderColor: error ? 'var(--terra-600)' : 'var(--cream-400)',
          color: 'var(--ink-900)',
        }}
      />
      {error && <p className="mt-1 text-xs" style={{ color: 'var(--terra-600)' }}>{error}</p>}
    </div>
  )
}

/** Compact review row for a completed step (matches the "Change" rows in the design). */
function ReviewRow({ label, value, onChange }: { label: string; value: string; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4" style={{ borderBottom: '1px solid var(--cream-400)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 min-w-0">
        <span className="shrink-0 w-40"><SectionLabel>{label}</SectionLabel></span>
        <span className="text-sm truncate" style={{ color: 'var(--ink-700)' }}>{value}</span>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="shrink-0 text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
        style={{ color: 'var(--green-800)' }}
      >
        Change
      </button>
    </div>
  )
}

function Stepper({ current }: { current: StepIndex }) {
  return (
    <nav aria-label="Checkout progress" className="flex items-center justify-center gap-2 sm:gap-3 mb-10 flex-wrap">
      {STEPS.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <React.Fragment key={step}>
            {i > 0 && <span aria-hidden className="hidden sm:block h-px w-8" style={{ background: 'var(--cream-500, var(--cream-400))' }} />}
            <div className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
              <span
                className="grid h-8 w-8 place-items-center rounded-full text-[11px] font-semibold"
                style={
                  done
                    ? { background: 'var(--green-800)', color: 'var(--cream-100)' }
                    : active
                      ? { background: 'var(--cream-100)', color: 'var(--green-900)', border: '2px solid var(--green-800)' }
                      : { background: 'var(--cream-100)', color: 'var(--ink-400)', border: '1px solid var(--cream-400)' }
                }
              >
                {done ? <Icons.check size={13} /> : `0${i + 1}`}
              </span>
              <span className="text-sm" style={{ color: active || done ? 'var(--green-900)' : 'var(--ink-400)', fontWeight: active ? 600 : 400 }}>
                {step}
              </span>
            </div>
          </React.Fragment>
        )
      })}
    </nav>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Checkout
──────────────────────────────────────────────────────────────────────────── */

export function CheckoutClient() {
  const { items, total, itemCount, clearCart } = useCartStore()
  const cartHydrated = useCartHydrated()
  const subtotal = total()
  const count = itemCount()

  const [step, setStep] = useState<StepIndex>(0)
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [deliveryId, setDeliveryId] = useState<string>('standard')
  const [leaveAtDoor, setLeaveAtDoor] = useState(false)
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState<{ code: string; pct: number } | null>(null)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const setField = (name: FieldName, value: string) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  /* Totals */
  const discount = promo ? (subtotal * promo.pct) / 100 : 0
  const afterDiscount = subtotal - discount
  const delivery = DELIVERY_METHODS.find((m) => m.id === deliveryId) ?? DELIVERY_METHODS[0]!
  const shipping = delivery.price === null ? (afterDiscount >= 999 ? 0 : 99) : delivery.price
  const orderTotal = afterDiscount + shipping
  const gstIncluded = orderTotal - orderTotal / (1 + GST_RATE)

  const validateStep = (target: StepIndex): boolean => {
    const schema = target === 0 ? contactSchema : target === 1 ? shippingSchema : null
    if (!schema) return true
    const result = schema.safeParse(form)
    if (result.success) return true
    const fieldErrors: typeof errors = {}
    result.error.issues.forEach((i) => {
      fieldErrors[i.path[0] as FieldName] = i.message
    })
    setErrors(fieldErrors)
    return false
  }

  const goNext = () => {
    if (!validateStep(step)) return
    setStep((s) => Math.min(3, s + 1) as StepIndex)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goBack = () => setStep((s) => Math.max(0, s - 1) as StepIndex)

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    const hit = PROMO_CODES[code]
    if (hit) {
      setPromo({ code: hit.label, pct: hit.pct })
      setPromoError(null)
    } else {
      setPromo(null)
      setPromoError(`"${code}" isn't a valid code right now.`)
    }
  }

  /* Final payment — Razorpay stub flow (real keys wired later). */
  const handlePay = async () => {
    if (!fullSchema.safeParse(form).success) {
      setStep(0)
      validateStep(0)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          address: form,
          total: orderTotal,
          delivery: { method: delivery.id, leaveAtDoor },
          promo: promo?.code ?? null,
        }),
      })
      const { orderId, amount, currency, key } = await res.json()

      if (!window.Razorpay) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve()
          document.body.appendChild(script)
        })
      }

      const rzp = new window.Razorpay({
        key,
        amount,
        currency,
        order_id: orderId,
        name: 'Punyakoti Taila',
        description: `${count} item(s)`,
        image: '/assets/logo-monogram.svg',
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#244023' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch('/api/razorpay-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, address: form }),
          })
          if (verifyRes.ok) {
            clearCart()
            window.location.href = `/order/success?id=${response.razorpay_order_id}`
          }
        },
      })
      rzp.open()
    } catch (err) {
      console.error(err)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactSummary = useMemo(
    () => [form.email, form.phone && `+91 ${form.phone}`].filter(Boolean).join(' · '),
    [form.email, form.phone],
  )
  const shippingSummary = useMemo(
    () => [form.name, form.line1, form.line2, `${form.city} ${form.pincode}`.trim()].filter(Boolean).join(' · '),
    [form.name, form.line1, form.line2, form.city, form.pincode],
  )

  // Wait for the persisted cart to hydrate — SSR/first client render must match.
  if (!cartHydrated) {
    return <div className="min-h-[60vh]" aria-busy="true" />
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <Icons.bag size={48} style={{ color: 'var(--ink-300)' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--green-900)' }}>
          Your basket is empty
        </h2>
        <p style={{ color: 'var(--ink-500)' }}>Add some oils before checking out.</p>
        <Link
          href="/shop"
          className="mt-2 px-6 py-3 rounded-xl font-medium text-sm"
          style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
        >
          Browse oils
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-page-container py-8">
      <Stepper current={step} />

      <div className="grid lg:grid-cols-[1fr_min(400px,34vw)] gap-10 lg:gap-14 items-start">
        {/* ── LEFT: step content ─────────────────────────────────────── */}
        <div>
          {/* Completed-step review rows */}
          {step > 0 && <ReviewRow label="Contact" value={contactSummary} onChange={() => setStep(0)} />}
          {step > 1 && <ReviewRow label="Shipping address" value={shippingSummary} onChange={() => setStep(1)} />}

          {/* Step 1 — Contact */}
          {step === 0 && (
            <section className="mt-2">
              <SectionLabel>Contact</SectionLabel>
              <h1 className="mt-3 mb-6" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', color: 'var(--green-900)' }}>
                Where can we reach you?
              </h1>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" name="email" type="email" placeholder="priya@example.com" autoComplete="email" half value={form.email} error={errors.email} onChange={setField} />
                <Field label="Phone" name="phone" type="tel" placeholder="9876543210" autoComplete="tel-national" half value={form.phone} error={errors.phone} onChange={setField} />
              </div>
              <p className="mt-3 text-xs" style={{ color: 'var(--ink-400)' }}>
                Order updates land here — no marketing unless you opt in.
              </p>
            </section>
          )}

          {/* Step 2 — Shipping */}
          {step === 1 && (
            <section className="mt-6">
              <SectionLabel>Shipping address</SectionLabel>
              <h1 className="mt-3 mb-6" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', color: 'var(--green-900)' }}>
                Where should the oils go?
              </h1>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full name" name="name" placeholder="Priya Sharma" autoComplete="name" value={form.name} error={errors.name} onChange={setField} />
                <Field label="Address line 1" name="line1" placeholder="House / flat / street" autoComplete="address-line1" value={form.line1} error={errors.line1} onChange={setField} />
                <Field label="Address line 2 (optional)" name="line2" placeholder="Area / landmark" autoComplete="address-line2" value={form.line2 ?? ''} error={errors.line2} onChange={setField} />
                <Field label="City" name="city" placeholder="Bangalore" autoComplete="address-level2" half value={form.city} error={errors.city} onChange={setField} />
                <Field label="State" name="state" placeholder="Karnataka" autoComplete="address-level1" half value={form.state} error={errors.state} onChange={setField} />
                <Field label="Pincode" name="pincode" placeholder="560001" autoComplete="postal-code" half value={form.pincode} error={errors.pincode} onChange={setField} />
              </div>
            </section>
          )}

          {/* Step 3 — Delivery */}
          {step === 2 && (
            <section className="mt-6">
              <SectionLabel>Delivery method</SectionLabel>
              <div className="mt-4 flex flex-col gap-3" role="radiogroup" aria-label="Delivery method">
                {DELIVERY_METHODS.map((m) => {
                  const isOn = deliveryId === m.id
                  const price = m.price === null ? (afterDiscount >= 999 ? 0 : 99) : m.price
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={isOn}
                      onClick={() => setDeliveryId(m.id)}
                      className="flex items-center justify-between gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all"
                      style={
                        isOn
                          ? { borderColor: 'var(--green-800)', background: 'var(--cream-100)' }
                          : { borderColor: 'var(--cream-400)', background: 'var(--cream-100)' }
                      }
                    >
                      <span className="flex items-start gap-3 min-w-0">
                        <span
                          className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2"
                          style={{ borderColor: isOn ? 'var(--green-800)' : 'var(--ink-300)' }}
                          aria-hidden
                        >
                          {isOn && <span className="h-2 w-2 rounded-full" style={{ background: 'var(--green-800)' }} />}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 font-medium" style={{ color: 'var(--green-900)' }}>
                            {m.label}
                            {m.badge && (
                              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}>
                                {m.badge}
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-sm" style={{ color: 'var(--ink-400)' }}>
                            {m.note(formatEta(m.etaDays))}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 font-semibold" style={{ color: 'var(--green-900)' }}>
                        {price === 0 ? 'Free' : formatPrice(price)}
                      </span>
                    </button>
                  )
                })}
              </div>

              <label className="mt-4 flex items-center gap-2.5 text-sm cursor-pointer" style={{ color: 'var(--ink-700)' }}>
                <input
                  type="checkbox"
                  checked={leaveAtDoor}
                  onChange={(e) => setLeaveAtDoor(e.target.checked)}
                  className="h-4 w-4 rounded accent-[var(--green-800)]"
                />
                Leave at the door if I&apos;m not home
              </label>

              {/* payment teaser */}
              <div className="mt-8 flex items-center justify-between rounded-xl border px-5 py-4" style={{ borderColor: 'var(--cream-400)', color: 'var(--ink-400)' }}>
                <div>
                  <SectionLabel>Payment · next</SectionLabel>
                  <p className="mt-1.5 text-sm">UPI · cards · netbanking — secured by Razorpay</p>
                </div>
                <Icons.lock size={16} />
              </div>
            </section>
          )}

          {/* Step 4 — Payment */}
          {step === 3 && (
            <section className="mt-6">
              <SectionLabel>Payment</SectionLabel>
              <h1 className="mt-3 mb-6" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', color: 'var(--green-900)' }}>
                Almost there.
              </h1>
              <div className="rounded-xl border px-5 py-5" style={{ borderColor: 'var(--cream-400)', background: 'var(--cream-100)' }}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}>
                    <Icons.lock size={18} />
                  </span>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--green-900)' }}>Pay securely with Razorpay</p>
                    <p className="text-sm" style={{ color: 'var(--ink-400)' }}>UPI · Cards · Net Banking · Pay Later</p>
                  </div>
                </div>
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
                  style={{ background: 'var(--green-800)', color: 'var(--cream-100)', boxShadow: '0 10px 24px rgba(15, 42, 22, 0.25)' }}
                >
                  {loading ? 'Processing…' : <><Icons.lock size={15} /> Pay {formatPrice(orderTotal)}</>}
                </button>
                <p className="mt-3 text-center text-xs" style={{ color: 'var(--ink-400)' }}>
                  256-bit SSL · You&apos;ll get a confirmation email at {form.email || 'your inbox'}
                </p>
              </div>
            </section>
          )}

          {/* Step nav */}
          <div className="mt-10 flex items-center justify-between gap-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
                style={{ color: 'var(--ink-500)' }}
              >
                <Icons.arrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
                Back to {STEPS[step - 1].toLowerCase()}
              </button>
            ) : (
              <Link href="/cart" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--ink-500)' }}>
                <Icons.arrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
                Back to basket
              </Link>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'var(--green-800)', color: 'var(--cream-100)', boxShadow: '0 10px 24px rgba(15, 42, 22, 0.25)' }}
              >
                Continue to {STEPS[step + 1].toLowerCase()}
                <Icons.arrowRight size={15} />
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT: order summary ──────────────────────────────────────── */}
        <aside
          className="rounded-2xl p-6 lg:p-7 lg:sticky lg:top-24"
          style={{ background: 'var(--cream-100)', boxShadow: 'var(--sh-sm)', border: '1px solid var(--cream-400)' }}
        >
          <SectionLabel>In your order · {count}</SectionLabel>

          <div className="mt-5 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="h-14 w-12 overflow-hidden rounded-lg grid place-items-center" style={{ background: 'var(--cream-200)' }}>
                    {item.image ? (
                      <Image src={item.image} alt="" width={48} height={56} className="h-full w-full object-cover" />
                    ) : (
                      <Icons.drop size={20} style={{ color: 'var(--wood-500)' }} />
                    )}
                  </div>
                  <span
                    className="absolute -top-1.5 -left-1.5 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold"
                    style={{ background: 'var(--wood-600, #7a5230)', color: 'var(--cream-100)' }}
                    aria-hidden
                  >
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" style={{ color: 'var(--ink-900)' }}>{item.name}</p>
                  <p className="text-xs" style={{ color: 'var(--ink-400)' }}>
                    {item.variantSize}
                    {item.isSubscription ? ' · Subscribe' : ''}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold" style={{ color: 'var(--green-900)' }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* promo */}
          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault()
              applyPromo()
            }}
          >
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value)
                  if (promoError) setPromoError(null)
                }}
                placeholder="Promo code"
                aria-label="Promo code"
                className="min-w-0 flex-1 rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{ background: 'var(--cream-200)', borderColor: 'var(--cream-400)', color: 'var(--ink-700)' }}
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-cream-300"
                style={{ borderColor: 'var(--cream-400)', color: 'var(--green-900)' }}
              >
                Apply
              </button>
            </div>
            {promoError && <p className="mt-2 text-xs" role="status" style={{ color: 'var(--terra-600)' }}>{promoError}</p>}
          </form>

          <hr className="my-5" style={{ borderColor: 'var(--cream-400)' }} />

          {/* totals */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between" style={{ color: 'var(--ink-500)' }}>
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            {promo && (
              <div className="flex justify-between" style={{ color: 'var(--green-700)' }}>
                <span className="flex items-center gap-2">
                  {promo.code}
                  <button
                    type="button"
                    onClick={() => setPromo(null)}
                    aria-label={`Remove promo ${promo.code}`}
                    className="grid h-4 w-4 place-items-center rounded-full transition-opacity hover:opacity-70"
                    style={{ background: 'var(--cream-300)', color: 'var(--ink-500)' }}
                  >
                    <Icons.close size={9} />
                  </button>
                </span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between" style={{ color: 'var(--ink-500)' }}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--green-700)' : 'var(--ink-500)' }}>
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-baseline justify-between border-t pt-4" style={{ borderColor: 'var(--cream-400)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--green-900)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--green-900)' }}>{formatPrice(orderTotal)}</span>
          </div>
          <p className="mt-1.5 text-xs" style={{ color: 'var(--ink-400)' }}>
            Includes {formatPrice(gstIncluded)} GST{shipping === 0 ? ' · Free shipping' : ''}
          </p>
        </aside>
      </div>
    </div>
  )
}
