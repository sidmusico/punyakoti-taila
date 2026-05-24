'use client'

import React, { useState } from 'react'
import { Icons } from '@/components/ui/pt/Icons'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
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
        setMessage('You\'re on the list! We\'ll notify you when a new batch is pressed.')
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
        className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl"
        style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
      >
        <Icons.check size={18} />
        <span className="text-sm">{message}</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 rounded-xl px-4 py-3.5 text-sm border-0 outline-none"
        style={{
          background: 'rgba(251,247,236,0.1)',
          color: 'var(--cream-100)',
          border: '1px solid rgba(245,239,224,0.2)',
        }}
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="shrink-0 rounded-xl px-5 py-3.5 text-sm font-medium transition-opacity disabled:opacity-60"
        style={{ background: 'var(--mustard-500)', color: 'var(--green-950)' }}
      >
        {status === 'loading' ? '…' : 'Subscribe'}
      </button>
    </form>
  )
}
