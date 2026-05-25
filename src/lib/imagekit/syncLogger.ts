import type { AssetSyncEvent } from './syncAssets'

function bytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

function statusIcon(upload: string, seed: string): string {
  if (upload === 'error' || seed === 'error') return '✗'
  if (upload === 'created') return '+'
  if (upload === 'updated') return '~'
  return '·' // skipped
}

/**
 * Pretty-prints sync events to the server console. Mirrors the same data the
 * client sees on the streaming NDJSON response, so the dev terminal stays
 * useful even when nobody is watching the HTTP response.
 */
export function logSyncEvent(event: AssetSyncEvent): void {
  switch (event.type) {
    case 'scan-start':
      console.log(`[sync-assets] scanning ${event.assetsRoot} …`)
      break
    case 'scan-done':
      console.log(
        `[sync-assets] local=${event.localCount} files · remote=${event.remoteCount} files`,
      )
      break
    case 'file-start':
      console.log(
        `[sync-assets] (${event.index}/${event.total}) ${event.relPath} (${bytes(event.size)})`,
      )
      break
    case 'file-upload':
      if (event.action !== 'skipped') {
        console.log(`[sync-assets]   ↑ ${event.action === 'created' ? 'uploading' : 'replacing'} …`)
      }
      break
    case 'file-done': {
      const icon = statusIcon(event.upload, event.seed)
      const detail = event.error
        ? `error: ${event.error}`
        : `upload=${event.upload} seed=${event.seed}${event.mediaId ? ` media=${event.mediaId}` : ''}`
      console.log(`[sync-assets]   ${icon} ${event.relPath} — ${detail}`)
      break
    }
    case 'summary':
      console.log('[sync-assets] ────── report ──────')
      console.log(
        `[sync-assets]  scanned   : ${event.summary.scanned}`,
      )
      console.log(
        `[sync-assets]  uploaded  : ${event.summary.uploaded} new, ${event.summary.updated} replaced, ${event.summary.uploadSkipped} skipped${event.summary.uploadErrors ? `, ${event.summary.uploadErrors} errors` : ''}`,
      )
      console.log(
        `[sync-assets]  seeded    : ${event.summary.seeded} new, ${event.summary.seedUpdated} updated, ${event.summary.seedSkipped} skipped${event.summary.seedErrors ? `, ${event.summary.seedErrors} errors` : ''}`,
      )
      console.log('[sync-assets] ────────────────────')
      break
  }
}
