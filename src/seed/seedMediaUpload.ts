import type { File } from 'payload'
import type { Payload } from 'payload'

export async function fetchRemoteFilePayloadShape(url: string, basename: string): Promise<File> {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`)
  }
  const rawType = res.headers.get('content-type')?.split(';')[0]?.trim()
  let mimetype =
    rawType && rawType !== 'application/octet-stream' ? rawType : 'image/jpeg'
  if (mimetype === 'image/jpg') mimetype = 'image/jpeg'
  const data = await res.arrayBuffer()
  const buf = Buffer.from(data)
  const extGuess = mimetype.includes('png') ? 'png' : mimetype.includes('webp') ? 'webp' : 'jpeg'
  const safeBase = basename.replace(/[^a-z0-9-]+/gi, '-').replace(/^-|-$/g, '') || 'image'
  const name = `${safeBase}.${extGuess}`
  return {
    name,
    data: buf,
    mimetype,
    size: buf.byteLength,
  }
}

/** Idempotent: match existing media by exact `alt` string. */
export async function ensureMediaByAltAndUrl(
  payload: Payload,
  opts: { alt: string; url: string; basename: string },
): Promise<string | number> {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: opts.alt } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const file = await fetchRemoteFilePayloadShape(opts.url, opts.basename)
  const created = await payload.create({
    collection: 'media',
    data: { alt: opts.alt },
    file,
    overrideAccess: true,
  })
  return created.id
}
