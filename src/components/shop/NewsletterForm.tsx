'use client'

import React, { useState } from 'react'
import { Icons } from '@/components/ui/pt/Icons'

/**
 * Newsletter form — cream rounded bar + inset primary button
 * (matches `punyakoti-taila-design/project/home.jsx` NewsletterBand).
 */
export function NewsletterForm({ submitLabel = 'Subscribe' }: { submitLabel?: string }) {
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage("You're on the list! We'll notify you when a new batch is pressed.")
        setEmail('')
      } else {
        throw new Error('Failed')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '18px 24px',
          borderRadius: 'var(--r-md)',
          background: 'rgba(245,239,224,0.08)',
          border: '1px solid rgba(245,239,224,0.15)',
          color: 'var(--cream-100)',
        }}
      >
        <Icons.check size={18} style={{ color: 'var(--mustard-400)', flexShrink: 0 }} />
        <span style={{ fontSize: 14, lineHeight: 1.5 }}>{message}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div className="newsletter-band-field">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@kitchen.in"
          required
          autoComplete="email"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="pt-btn pt-btn--primary newsletter-band-submit"
        >
          {status === 'loading' ? '…' : submitLabel}
        </button>
      </div>

      {status === 'error' && (
        <p style={{ marginTop: 10, fontSize: 12, color: 'rgba(245,239,224,0.6)' }}>{message}</p>
      )}
    </form>
  )
}
