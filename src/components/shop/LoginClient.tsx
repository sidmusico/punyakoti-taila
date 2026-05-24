'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/pt/Icons'
import { Wordmark } from '@/components/ui/pt/Wordmark'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export function LoginClient() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const fieldErrors: typeof errors = {}
      result.error.issues.forEach((i) => {
        const key = i.path[0] as keyof typeof errors
        fieldErrors[key] = i.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const endpoint = tab === 'login' ? '/api/users/login' : '/api/users'
      const body = tab === 'login'
        ? { email, password }
        : { email, password, name }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      })

      if (res.ok) {
        router.push('/account')
        router.refresh()
      } else {
        const data = await res.json() as { errors?: Array<{ message: string }> }
        setApiError(data.errors?.[0]?.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setApiError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* logo */}
      <div className="text-center mb-8">
        <Link href="/"><Wordmark size={26} /></Link>
      </div>

      {/* card */}
      <div className="rounded-2xl p-7" style={{ background: 'var(--cream-100)', boxShadow: 'var(--sh-md)', border: '1px solid var(--cream-400)' }}>
        {/* tab switcher */}
        <div className="flex rounded-xl overflow-hidden mb-6" style={{ background: 'var(--cream-300)' }}>
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setErrors({}); setApiError('') }}
              className="flex-1 py-2.5 text-sm font-medium transition-all capitalize rounded-xl"
              style={
                tab === t
                  ? { background: 'var(--green-900)', color: 'var(--cream-100)' }
                  : { background: 'transparent', color: 'var(--ink-500)' }
              }
            >
              {t === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink-400)' }}>
                Full name
              </label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                style={{ background: 'var(--cream-200)', borderColor: errors.name ? '#A23A1F' : 'var(--cream-400)', color: 'var(--ink-900)', fontFamily: 'var(--font-body)' }}
              />
              {errors.name && <p className="mt-1 text-xs" style={{ color: '#A23A1F' }}>{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--ink-400)' }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
              style={{ background: 'var(--cream-200)', borderColor: errors.email ? '#A23A1F' : 'var(--cream-400)', color: 'var(--ink-900)', fontFamily: 'var(--font-body)' }}
            />
            {errors.email && <p className="mt-1 text-xs" style={{ color: '#A23A1F' }}>{errors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ink-400)' }}>
                Password
              </label>
              {tab === 'login' && (
                <Link href="/forgot-password" className="text-xs transition-opacity hover:opacity-70"
                  style={{ color: 'var(--green-700)' }}>
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
              style={{ background: 'var(--cream-200)', borderColor: errors.password ? '#A23A1F' : 'var(--cream-400)', color: 'var(--ink-900)', fontFamily: 'var(--font-body)' }}
            />
            {errors.password && <p className="mt-1 text-xs" style={{ color: '#A23A1F' }}>{errors.password}</p>}
          </div>

          {apiError && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'var(--terra-100)', color: 'var(--terra-700)' }}>
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-60 mt-1"
            style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
          >
            {loading ? '…' : tab === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {/* divider */}
        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1" style={{ borderColor: 'var(--cream-400)' }} />
          <span className="text-xs" style={{ color: 'var(--ink-400)' }}>or continue with</span>
          <hr className="flex-1" style={{ borderColor: 'var(--cream-400)' }} />
        </div>

        {/* Google */}
        <a
          href="/api/users/oauth/google"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium border transition-colors hover:bg-cream-300"
          style={{ background: 'var(--cream-200)', borderColor: 'var(--cream-400)', color: 'var(--ink-900)' }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </a>
      </div>

      <p className="text-center text-xs mt-6" style={{ color: 'var(--ink-400)' }}>
        By continuing you agree to our{' '}
        <Link href="/terms" className="underline">Terms</Link> and{' '}
        <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  )
}
