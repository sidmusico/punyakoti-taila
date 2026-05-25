import path from 'node:path'

import { NextRequest, NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'

import { syncAssetsToImageKit, type AssetSyncEvent } from '@/lib/imagekit/syncAssets'
import { logSyncEvent } from '@/lib/imagekit/syncLogger'
import { isSeedApiAuthorized } from '@/seed/seedApiAuth'

/**
 * One-shot sync: every file under `<repoRoot>/assets/` is pushed to ImageKit
 * (preserving folder structure under $IMAGEKIT_FOLDER), then upserted into
 * the Payload `media` collection.
 *
 * Idempotent — files already on ImageKit with the same byte size are skipped.
 * Modified files are re-uploaded with `overwriteFile: true`. Works for any
 * file type (images, videos, PDFs, etc.).
 *
 * ### Live progress
 * The response is **newline-delimited JSON** (one event per line). `curl`
 * surfaces each line as it arrives. Events:
 *   - {"type":"scan-start", "assetsRoot": "..."}
 *   - {"type":"scan-done", "localCount":78, "remoteCount":77}
 *   - {"type":"file-start", "index":1, "total":78, "relPath":"home/foo.png", "size":12345}
 *   - {"type":"file-upload", "index":1, "total":78, "action":"created"}
 *   - {"type":"file-done", "index":1, "total":78, "upload":"created", "seed":"created", "url":"..."}
 *   - {"type":"summary", "summary":{...}}
 *
 * Pass `?format=json` to get the legacy single-shot response instead.
 *
 * Auth: same as the other seed endpoints (`?secret=` or `x-cron-secret`
 * header, see src/seed/seedApiAuth.ts; logged-in admin sessions also pass).
 *
 * Optional `?root=<absolute-or-relative-path>` overrides the assets folder.
 */
export async function GET(req: NextRequest) {
  if (!isSeedApiAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const rootParam = url.searchParams.get('root')
  const wantsJson = url.searchParams.get('format') === 'json'
  const assetsRoot = rootParam
    ? path.isAbsolute(rootParam)
      ? rootParam
      : path.resolve(process.cwd(), rootParam)
    : path.resolve(process.cwd(), 'assets')

  const payload = await getPayload({ config })

  if (wantsJson) {
    const { results, summary } = await syncAssetsToImageKit({
      payload,
      assetsRoot,
      onEvent: logSyncEvent,
    })
    return NextResponse.json({ assetsRoot, summary, results }, { status: 200 })
  }

  // ── Streaming NDJSON path ────────────────────────────────────────────────
  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (event: AssetSyncEvent) => {
        logSyncEvent(event)
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
      }

      try {
        // Header line so the client knows the run started before any disk I/O.
        write({ type: 'scan-start', assetsRoot })
        const { results } = await syncAssetsToImageKit({
          payload,
          assetsRoot,
          // syncAssetsToImageKit re-emits scan-start; intercept all events here.
          onEvent: (e) => {
            if (e.type === 'scan-start') return // already sent above
            write(e)
          },
        })

        // Final closing payload — useful for clients that just want the rows.
        controller.enqueue(
          encoder.encode(`${JSON.stringify({ type: 'done', resultCount: results.length })}\n`),
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('[sync-assets] fatal:', message)
        controller.enqueue(encoder.encode(`${JSON.stringify({ type: 'fatal', error: message })}\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no', // disable nginx buffering when behind a proxy
    },
  })
}

// Allow long-running uploads on serverless platforms.
export const maxDuration = 300
