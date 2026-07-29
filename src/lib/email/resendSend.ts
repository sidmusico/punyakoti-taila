/** Low-level Resend HTTP send (shared by transactional emails). */

export type ResendSendResult = { sent: boolean; skipped?: boolean; error?: string; resendId?: string }

export async function sendResendEmail(args: {
  to: string
  subject: string
  html: string
  /** Helps inbox providers treat each transactional send as distinct. */
  entityRef?: string
}): Promise<ResendSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from =
    process.env.RESEND_FROM?.trim() || 'Punyakoti Taila <onboarding@resend.dev>'

  if (!apiKey) {
    console.info(`[email] RESEND_API_KEY not set — skipping: ${args.subject}`)
    return { sent: false, skipped: true }
  }
  if (!args.to?.trim()) {
    return { sent: false, skipped: true }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [args.to.trim()],
        subject: args.subject,
        html: args.html,
        ...(args.entityRef
          ? { headers: { 'X-Entity-Ref-ID': args.entityRef.slice(0, 256) } }
          : {}),
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error('[email] Resend failed:', res.status, body, {
        subject: args.subject,
        to: args.to.replace(/^(.{2}).*(@.*)$/, '$1***$2'),
      })
      if (res.status === 403 || body.includes('not authorized')) {
        console.error(
          '[email] Resend: verify your domain and set RESEND_FROM to an address on that domain (see doc/RAZORPAY.md).',
        )
      }
      if (body.includes('testing email') || body.includes('validation_error')) {
        console.error(
          '[email] Resend: recipient may be blocked until your sending domain is verified, or use the email on your Resend account for testing.',
        )
      }
      return { sent: false, error: `resend_${res.status}` }
    }
    const json = (await res.json().catch(() => null)) as { id?: string } | null
    const resendId = json?.id
    console.info(
      '[email] Resend sent:',
      args.subject,
      '→',
      args.to.replace(/^(.{2}).*(@.*)$/, '$1***$2'),
      resendId ? `(id ${resendId})` : '',
    )
    return { sent: true, resendId }
  } catch (err) {
    console.error('[email] Resend exception:', err)
    return { sent: false, error: 'resend_exception' }
  }
}
