import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { imagekitFolderEndpoints } from '../endpoints/imagekitFolders'
import { IMAGEKIT_FOLDERS, IMAGEKIT_ROOT } from '../seed/imagekitCatalog.generated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const folderRelOptions = IMAGEKIT_FOLDERS.map((f) =>
  f.folderPath.startsWith(`${IMAGEKIT_ROOT}/`) ? f.folderPath.slice(IMAGEKIT_ROOT.length + 1) : f.folderPath,
)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  endpoints: imagekitFolderEndpoints,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'imagekitFolder',
      type: 'text',
      label: 'ImageKit folder',
      admin: {
        position: 'sidebar',
        description: `Sub-folder under ${IMAGEKIT_ROOT}. Type a new name to create it on upload. Existing: ${folderRelOptions.join(', ') || '(none yet)'}`,
      },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 300 },
      { name: 'square', width: 500, height: 500 },
      { name: 'small', width: 600 },
      { name: 'medium', width: 900 },
      { name: 'large', width: 1400 },
      { name: 'xlarge', width: 1920 },
      { name: 'og', width: 1200, height: 630, crop: 'center' },
    ],
  },
}
