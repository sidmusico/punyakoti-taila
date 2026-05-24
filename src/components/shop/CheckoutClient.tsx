'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { Icons } from '@/components/ui/pt/Icons'
import { Bottle } from '@/components/ui/pt/Bottle'
import type { OilVariant } from '@/components/ui/pt/Bottle'
import { z } from 'zod'

const addressSchema = z.object({
  name:    z.string().min(2, 'Name is required'),
  email:   z.string().email('Valid email required'),
  phone:   z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile number required'),
  line1:   z.string().min(5, 'Address is required'),
  line2:   z.string().optional(),
  city:    z.string().min(2, 'City is required'),
  state:   z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
})

type AddressForm = z.infer<typeof addressSchema>

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

declare global {
  interface Window {
    Razorpay: new (opts: Record<string, unknown>) => { open(): void }
  }
}

export function CheckoutClient() {
  const { items, total, clearCart } = useCartStore()
  const grandTotal = total()
  const shipping = grandTotal >= 999 ? 0 : 99
  const orderTotal = grandTotal + shipping

  const [form, setForm] = useState<AddressForm>({
    name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({})
  const [loading, setLoading] = useState(false)

  const update = (field: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handlePlaceOrder = async () => {
    const result = addressSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: typeof errors = {}
      result.error.issues.forEach((i) => {
        const key = i.path[0] as keyof AddressForm
        fieldErrors[key] = i.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      // 1. Create Razorpay order on server
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, address: form, total: orderTotal }),
      })
      const { orderId, amount, currency, key } = await res.json()

      // 2. Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve()
          document.body.appendChild(script)
        })
      }

      // 3. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key,
        amount,
        currency,
        order_id: orderId,
        name: 'Punyakoti Taila',
        description: `${items.length} item(s)`,
        image: '/assets/logo-monogram.svg',
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#244023' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // 4. Verify payment on server
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

  const Field = ({
    label, name, type = 'text', placeholder, half = false,
  }: { label: string; name: keyof AddressForm; type?: string; placeholder?: string; half?: boolean }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink-400)' }}>
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={update(name)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm border outline-none transition-all"
        style={{
          background: 'var(--cream-100)',
          borderColor: errors[name] ? 'var(--danger)' : 'var(--cream-400)',
          color: 'var(--ink-900)',
          fontFamily: 'var(--font-body)',
        }}
      />
      {errors[name] && (
        <p className="mt-1 text-xs" style={{ color: 'var(--danger, #A23A1F)' }}>{errors[name]}</p>
      )}
    </div>
  )

  return (
    <div className="max-w-[1240px] mx-auto px-8 py-12">
      <h1
        className="mb-10"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--green-900)' }}
      >
        Checkout
      </h1>

      <div className="grid md:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-start">
        {/* ── FORM ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8">
          {/* Contact */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--green-900)', marginBottom: 16 }}>
              Contact information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full name"    name="name"  placeholder="Priya Sharma" />
              <Field label="Email"        name="email" type="email" placeholder="priya@example.com" half />
              <Field label="Phone"        name="phone" type="tel"   placeholder="9876543210"          half />
            </div>
          </section>

          {/* Shipping */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--green-900)', marginBottom: 16 }}>
              Shipping address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Address line 1" name="line1"   placeholder="House / flat / street" />
              <Field label="Address line 2 (optional)" name="line2" placeholder="Area / landmark" />
              <Field label="City"    name="city"    placeholder="Bangalore" half />
              <Field label="State"   name="state"   placeholder="Karnataka"  half />
              <Field label="Pincode" name="pincode" placeholder="560001"     half />
            </div>
          </section>

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--ink-400)' }}>
            <Icons.lock size={14} style={{ color: 'var(--green-700)' }} />
            Secured by Razorpay · 256-bit SSL encryption
          </div>
        </div>

        {/* ── ORDER SUMMARY ────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-6 sticky top-24"
          style={{ background: 'var(--cream-100)', boxShadow: 'var(--sh-sm)', border: '1px solid var(--cream-400)' }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--green-900)', marginBottom: 16 }}>
            Order summary
          </h2>

          {/* items */}
          <div className="flex flex-col gap-3 mb-5">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div
                  className="w-12 h-14 rounded-lg grid place-items-center shrink-0"
                  style={{ background: 'var(--cream-200)' }}
                >
                  <Bottle variant={item.slug.split('-')[0] as OilVariant || 'sesame'} size={36} showLabel={false} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--ink-900)' }}>{item.name}</p>
                  <p className="text-xs" style={{ color: 'var(--ink-400)' }}>{item.variantSize} · ×{item.quantity}</p>
                </div>
                <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--green-900)' }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <hr style={{ borderColor: 'var(--cream-400)', margin: '0 0 16px' }} />

          {/* totals */}
          <div className="flex flex-col gap-2 text-sm mb-5">
            <div className="flex justify-between" style={{ color: 'var(--ink-500)' }}>
              <span>Subtotal</span><span>{formatPrice(grandTotal)}</span>
            </div>
            <div className="flex justify-between" style={{ color: 'var(--ink-500)' }}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--green-700)' : 'var(--ink-500)' }}>
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between font-semibold mt-2 pt-2 text-base"
              style={{ color: 'var(--green-900)', borderTop: '1px solid var(--cream-400)' }}>
              <span>Total</span><span>{formatPrice(orderTotal)}</span>
            </div>
          </div>

          {/* pay button */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
            style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
          >
            {loading ? (
              <>Processing…</>
            ) : (
              <><Icons.lock size={15} /> Pay {formatPrice(orderTotal)} with Razorpay</>
            )}
          </button>

          <p className="mt-3 text-center text-xs" style={{ color: 'var(--ink-400)' }}>
            UPI · Cards · Net Banking · Pay Later · COD
          </p>
        </div>
      </div>
    </div>
  )
}
