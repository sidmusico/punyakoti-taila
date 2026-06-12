'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ProfileForm({
  initialName,
  initialPhone,
}: {
  initialName: string
  initialPhone: string
}) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    const res = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone: phone || null }),
    })
    setLoading(false)
    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Could not save profile')
      return
    }
    setMessage('Profile updated')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink-400)' }}>
          Full name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
          style={{ background: 'var(--cream-200)', borderColor: 'var(--cream-400)' }}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink-400)' }}>
          Mobile (optional)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+919876543210"
          className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
          style={{ background: 'var(--cream-200)', borderColor: 'var(--cream-400)' }}
        />
      </div>
      {error && <p className="text-sm" style={{ color: '#A23A1F' }}>{error}</p>}
      {message && <p className="text-sm" style={{ color: 'var(--green-800)' }}>{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="self-start px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-60"
        style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
      >
        {loading ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}
