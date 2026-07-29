import type { EmailTemplateBlock } from '@/seed/emailTemplatesSeedDefaults'

export type MergeContext = Record<string, string | number | undefined | null>

/** Replace {{key}} in text; missing keys become empty string. */
export function mergeTags(template: string, ctx: MergeContext): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const v = ctx[key]
    return v === undefined || v === null ? '' : String(v)
  })
}

export function applyTemplateStrings(
  block: EmailTemplateBlock,
  ctx: MergeContext,
): { subject: string; headline: string; body: string } {
  return {
    subject: mergeTags(block.subject, ctx),
    headline: mergeTags(block.headline, ctx),
    body: mergeTags(block.body, ctx),
  }
}

/** Turn plain-text body with newlines into HTML paragraphs; leaves existing HTML untouched. */
export function bodyToHtml(body: string): string {
  if (/<[a-z][\s\S]*>/i.test(body)) return body
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (p.startsWith('http://') || p.startsWith('https://')) {
        return `<p style="margin:0 0 12px;text-align:center;"><a href="${p}" style="display:inline-block;background:#244023;color:#fdfaf2;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:600;font-size:14px;">Continue</a></p>`
      }
      return `<p style="margin:0 0 12px;color:#6b665a;font-size:15px;line-height:1.6;">${p.replace(/\n/g, '<br/>')}</p>`
    })
    .join('')
}
