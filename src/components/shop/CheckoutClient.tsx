'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'

import { buildRazorpayCheckoutOptions, isRazorpayTestKey, razorpayPrefillContact } from '@/lib/razorpay/checkoutDisplayConfig'
import { Breadcrumb } from '@/components/shop/Breadcrumb'
import {
  clearCheckoutDraft,
  loadCheckoutDraft,
  saveCheckoutDraft,
  type CheckoutDraft,
} from '@/lib/checkout/checkoutDraft'

import { Icons } from '@/components/ui/pt/Icons'
import { useCartHydrated, useCartStore } from '@/store/cart'
import type { Cart, Customer } from '@/payload-types'

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

/* Billing address — same fields as shipping, minus contact. */
type BillingForm = { name: string; line1: string; line2: string; city: string; state: string; pincode: string }
const EMPTY_BILLING: BillingForm = { name: '', line1: '', line2: '', city: '', state: '', pincode: '' }
const billingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  line1: z.string().min(5, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
})

type CustomerAddress = NonNullable<Customer['addresses']>[number]
type CheckoutClientProps = {
  savedAddresses?: CustomerAddress[]
  contact?: { email?: string | null; phone?: string | null }
  copy?: { useSaved?: string; useNew?: string; billingSame?: string }
  /** Delivery methods from the Cart global (Checkout tab); falls back to defaults. */
  deliveryMethods?: CmsDeliveryMethod[] | null
  deliveryMethodLabel?: string | null
  leaveAtDoorLabel?: string | null
  freeShippingThreshold?: number
}

/** Reduce an E.164 / spaced phone to the 10 digits the form expects. */
function digits10(p?: string | null): string {
  return (p ?? '').replace(/\D/g, '').slice(-10)
}

function buildInitialCheckoutState(
  contact: CheckoutClientProps['contact'],
  defaultAddress: CustomerAddress | null,
): Pick<
  CheckoutDraft,
  'form' | 'billing' | 'billingSame' | 'step' | 'deliveryId' | 'leaveAtDoor' | 'promo' | 'selectedAddressId'
> {
  const draft = loadCheckoutDraft()
  const shippingFromAddress = defaultAddress ? addressToShipping(defaultAddress) : {}
  const baseForm: CheckoutForm = {
    ...EMPTY_FORM,
    email: contact?.email ?? '',
    phone: digits10(contact?.phone),
    ...shippingFromAddress,
  }
  const form: CheckoutForm = draft?.form
    ? {
        ...baseForm,
        ...draft.form,
        email: draft.form.email || baseForm.email,
        phone: draft.form.phone || baseForm.phone,
      }
    : baseForm

  return {
    form,
    billing: draft?.billing
      ? {
          ...draft.billing,
          line2: draft.billing.line2 ?? '',
        }
      : EMPTY_BILLING,
    billingSame: draft?.billingSame ?? true,
    step: Math.min(3, Math.max(0, draft?.step ?? 0)) as StepIndex,
    deliveryId: draft?.deliveryId ?? '',
    leaveAtDoor: draft?.leaveAtDoor ?? false,
    promo: draft?.promo ?? null,
    selectedAddressId: draft?.selectedAddressId ?? defaultAddress?.id ?? null,
  }
}

function addressToShipping(a: CustomerAddress): BillingForm {
  return { name: a.fullName, line1: a.line1, line2: a.line2 ?? '', city: a.city, state: a.state, pincode: a.pincode }
}
function addressLabel(a: CustomerAddress): string {
  return [a.label || a.fullName, a.line1, `${a.city} ${a.pincode}`].filter(Boolean).join(' · ')
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
  /** true = free when the order clears the free-shipping threshold, else `fee`. */
  freeOverThreshold: boolean
  /** flat fee, or the below-threshold fee when `freeOverThreshold`. */
  fee: number
  etaDays: [number, number]
  noteSuffix?: string
}

/** CMS-authored delivery method (Cart global → Checkout → Delivery methods). */
type CmsDeliveryMethod = NonNullable<NonNullable<Cart['checkout']>['deliveryMethods']>[number]

/** Fallback used when the CMS has no delivery methods configured yet. */
const DEFAULT_DELIVERY_METHODS: DeliveryMethod[] = [
  { id: 'standard', label: 'Standard', freeOverThreshold: true, fee: 99, etaDays: [4, 6] },
  { id: 'express', label: 'Express', freeOverThreshold: false, fee: 89, etaDays: [1, 1], noteSuffix: 'before 6pm' },
]

function mapCmsMethods(methods?: CmsDeliveryMethod[] | null): DeliveryMethod[] {
  if (!methods || methods.length === 0) return DEFAULT_DELIVERY_METHODS
  return methods.map((m) => ({
    id: m.methodId,
    label: m.label,
    badge: m.badge ?? undefined,
    freeOverThreshold: Boolean(m.freeOverThreshold),
    fee: m.fee ?? 0,
    etaDays: [m.etaMinDays, m.etaMaxDays] as [number, number],
    noteSuffix: m.noteSuffix ?? undefined,
  }))
}

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

type RazorpayError = {
  code?: string
  description?: string
  reason?: string
  source?: string
  step?: string
}

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => {
      open(): void
      on(event: string, handler: (response: { error?: RazorpayError }) => void): void
    }
  }
}

/** Turn a Razorpay checkout failure into an actionable message for the shopper. */
function razorpayErrorMessage(err?: RazorpayError): string {
  const base = err?.description || 'Payment failed. Please try again.'
  const haystack = `${err?.description ?? ''} ${err?.reason ?? ''} ${err?.code ?? ''}`.toLowerCase()
  if (haystack.includes('international')) {
    return `${base} Please use a domestic (India) Visa/Mastercard/RuPay card, UPI, or net banking.`
  }
  return base
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

/** Billing-address input — mirrors Field but bound to the BillingForm keys. */
function BillingField({
  label, name, value, error, onChange, half = false, placeholder,
}: {
  label: string
  name: keyof BillingForm
  value: string
  error?: string
  onChange: (name: keyof BillingForm, value: string) => void
  half?: boolean
  placeholder?: string
}) {
  return (
    <div className={half ? 'col-span-2 sm:col-span-1' : 'col-span-2'}>
      <label htmlFor={`bill-${name}`} className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink-400)' }}>
        {label}
      </label>
      <input
        id={`bill-${name}`}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all focus:ring-1"
        style={{ background: 'var(--cream-100)', borderColor: error ? 'var(--terra-600)' : 'var(--cream-400)', color: 'var(--ink-900)' }}
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
    <nav aria-label="Checkout progress" className="flex items-center justify-center gap-2 sm:gap-3 mb-5 lg:mb-6 flex-wrap">
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

export function CheckoutClient({
  savedAddresses = [],
  contact,
  copy,
  deliveryMethods,
  deliveryMethodLabel,
  leaveAtDoorLabel,
  freeShippingThreshold = 999,
}: CheckoutClientProps = {}) {
  const { items, total, itemCount, clearCart } = useCartStore()
  const cartHydrated = useCartHydrated()
  const subtotal = total()
  const count = itemCount()

  const methods = mapCmsMethods(deliveryMethods)
  const deliverySectionLabel = deliveryMethodLabel || 'Delivery method'
  // Empty label hides the "leave at door" checkbox (undefined prop keeps the default).
  const leaveAtDoorText = leaveAtDoorLabel === undefined ? "Leave at the door if I'm not home" : leaveAtDoorLabel

  const defaultAddress =
    savedAddresses.find((a) => a.isDefaultShipping) ?? savedAddresses[0] ?? null

  const initial = useMemo(
    () => buildInitialCheckoutState(contact, defaultAddress),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once on mount
    [],
  )

  const [step, setStep] = useState<StepIndex>(initial.step as StepIndex)
  const [form, setForm] = useState<CheckoutForm>(initial.form)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(initial.selectedAddressId)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})

  /* Billing — defaults to "same as shipping"; a saved default-billing address
     that differs from shipping starts the section expanded and prefilled. */
  const defaultBilling = savedAddresses.find((a) => a.isDefaultBilling) ?? null
  const billingDiffers = Boolean(
    defaultBilling && defaultAddress && defaultBilling.id !== defaultAddress.id,
  )
  const [billingSame, setBillingSame] = useState(initial.billingSame && !billingDiffers ? true : initial.billingSame)
  const [billing, setBilling] = useState<BillingForm>(() => {
    if (initial.billing.line1) {
      return { ...initial.billing, line2: initial.billing.line2 ?? '' }
    }
    if (billingDiffers && defaultBilling) return addressToShipping(defaultBilling)
    return EMPTY_BILLING
  })
  const [billingErrors, setBillingErrors] = useState<Partial<Record<keyof BillingForm, string>>>({})

  const setBillingField = (name: keyof BillingForm, value: string) => {
    setBilling((b) => ({ ...b, [name]: value }))
    setBillingErrors((prev) => ({ ...prev, [name]: undefined }))
  }
  const [deliveryId, setDeliveryId] = useState<string>(
    initial.deliveryId || methods[0]?.id || 'standard',
  )
  const [leaveAtDoor, setLeaveAtDoor] = useState(initial.leaveAtDoor)
  const [promoInput, setPromoInput] = useState(initial.promo?.code ?? '')
  const [promo, setPromo] = useState<{ code: string; pct: number } | null>(initial.promo)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  useEffect(() => {
    saveCheckoutDraft({
      form,
      billing,
      billingSame,
      step,
      deliveryId,
      leaveAtDoor,
      promo,
      selectedAddressId,
    })
  }, [form, billing, billingSame, step, deliveryId, leaveAtDoor, promo, selectedAddressId])

  const setField = (name: FieldName, value: string) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  /* Totals */
  const discount = promo ? (subtotal * promo.pct) / 100 : 0
  const afterDiscount = subtotal - discount
  const priceFor = (m: DeliveryMethod) =>
    m.freeOverThreshold ? (afterDiscount >= freeShippingThreshold ? 0 : m.fee) : m.fee
  const delivery = methods.find((m) => m.id === deliveryId) ?? methods[0]!
  const shipping = priceFor(delivery)
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

  const validateBilling = (): boolean => {
    if (billingSame) {
      setBillingErrors({})
      return true
    }
    const result = billingSchema.safeParse(billing)
    if (result.success) {
      setBillingErrors({})
      return true
    }
    const fe: Partial<Record<keyof BillingForm, string>> = {}
    result.error.issues.forEach((i) => {
      fe[i.path[0] as keyof BillingForm] = i.message
    })
    setBillingErrors(fe)
    return false
  }

  const goNext = () => {
    if (!validateStep(step)) return
    if (step === 1 && !validateBilling()) return
    setStep((s) => Math.min(3, s + 1) as StepIndex)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectSavedAddress = (a: CustomerAddress) => {
    setSelectedAddressId(a.id ?? null)
    setForm((f) => ({ ...f, ...addressToShipping(a) }))
    setErrors({})
  }
  const useNewAddress = () => {
    setSelectedAddressId(null)
    setForm((f) => ({ ...f, name: '', line1: '', line2: '', city: '', state: '', pincode: '' }))
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

  /* Final payment — Razorpay Standard Checkout */
  const handlePay = async () => {
    if (!fullSchema.safeParse(form).success) {
      setStep(0)
      validateStep(0)
      return
    }
    setPayError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          address: form,
          billingSameAsShipping: billingSame,
          billing: billingSame ? null : billing,
          total: orderTotal,
          delivery: { method: delivery.id, leaveAtDoor },
          promo: promo?.code ?? null,
        }),
      })
      const data = (await res.json()) as {
        orderId?: string
        order_id?: string
        amount?: number
        currency?: string
        key?: string
        checkout_config_id?: string
        error?: string
      }

      if (!res.ok) {
        setPayError(data.error || 'Could not start payment. Check Razorpay keys in .env.')
        return
      }

      const orderId = data.orderId ?? data.order_id
      const { amount, currency, key } = data
      if (!orderId || amount == null || !currency || !key) {
        setPayError('Invalid response from payment server.')
        return
      }

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Razorpay checkout'))
          document.body.appendChild(script)
        })
      }

      const checkoutOpts = buildRazorpayCheckoutOptions(key)

      const rzp = new window.Razorpay({
        key,
        amount,
        currency,
        order_id: orderId,
        name: 'Punyakoti Taila',
        description: `${count} item(s)`,
        image: '/assets/logo-monogram.svg',
        prefill: {
          name: form.name,
          email: form.email,
          contact: razorpayPrefillContact(form.phone),
        },
        theme: { color: '#244023' },
        method: checkoutOpts.method,
        config: checkoutOpts.config,
        ...(data.checkout_config_id ? { checkout_config_id: data.checkout_config_id } : {}),
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            // The pending order was already created (with real items/pricing)
            // by /api/checkout — verify just finalizes it + sends the email.
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            const verifyData = (await verifyRes.json()) as { success?: boolean; error?: string }
            if (!verifyRes.ok || !verifyData.success) {
              setPayError(verifyData.error || 'Payment verification failed.')
              return
            }
            clearCheckoutDraft()
            clearCart()
            // Look the order up by the unguessable Razorpay order id.
            window.location.href = `/order/success?ref=${encodeURIComponent(response.razorpay_order_id)}`
          } catch {
            setPayError('Payment verification failed. Please contact support if you were charged.')
          }
        },
        modal: {
          ondismiss: () => {
            setPayError('Payment cancelled.')
            setLoading(false)
          },
        },
      })
      rzp.on('payment.failed', (response: { error?: RazorpayError }) => {
        setPayError(razorpayErrorMessage(response.error))
        setLoading(false)
      })
      rzp.open()
    } catch (err) {
      console.error(err)
      setPayError('Payment could not be started. Please try again.')
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
    <div className="pt-page-container pb-28 lg:pb-16">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Checkout' },
        ]}
      />
      <Stepper current={step} />

      <div className="mt-5 lg:mt-6 grid lg:grid-cols-[1fr_min(400px,34vw)] gap-8 lg:gap-10 items-start">
        {/* ── LEFT: step content ─────────────────────────────────────── */}
        <div>
          {/* Completed-step review rows */}
          {step > 0 && <ReviewRow label="Contact" value={contactSummary} onChange={() => setStep(0)} />}
          {step > 1 && <ReviewRow label="Shipping address" value={shippingSummary} onChange={() => setStep(1)} />}

          {/* Step 1 — Contact */}
          {step === 0 && (
            <section className="mt-2">
              <SectionLabel>Contact</SectionLabel>
              <h1 className="mt-2 mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', color: 'var(--green-900)' }}>
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
            <section className="mt-4">
              <SectionLabel>Shipping address</SectionLabel>
              <h1 className="mt-2 mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', color: 'var(--green-900)' }}>
                Where should the oils go?
              </h1>

              {/* Saved-address picker (logged-in shoppers) */}
              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-400)' }}>
                    {copy?.useSaved ?? 'Use a saved address'}
                  </div>
                  <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={copy?.useSaved ?? 'Use a saved address'}>
                    {savedAddresses.map((a) => {
                      const isOn = selectedAddressId === a.id
                      return (
                        <button
                          key={a.id}
                          type="button"
                          role="radio"
                          aria-checked={isOn}
                          onClick={() => selectSavedAddress(a)}
                          className="flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all"
                          style={{ borderColor: isOn ? 'var(--green-800)' : 'var(--cream-400)', background: 'var(--cream-100)' }}
                        >
                          <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2" style={{ borderColor: isOn ? 'var(--green-800)' : 'var(--ink-300)' }} aria-hidden>
                            {isOn && <span className="h-2 w-2 rounded-full" style={{ background: 'var(--green-800)' }} />}
                          </span>
                          <span className="text-sm" style={{ color: 'var(--ink-700)' }}>{addressLabel(a)}</span>
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      onClick={useNewAddress}
                      className="self-start text-sm underline underline-offset-4"
                      style={{ color: selectedAddressId === null ? 'var(--green-900)' : 'var(--green-700)', fontWeight: selectedAddressId === null ? 600 : 400 }}
                    >
                      {copy?.useNew ?? '+ Use a new address'}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field label="Full name" name="name" placeholder="Priya Sharma" autoComplete="name" value={form.name} error={errors.name} onChange={setField} />
                <Field label="Address line 1" name="line1" placeholder="House / flat / street" autoComplete="address-line1" value={form.line1} error={errors.line1} onChange={setField} />
                <Field label="Address line 2 (optional)" name="line2" placeholder="Area / landmark" autoComplete="address-line2" value={form.line2 ?? ''} error={errors.line2} onChange={setField} />
                <Field label="City" name="city" placeholder="Bangalore" autoComplete="address-level2" half value={form.city} error={errors.city} onChange={setField} />
                <Field label="State" name="state" placeholder="Karnataka" autoComplete="address-level1" half value={form.state} error={errors.state} onChange={setField} />
                <Field label="Pincode" name="pincode" placeholder="560001" autoComplete="postal-code" half value={form.pincode} error={errors.pincode} onChange={setField} />
              </div>

              {/* Billing address — same-as-shipping toggle */}
              <div className="mt-6 rounded-xl border px-5 py-4" style={{ borderColor: 'var(--cream-400)' }}>
                <label className="flex items-center gap-2.5 text-sm cursor-pointer" style={{ color: 'var(--ink-700)' }}>
                  <input
                    type="checkbox"
                    checked={billingSame}
                    onChange={(e) => setBillingSame(e.target.checked)}
                    className="h-4 w-4 rounded accent-[var(--green-800)]"
                  />
                  {copy?.billingSame ?? 'Billing address is the same as my shipping address'}
                </label>

                {!billingSame && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <BillingField label="Full name" name="name" value={billing.name} error={billingErrors.name} onChange={setBillingField} />
                    <BillingField label="Address line 1" name="line1" value={billing.line1} error={billingErrors.line1} onChange={setBillingField} />
                    <BillingField label="Address line 2 (optional)" name="line2" value={billing.line2} error={billingErrors.line2} onChange={setBillingField} />
                    <BillingField label="City" name="city" half value={billing.city} error={billingErrors.city} onChange={setBillingField} />
                    <BillingField label="State" name="state" half value={billing.state} error={billingErrors.state} onChange={setBillingField} />
                    <BillingField label="Pincode" name="pincode" half value={billing.pincode} error={billingErrors.pincode} onChange={setBillingField} />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Step 3 — Delivery */}
          {step === 2 && (
            <section className="mt-4">
              <SectionLabel>{deliverySectionLabel}</SectionLabel>
              <div className="mt-4 flex flex-col gap-3" role="radiogroup" aria-label={deliverySectionLabel}>
                {methods.map((m) => {
                  const isOn = deliveryId === m.id
                  const price = priceFor(m)
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
                            {formatEta(m.etaDays)}{m.noteSuffix ? ` · ${m.noteSuffix}` : ''}
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

              {leaveAtDoorText ? (
                <label className="mt-4 flex items-center gap-2.5 text-sm cursor-pointer" style={{ color: 'var(--ink-700)' }}>
                  <input
                    type="checkbox"
                    checked={leaveAtDoor}
                    onChange={(e) => setLeaveAtDoor(e.target.checked)}
                    className="h-4 w-4 rounded accent-[var(--green-800)]"
                  />
                  {leaveAtDoorText}
                </label>
              ) : null}

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
            <section className="mt-4">
              <SectionLabel>Payment</SectionLabel>
              <h1 className="mt-2 mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', color: 'var(--green-900)' }}>
                Almost there.
              </h1>
              <div className="rounded-xl border px-5 py-5" style={{ borderColor: 'var(--cream-400)', background: 'var(--cream-100)' }}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }}>
                    <Icons.lock size={18} />
                  </span>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--green-900)' }}>Pay securely with Razorpay</p>
                    <p className="text-sm" style={{ color: 'var(--ink-400)' }}>
                      {isRazorpayTestKey(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '')
                        ? 'UPI · Net banking · Wallet (test mode — cards hidden)'
                        : 'UPI · Cards · Net Banking · Wallets'}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--ink-400)' }}>
                      {isRazorpayTestKey(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? '') ? (
                        <>
                          Enable UPI in Razorpay Dashboard if it is missing. Test UPI:{' '}
                          <span className="font-mono">success@razorpay</span> · or use net banking (any bank → Success).
                        </>
                      ) : (
                        <>
                          Test UPI: <span className="font-mono">success@razorpay</span> · Indian test card 4111 1111 1111 1111
                        </>
                      )}
                    </p>
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
                {payError ? (
                  <p className="mt-3 text-center text-sm" role="alert" style={{ color: 'var(--terra-600, #b45309)' }}>
                    {payError}
                  </p>
                ) : null}
                <p className="mt-3 text-center text-xs" style={{ color: 'var(--ink-400)' }}>
                  256-bit SSL · You&apos;ll get a confirmation email at {form.email || 'your inbox'}
                </p>
              </div>
            </section>
          )}

          {/* Step nav */}
          <div className="mt-8 flex items-center justify-between gap-4">
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
          className="rounded-2xl p-6 lg:p-7 lg:sticky lg:top-20"
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
