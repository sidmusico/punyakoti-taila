'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { Wordmark } from '@/components/ui/pt/Wordmark'
import { getAuthCallbackUrl } from '@/lib/auth/authUrls'
import { createClient } from '@/lib/supabase/client'

type AuthMethod = 'phone' | 'email'
type PhoneStep = 'number' | 'otp'

const emailSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

function toIndianE164(digitsOnly: string): string {
  const d = digitsOnly.replace(/\D/g, '')
  if (d.length === 10) return `+91${d}`
  if (d.startsWith('91') && d.length === 12) return `+${d}`
  return `+${d}`
}

async function syncCustomer() {
  await fetch('/api/auth/sync', { method: 'POST', credentials: 'include' })
}

export function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  const [method, setMethod] = useState<AuthMethod>('phone')
  const [emailTab, setEmailTab] = useState<'login' | 'register'>('login')
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('number')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [e164, setE164] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(authError === 'auth_callback' ? 'Sign-in failed. Try again.' : '')
  const [infoMessage, setInfoMessage] = useState('')
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false)

  const supabase = createClient()

  const authCallbackUrl = () =>
    getAuthCallbackUrl({
      browserOrigin: typeof window !== 'undefined' ? window.location.origin : undefined,
    })

  const resendConfirmationEmail = async () => {
    if (!email) {
      setApiError('Enter your email address first.')
      return
    }
    setLoading(true)
    setApiError('')
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: authCallbackUrl() },
    })
    setLoading(false)
    if (error) {
      setApiError(error.message)
      return
    }
    setInfoMessage('Confirmation email sent. Check your inbox, then sign in.')
    setNeedsEmailConfirm(false)
  }

  const finishSignIn = async () => {
    await syncCustomer()
    router.push('/account')
    router.refresh()
  }

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    const normalized = toIndianE164(phone)
    if (normalized.length < 12) {
      setErrors({ phone: 'Enter a valid 10-digit mobile number' })
      return
    }
    setLoading(true)
    setErrors({})
    const { error } = await supabase.auth.signInWithOtp({ phone: normalized })
    setLoading(false)
    if (error) {
      setApiError(error.message)
      return
    }
    setE164(normalized)
    setPhoneStep('otp')
  }

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      phone: e164,
      token: otp,
      type: 'sms',
    })
    setLoading(false)
    if (error) {
      setApiError(error.message)
      return
    }
    await finishSignIn()
  }

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    setInfoMessage('')
    setNeedsEmailConfirm(false)

    const result = emailSchema.safeParse({ email, password })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message
      })
      setErrors(fieldErrors)
      return
    }

    if (emailTab === 'register' && !name.trim()) {
      setErrors({ name: 'Name is required' })
      return
    }

    setLoading(true)
    setErrors({})

    try {
      if (emailTab === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim(), name: name.trim() },
            emailRedirectTo: authCallbackUrl(),
          },
        })
        if (error) {
          setApiError(error.message)
          return
        }
        if (data.user?.identities?.length === 0) {
          setApiError('An account with this email already exists. Try signing in.')
          setEmailTab('login')
          return
        }
        if (data.session) {
          await finishSignIn()
          return
        }
        setInfoMessage(
          'Account created. Check your email to confirm your address, then sign in.',
        )
        setEmailTab('login')
        return
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        const unconfirmed =
          /not confirmed|email not confirmed|confirm your email/i.test(error.message)
        setNeedsEmailConfirm(unconfirmed)
        setApiError(
          unconfirmed
            ? 'Please confirm your email first (check your inbox), or resend the confirmation link below.'
            : error.message,
        )
        return
      }
      await finishSignIn()
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setApiError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authCallbackUrl(),
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) {
      setLoading(false)
      setApiError(error.message)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/">
          <Wordmark size={26} />
        </Link>
      </div>

      <div
        className="rounded-2xl p-7"
        style={{
          background: 'var(--cream-100)',
          boxShadow: 'var(--sh-md)',
          border: '1px solid var(--cream-400)',
        }}
      >
        <div className="flex rounded-xl overflow-hidden mb-6" style={{ background: 'var(--cream-300)' }}>
          {(['phone', 'email'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMethod(m)
                setApiError('')
                setInfoMessage('')
                setNeedsEmailConfirm(false)
                setErrors({})
              }}
              className="flex-1 py-2.5 text-sm font-medium transition-all rounded-xl capitalize"
              style={
                method === m
                  ? { background: 'var(--green-900)', color: 'var(--cream-100)' }
                  : { background: 'transparent', color: 'var(--ink-500)' }
              }
            >
              {m === 'phone' ? 'Mobile OTP' : 'Email'}
            </button>
          ))}
        </div>

        {method === 'phone' ? (
          phoneStep === 'number' ? (
            <form onSubmit={sendOtp} className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--ink-400)' }}
                >
                  Mobile number
                </label>
                <div className="flex gap-2">
                  <span
                    className="flex items-center px-3 rounded-xl text-sm border"
                    style={{ background: 'var(--cream-200)', borderColor: 'var(--cream-400)', color: 'var(--ink-700)' }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    className="flex-1 rounded-xl px-4 py-3 text-sm border outline-none"
                    style={{
                      background: 'var(--cream-200)',
                      borderColor: errors.phone ? '#A23A1F' : 'var(--cream-400)',
                      color: 'var(--ink-900)',
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs" style={{ color: '#A23A1F' }}>
                    {errors.phone}
                  </p>
                )}
                <p className="mt-2 text-xs" style={{ color: 'var(--ink-400)' }}>
                  Local dev: use 9876543210 · OTP 123456
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm disabled:opacity-60"
                style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
              >
                {loading ? '…' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: 'var(--ink-500)' }}>
                Code sent to <strong>{e164}</strong>
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit OTP"
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none tracking-widest text-center"
                style={{ background: 'var(--cream-200)', borderColor: 'var(--cream-400)' }}
              />
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3.5 rounded-xl font-semibold text-sm disabled:opacity-60"
                style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
              >
                {loading ? '…' : 'Verify & sign in'}
              </button>
              <button
                type="button"
                className="text-sm"
                style={{ color: 'var(--green-700)' }}
                onClick={() => setPhoneStep('number')}
              >
                Change number
              </button>
            </form>
          )
        ) : (
          <>
            <div className="flex rounded-xl overflow-hidden mb-4" style={{ background: 'var(--cream-300)' }}>
              {(['login', 'register'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setEmailTab(t)
                    setErrors({})
                    setApiError('')
                    setInfoMessage('')
                    setNeedsEmailConfirm(false)
                  }}
                  className="flex-1 py-2 text-xs font-medium capitalize rounded-xl"
                  style={
                    emailTab === t
                      ? { background: 'var(--green-900)', color: 'var(--cream-100)' }
                      : { color: 'var(--ink-500)' }
                  }
                >
                  {t === 'login' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>
            <form onSubmit={submitEmail} className="flex flex-col gap-4">
              {emailTab === 'register' && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                    style={{
                      background: 'var(--cream-200)',
                      borderColor: errors.name ? '#A23A1F' : 'var(--cream-400)',
                    }}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs" style={{ color: '#A23A1F' }}>
                      {errors.name}
                    </p>
                  )}
                </div>
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                style={{
                  background: 'var(--cream-200)',
                  borderColor: errors.email ? '#A23A1F' : 'var(--cream-400)',
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                style={{
                  background: 'var(--cream-200)',
                  borderColor: errors.password ? '#A23A1F' : 'var(--cream-400)',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm disabled:opacity-60"
                style={{ background: 'var(--green-800)', color: 'var(--cream-100)' }}
              >
                {loading ? '…' : emailTab === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>
          </>
        )}

        {infoMessage && (
          <div
            className="rounded-lg px-4 py-3 text-sm mt-4"
            style={{ background: 'var(--cream-300)', color: 'var(--ink-700)' }}
          >
            {infoMessage}
          </div>
        )}

        {apiError && (
          <div
            className="rounded-lg px-4 py-3 text-sm mt-4"
            style={{ background: 'var(--terra-100)', color: 'var(--terra-700)' }}
          >
            {apiError}
            {needsEmailConfirm && (
              <button
                type="button"
                className="block mt-2 underline font-medium"
                onClick={resendConfirmationEmail}
                disabled={loading}
              >
                Resend confirmation email
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1" style={{ borderColor: 'var(--cream-400)' }} />
          <span className="text-xs" style={{ color: 'var(--ink-400)' }}>
            or
          </span>
          <hr className="flex-1" style={{ borderColor: 'var(--cream-400)' }} />
        </div>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium border transition-colors hover:bg-cream-300 disabled:opacity-60"
          style={{
            background: 'var(--cream-200)',
            borderColor: 'var(--cream-400)',
            color: 'var(--ink-900)',
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
      </div>

      <p className="text-center text-xs mt-6" style={{ color: 'var(--ink-400)' }}>
        By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and{' '}
        <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  )
}
