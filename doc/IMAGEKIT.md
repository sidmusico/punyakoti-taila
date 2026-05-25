# ImageKit integration

Every Media doc in Payload is backed by a file on [ImageKit](https://imagekit.io). The storefront reads images straight from `ik.imagekit.io`; the Payload admin still works the way it always did.

This doc covers:

1. [Environment setup](#1-environment-setup)
2. [How the pieces fit together](#2-how-the-pieces-fit-together)
3. [Day-to-day workflows](#3-day-to-day-workflows)
4. [API endpoints](#4-api-endpoints)
5. [CLI commands](#5-cli-commands)
6. [Folder picker behaviour](#6-folder-picker-behaviour)
7. [Homepage image slots](#7-homepage-image-slots)
8. [Troubleshooting](#8-troubleshooting)
9. [File reference](#9-file-reference)

> Companion doc: [SEED_APIS.md](./SEED_APIS.md) covers the broader seed pipeline; ImageKit is one step inside it.

---

## 1. Environment setup

Add these to `.env` (placeholders live in `.env.example`):

```bash
# ImageKit dashboard → Developer Options → API Keys
IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxxxxxxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<your-imagekit-id>
IMAGEKIT_FOLDER=/punyakoti-taila
```

- `IMAGEKIT_FOLDER` is the **project root** inside your ImageKit account. Every upload from Payload, every file listed by the sync, and every URL stored on a Media doc lives under this prefix. Always starts with `/`.
- `IMAGEKIT_URL_ENDPOINT` should **not** have a trailing slash — the code adds it.
- `IMAGEKIT_PRIVATE_KEY` is server-only; it never reaches the browser.

The cloud-storage plugin gates itself on `IMAGEKIT_PRIVATE_KEY && IMAGEKIT_URL_ENDPOINT`. If either is missing, the Media collection falls back to local-disk uploads (`public/media`) silently — handy for offline dev.

---

## 2. How the pieces fit together

```
┌──────────────────────┐    upload buffer    ┌────────────────┐
│ Payload admin form   │ ─────────────────▶  │   ImageKit     │
│ (Media collection)   │                     │  (CDN + DAM)   │
└──────────┬───────────┘                     └────────┬───────┘
           │                                          │
           │  Media doc                               │
           ▼                                          │
┌──────────────────────┐                              │
│ Postgres (Payload)   │◀─── upsert by alt ───────────┘
│ • imagekitFileId     │                              ▲
│ • imagekitFilePath   │                              │
│ • imagekitUrl        │                              │
│ • url (= ik URL)     │                              │
└──────────┬───────────┘                              │
           │                                          │
           ▼                                          │
   storefront <img src="https://ik.imagekit.io/...">  │
                                                      │
   assets/  ───────── pnpm imagekit:list ─────────────┤
   (local)            /api/sync-assets                │
                      /api/seed-imagekit-media        │
```

### The five moving parts

| Layer | What it does | Code |
|-------|--------------|------|
| **SDK client** | One cached `@imagekit/nodejs` instance, plus URL helpers. | [src/lib/imagekit/client.ts](../src/lib/imagekit/client.ts) |
| **Listing** | Walks every folder under `IMAGEKIT_FOLDER` and returns every file. | [src/lib/imagekit/listAll.ts](../src/lib/imagekit/listAll.ts) |
| **Upload / delete** | Buffer → ImageKit; honours folder paths + `overwriteFile`. | [src/lib/imagekit/upload.ts](../src/lib/imagekit/upload.ts) |
| **Cloud-storage adapter** | Plugs into `@payloadcms/plugin-cloud-storage` so admin uploads stream straight to ImageKit; deletes propagate; URLs come from `imagekitUrl`. | [src/plugins/imagekitAdapter.ts](../src/plugins/imagekitAdapter.ts), wired in [src/plugins/index.ts](../src/plugins/index.ts) |
| **Assets sync** | Mirrors local `assets/` to ImageKit and to Payload Media in one shot. | [src/lib/imagekit/syncAssets.ts](../src/lib/imagekit/syncAssets.ts), [src/lib/imagekit/walkAssets.ts](../src/lib/imagekit/walkAssets.ts) |

### Media collection schema

[src/collections/Media.ts](../src/collections/Media.ts) adds four ImageKit-specific fields on top of Payload's standard upload collection:

| Field | Where it shows | Set by |
|-------|----------------|--------|
| `imagekitFolder` | Sidebar, editable | You — sub-folder under `IMAGEKIT_FOLDER`. Type a new name to auto-create on upload. |
| `imagekitFileId` | Sidebar, read-only | Adapter (on upload) / seed (on import). |
| `imagekitFilePath` | Sidebar, read-only | Same as above. |
| `imagekitUrl` | Sidebar, read-only | Same as above. The storefront reads this URL. |

Payload's own `url` field is also overwritten to the ImageKit URL so existing template code (`media.url`) just works.

### URL resolution helper

[src/utilities/mediaUrl.ts](../src/utilities/mediaUrl.ts) exposes `resolveMediaUrl(media)` which prefers `imagekitUrl` over the local `url`. Use it everywhere you read a media relation in components — it tolerates `null`, unpopulated relations (`number | string` ids when `depth: 0`), and missing fields.

---

## 3. Day-to-day workflows

### A) Brand-new dev environment

```bash
# 1. Add IMAGEKIT_* to .env, then:
pnpm cms:sync                        # creates the new ImageKit columns
pnpm imagekit:list                   # writes src/seed/imagekitCatalog.generated.ts
pnpm dev                             # start server
curl http://localhost:3000/api/seed-all
```

`seed-all` runs (in order): media catalog → ImageKit-media → products → pages → globals.

### B) You added new images to ImageKit directly (via their dashboard)

```bash
pnpm imagekit:list                   # refresh the local catalog file
curl http://localhost:3000/api/seed-imagekit-media   # create matching Media docs
```

### C) You dropped files into the local `assets/` folder

This is the everyday workflow. Run **one** command:

```bash
curl -N http://localhost:3000/api/sync-assets
```

It uploads new/changed files to ImageKit **and** upserts Payload Media docs in the same pass. Re-running is safe — byte-identical files are skipped.

`-N` disables curl's buffering so you see live progress.

### D) An admin uploaded a file through the Payload admin

Nothing for you to do — the cloud-storage adapter pushes the buffer to ImageKit, mutates the doc with `imagekitFileId/Path/Url`, and Payload persists. Subsequent reads return the ImageKit URL.

If the admin typed a new folder name in **ImageKit folder**, ImageKit auto-creates the folder during upload. The folder won't appear in the picker's description until the next `pnpm imagekit:list`.

---

## 4. API endpoints

All routes share the same auth as the rest of the seed APIs (open in dev, `?secret=` / `x-cron-secret` in prod — see [SEED_APIS.md](./SEED_APIS.md#auth)).

### `GET /api/sync-assets`

Mirror local `assets/` → ImageKit → Payload Media. **Streams NDJSON progress by default.**

| Query param | Default | Effect |
|-------------|---------|--------|
| `root` | `<repo>/assets` | Sync a different folder. Accepts absolute or relative path. |
| `format` | `ndjson` | Pass `?format=json` to get the legacy single-shot JSON response (waits until done). |

#### Streaming events

```
{"type":"scan-start","assetsRoot":"…"}
{"type":"scan-done","localCount":78,"remoteCount":77}
{"type":"file-start","index":1,"total":78,"relPath":"home/foo.png","size":204800}
{"type":"file-upload","index":1,"total":78,"action":"created"}
{"type":"file-done","index":1,"total":78,"upload":"created","seed":"created","url":"https://…","mediaId":42}
…
{"type":"summary","summary":{ "scanned":78, "uploaded":1, "updated":0, "uploadSkipped":77, "uploadErrors":0, "seeded":1, "seedUpdated":0, "seedSkipped":77, "seedErrors":0 }}
{"type":"done","resultCount":78}
```

Each `file-done` carries:

- `upload`: `created` | `updated` | `skipped` | `error`
- `seed`: `created` | `updated` | `skipped` | `error` | `not-run`
- `url`, `mediaId`, `error` when present.

#### Server console mirror

Same events also print to the `pnpm dev` terminal via [src/lib/imagekit/syncLogger.ts](../src/lib/imagekit/syncLogger.ts):

```
[sync-assets] scanning /…/assets …
[sync-assets] local=78 files · remote=77 files
[sync-assets] (1/78) home/foo.png (200.0 KB)
[sync-assets]   ↑ uploading …
[sync-assets]   + home/foo.png — upload=created seed=created media=42
…
[sync-assets] ────── report ──────
[sync-assets]  scanned   : 78
[sync-assets]  uploaded  : 1 new, 0 replaced, 77 skipped
[sync-assets]  seeded    : 1 new, 0 updated, 77 skipped
[sync-assets] ────────────────────
```

Icon legend: `+` created · `~` replaced · `·` skipped · `✗` error.

#### Idempotency

Files are compared by **byte size** at the same `filePath`. Same size ⇒ skipped (no re-upload, no re-seed). Different size ⇒ uploaded with `overwriteFile: true` and Media doc patched. Missing ⇒ uploaded fresh.

#### Supported file types

Anything ImageKit accepts. The walker recognises common image (png, jpg, webp, gif, avif, svg, …), video (mp4, mov, webm, mkv, …), audio (mp3, wav, ogg), and document (pdf, zip, json, txt, md) extensions. Unknown extensions fall back to `application/octet-stream`. Skipped by the walker: dotfiles (`.DS_Store`, `.claude`, …), `node_modules`, `__MACOSX`, `Thumbs.db`.

### `GET /api/seed-imagekit-media`

Reads `src/seed/imagekitCatalog.generated.ts` and creates a Media doc for each entry it doesn't already have (matched by `alt`). Used for the cold-boot path; if a row already exists with a different `imagekitFileId`, it's patched.

```bash
curl http://localhost:3000/api/seed-imagekit-media | jq
# → { summary: { created, updated, skipped, errors }, results: [...] }
```

### `GET /api/seed-all`

Runs the full seed in order. The ImageKit step is the second one (after the legacy media catalog seed) — see [src/seed/runFullSiteSeed.ts](../src/seed/runFullSiteSeed.ts).

### `GET /api/media/imagekit/folders` (admin only)

Returns folder paths (relative to `IMAGEKIT_FOLDER`) for use in a future custom folder-picker UI. Requires an authenticated session — not exposed publicly.

### `POST /api/media/imagekit/folders` (admin only)

Body: `{ "path": "products/new-collection" }`. Creates the folder in ImageKit; auto-creates parents.

---

## 5. CLI commands

| Command | What it does |
|---------|--------------|
| `pnpm imagekit:list` | Calls the ImageKit API, walks every folder under `IMAGEKIT_FOLDER`, and writes [src/seed/imagekitCatalog.generated.ts](../src/seed/imagekitCatalog.generated.ts). Re-run whenever you upload files via the ImageKit dashboard so the seed pipeline and the Media folder picker description stay in sync. |
| `pnpm cms:sync` | Regenerates Payload types + importmap, then runs Drizzle push to materialise the new `imagekitFolder/FileId/FilePath/Url` columns. |

The listing script lives at [scripts/listImageKit.ts](../scripts/listImageKit.ts).

---

## 6. Folder picker behaviour

The **ImageKit folder** field on Media is a plain text input with an `admin.description` listing every existing sub-folder (read from the generated catalog at config-load time):

> *Sub-folder under /punyakoti-taila. Type a new name to create it on upload. Existing: brand, collections, gifting, home, ingredients, process, products, products/achaar-pickles, …*

Behaviour:

1. **Empty value** → file uploads to `IMAGEKIT_FOLDER` itself (project root).
2. **Existing folder name** (e.g. `home`) → uploads to `<root>/home/<filename>`.
3. **New folder name** (e.g. `campaigns/diwali-2025`) → ImageKit auto-creates the folder hierarchy on upload (`useUniqueFileName: false` + folder path); no separate "create folder" call needed.

The picker description refreshes the next time anyone runs `pnpm imagekit:list`.

> **Want a real dropdown / autocomplete UI?** The endpoints at `/api/media/imagekit/folders` are ready — wire them into a custom React field component when needed. Out of scope for v1.

---

## 7. Homepage image slots

Five image relations were added to the Homepage global ([src/globals/HomepageSettings/tabFields.ts](../src/globals/HomepageSettings/tabFields.ts)):

| Tab | Field | Default seed → ImageKit alt |
|-----|-------|------------------------------|
| Hero — Cinematic | `cinematic.image` | `home/hero-04-bottles-ingredients` |
| Hero — Editorial | `hero.image` | `home/hero-05-warm-golden-bottle` |
| Tradition | `tradition.image` | `process/traditional-ghani-village` |
| Process — steps | `processSteps.bannerImage` + per-step `steps[].image` | `process/ghana-press-oil-flowing` |
| Process — stats banner | `processSection.backgroundImage` | `process/wood-press-machine-moody` |

Each field is **optional**. Components fall back to the existing SVG/CSS treatment when no image is set ([src/utilities/mediaUrl.ts](../src/utilities/mediaUrl.ts) returns `null` and the component renders the SVG instead). Defaults are wired by [src/seed/runHomepageTabSeed.ts](../src/seed/runHomepageTabSeed.ts) using `alt` lookups — missing media is silently skipped, so the seed still works on a fresh DB without ImageKit.

Want to add a slot to a different section? Two-step:

1. Add the upload field in [tabFields.ts](../src/globals/HomepageSettings/tabFields.ts), e.g.:
   ```ts
   { name: 'image', type: 'upload', relationTo: 'media' }
   ```
2. Read it in the component via `resolveMediaUrl(props.image)`.

Then `pnpm cms:sync` and reload.

---

## 8. Troubleshooting

### `[imagekit] Missing IMAGEKIT_PRIVATE_KEY / IMAGEKIT_URL_ENDPOINT in env.`

`.env` is missing keys. Set them and restart `pnpm dev`. Note: Next.js does **not** auto-reload env vars in running processes.

### Storefront images don't load

Check `next.config.ts` — `ik.imagekit.io` must be in `images.remotePatterns`. Already there as of this integration; double-check if you've forked.

### "InvalidImageRequest" from `<Image>`

You hit a doc whose `url` is still local (`/media/foo.png`) because the cloud-storage plugin was disabled when the doc was created. Re-upload through the admin or run `/api/sync-assets`. Or set `disableLocalStorage: true` in [src/plugins/index.ts](../src/plugins/index.ts) once you're confident every doc has an `imagekitUrl`.

### Seed re-uploads files I didn't change

The seed compares by `alt` then by `imagekitFileId`. If `alt` matches but `imagekitFileId` differs, the row is treated as out of sync and patched (no actual re-upload to ImageKit happens — only the Media doc is updated). If you renamed a file in ImageKit, regen the catalog (`pnpm imagekit:list`) so the new `fileId` is the canonical reference.

### `/api/sync-assets` returns 401 in prod

Send `x-cron-secret: $CRON_SECRET` or `?secret=$CRON_SECRET`. In dev it's open.

### Sync hangs on a single big file

`maxDuration = 300` (5 minutes) is set on the route for serverless platforms. For very large videos, raise it or stream the file rather than buffering into memory — `uploadBufferToImageKit` currently does a `fs.readFile` of the whole file.

### A file was deleted locally but is still on ImageKit (and in Payload)

`/api/sync-assets` does **not** delete remote files — only adds/updates. Delete them via the ImageKit dashboard (and the matching Media doc in Payload admin), or build a `?prune=true` mode (not implemented).

### Lint command fails with "Converting circular structure to JSON"

Pre-existing ESLint config bug (`eslint-plugin-react` circular reference), unrelated to ImageKit. Type-check (`pnpm tsc --noEmit`) is the reliable check.

---

## 9. File reference

### New files

| Path | Purpose |
|------|---------|
| [src/lib/imagekit/client.ts](../src/lib/imagekit/client.ts) | Cached SDK client + URL helpers. |
| [src/lib/imagekit/listAll.ts](../src/lib/imagekit/listAll.ts) | Recursive folder walker for ImageKit. |
| [src/lib/imagekit/upload.ts](../src/lib/imagekit/upload.ts) | `uploadBufferToImageKit`, `deleteFromImageKit`. |
| [src/lib/imagekit/folders.ts](../src/lib/imagekit/folders.ts) | List + create sub-folders. |
| [src/lib/imagekit/walkAssets.ts](../src/lib/imagekit/walkAssets.ts) | Local filesystem walker for `assets/`. |
| [src/lib/imagekit/syncAssets.ts](../src/lib/imagekit/syncAssets.ts) | Diff local ↔ remote, upload, upsert Media. |
| [src/lib/imagekit/syncLogger.ts](../src/lib/imagekit/syncLogger.ts) | Pretty console formatter for sync events. |
| [src/plugins/imagekitAdapter.ts](../src/plugins/imagekitAdapter.ts) | Cloud-storage adapter. |
| [src/endpoints/imagekitFolders.ts](../src/endpoints/imagekitFolders.ts) | `GET/POST /api/media/imagekit/folders`. |
| [src/seed/imagekitCatalog.generated.ts](../src/seed/imagekitCatalog.generated.ts) | **Generated** by `pnpm imagekit:list`. Do not hand-edit. |
| [src/seed/runImageKitMediaSeed.ts](../src/seed/runImageKitMediaSeed.ts) | Idempotent seed from generated catalog → Payload Media. |
| [src/app/api/sync-assets/route.ts](../src/app/api/sync-assets/route.ts) | `GET /api/sync-assets` (NDJSON stream). |
| [src/app/api/seed-imagekit-media/route.ts](../src/app/api/seed-imagekit-media/route.ts) | `GET /api/seed-imagekit-media`. |
| [src/utilities/mediaUrl.ts](../src/utilities/mediaUrl.ts) | `resolveMediaUrl`, `resolveMediaAlt`, `resolveMediaSize`. |
| [scripts/listImageKit.ts](../scripts/listImageKit.ts) | `pnpm imagekit:list`. |

### Touched files

| Path | Change |
|------|--------|
| [src/collections/Media.ts](../src/collections/Media.ts) | Added `imagekitFolder` field + endpoint registration. |
| [src/plugins/index.ts](../src/plugins/index.ts) | Registered `cloudStoragePlugin` with the ImageKit adapter. |
| [src/payload.config.ts](../src/payload.config.ts) | (No change — plugins are wired via `src/plugins/index.ts`.) |
| [src/seed/seedMediaUpload.ts](../src/seed/seedMediaUpload.ts) | Added `fetchRemoteFileAnyShape` that preserves video/PDF mime types. |
| [src/seed/runFullSiteSeed.ts](../src/seed/runFullSiteSeed.ts) | Inserted `imagekit-media` step after the legacy media seed. |
| [src/seed/runHomepageTabSeed.ts](../src/seed/runHomepageTabSeed.ts) | Default homepage image slots to ImageKit assets by `alt` lookup. |
| [src/globals/HomepageSettings/tabFields.ts](../src/globals/HomepageSettings/tabFields.ts) | Added image upload fields to 5 sections. |
| [src/components/home/HomePageView.tsx](../src/components/home/HomePageView.tsx) | Threads `image` props through. |
| `src/components/home/Home{HeroCinematic,HeroEditorial,TraditionSection,ProcessSection,ProcessBannerSection}.tsx` | Read media via `resolveMediaUrl`, fall back to SVG/CSS when empty. |
| [next.config.ts](../next.config.ts) | Added `ik.imagekit.io` to `images.remotePatterns`. |
| [package.json](../package.json) | Added `imagekit:list` script; deps `@imagekit/nodejs`, `@payloadcms/plugin-cloud-storage`. |
| [.env.example](../.env.example) | Documented `IMAGEKIT_*` placeholders. |
