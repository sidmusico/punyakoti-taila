import type { Endpoint, PayloadHandler } from 'payload'

import { createImageKitSubfolder, listImageKitSubfolders } from '@/lib/imagekit/folders'

const listHandler: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const folders = await listImageKitSubfolders()
    return Response.json({ folders })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}

const createHandler: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = (await req.json?.()) as { path?: string } | undefined
  const path = body?.path?.trim()
  if (!path) return Response.json({ error: 'path required' }, { status: 400 })
  try {
    await createImageKitSubfolder(path)
    return Response.json({ ok: true, path })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}

export const imagekitFolderEndpoints: Endpoint[] = [
  { path: '/imagekit/folders', method: 'get', handler: listHandler },
  { path: '/imagekit/folders', method: 'post', handler: createHandler },
]
