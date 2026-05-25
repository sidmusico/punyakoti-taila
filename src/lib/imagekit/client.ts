import ImageKit from '@imagekit/nodejs'

/**
 * Server-only ImageKit client. Throws at access time if env vars are missing so
 * a misconfigured deploy fails loudly instead of silently uploading nowhere.
 */
let cached: ImageKit | null = null

export function getImageKit(): ImageKit {
  if (cached) return cached
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT
  if (!privateKey || !urlEndpoint) {
    throw new Error(
      '[imagekit] Missing IMAGEKIT_PRIVATE_KEY / IMAGEKIT_URL_ENDPOINT in env.',
    )
  }
  // The @imagekit/nodejs server SDK only needs the private key. The public key
  // and URL endpoint are used for client-side / URL building (handled in
  // buildImageKitUrl below).
  cached = new ImageKit({ privateKey })
  return cached
}

/** Root folder inside ImageKit that this project owns. Always starts with `/`. */
export function getImageKitRoot(): string {
  const raw = process.env.IMAGEKIT_FOLDER || '/'
  const trimmed = raw.replace(/\/+$/, '')
  return trimmed.startsWith('/') ? trimmed || '/' : `/${trimmed}`
}

export function getImageKitUrlEndpoint(): string {
  const raw = process.env.IMAGEKIT_URL_ENDPOINT || ''
  return raw.replace(/\/+$/, '')
}

/** Build a public URL for a given ImageKit `filePath` (which already starts with `/`). */
export function buildImageKitUrl(filePath: string): string {
  const endpoint = getImageKitUrlEndpoint()
  const path = filePath.startsWith('/') ? filePath : `/${filePath}`
  return `${endpoint}${path}`
}
