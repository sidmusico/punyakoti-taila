import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)

    // ── Resend integration ──────────────────────────────────────────
    // Uncomment when @resend/node is installed:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.contacts.create({
    //   email,
    //   audienceId: process.env.RESEND_AUDIENCE_ID!,
    // })
    // await resend.emails.send({
    //   from: 'Punyakoti Taila <hello@punyakoitaila.com>',
    //   to: email,
    //   subject: 'Welcome to the pressing calendar',
    //   html: `<p>Thank you for subscribing! We'll notify you when a fresh batch is ready.</p>`,
    // })

    console.log('[Newsletter] New subscriber:', email)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
