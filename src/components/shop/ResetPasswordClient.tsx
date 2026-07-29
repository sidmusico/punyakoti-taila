'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

import { Wordmark } from '@/components/ui/pt/Wordmark'
import { createClient } from '@/lib/supabase/client'

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

async function syncCustomer() {
  await fetch('/api/auth/sync', { method: 'POST', credentials: 'include' })
}

export function ResetPasswordClient() {
  const router = useRouter()
  const supabase = createClient()
  const [ready, setReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!cancelled) {
        setHasSession(Boolean(data.session))
        setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [supabase.auth])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    const parsed = schema.safeParse({ password, confirm })
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message
      })
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    setErrors({})
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
    setLoading(false)
    if (error) {
      setApiError(error.message)
      return
    }
    await syncCustomer()
    router.push('/account')
    router.refresh()
  }

  const cardStyle = {
    background: 'var(--cream-100)',
    boxShadow: 'var(--sh-md)',
    border: '1px solid var(--cream-400)',
  } as const

  if (!ready) {
    return (
      <div className="w-full max-w-sm text-center text-sm" style={{ color: 'var(--ink-500)' }}>
        Loading…
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <Wordmark size={26} />
          </Link>
        </div>
        <div className="rounded-2xl p-7" style={cardStyle}>
          <h1 className="text-lg font-semibold mb-2" style={{ color: 'var(--ink-900)' }}>
            Reset link expired
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--ink-500)' }}>
            Open the link from your email again, or request a new password reset.
          </p>
          <Link
            href="/login?forgot=1"
            className="inline-block w-full text-center py-3.5 rounded-xl font-semibold text-sm"
            style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
          >
            Request reset link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/">
          <Wordmark size={26} />
        </Link>
      </div>
      <div className="rounded-2xl p-7" style={cardStyle}>
        <h1 className="text-lg font-semibold mb-1" style={{ color: 'var(--ink-900)' }}>
          Choose a new password
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-500)' }}>
          Use at least 8 characters.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              autoComplete="new-password"
              className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
              style={{
                background: 'var(--cream-200)',
                borderColor: errors.password ? '#A23A1F' : 'var(--cream-400)',
              }}
            />
            {errors.password && (
              <p className="mt-1 text-xs" style={{ color: '#A23A1F' }}>
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
              style={{
                background: 'var(--cream-200)',
                borderColor: errors.confirm ? '#A23A1F' : 'var(--cream-400)',
              }}
            />
            {errors.confirm && (
              <p className="mt-1 text-xs" style={{ color: '#A23A1F' }}>
                {errors.confirm}
              </p>
            )}
          </div>
          {apiError && (
            <p className="text-sm rounded-lg px-4 py-3" style={{ background: 'var(--terra-100)', color: 'var(--terra-700)' }}>
              {apiError}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm disabled:opacity-60"
            style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
          >
            {loading ? '…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
