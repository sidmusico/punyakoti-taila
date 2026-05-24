import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Reviews } from './collections/Reviews'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { AccountSettings } from './globals/AccountSettings'
import { CartSettings } from './globals/CartSettings'
import { HomepageSettings } from './globals/HomepageSettings'
import { OrderSuccessSettings } from './globals/OrderSuccessSettings'
import { ProductDetail } from './globals/ProductDetail'
import { ShopListing } from './globals/ShopListing'
import { SiteSettings } from './globals/SiteSettings'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Dev schema push uses Drizzle Kit; ambiguous enum/table diffs open interactive prompts.
    // Without a TTY (Next dev), that can hang every request — set PAYLOAD_DISABLE_DB_PUSH=true
    // then run `supabase db reset` once and clear that var so a clean push can run.
    push:
      process.env.NODE_ENV !== 'production' &&
      process.env.PAYLOAD_DISABLE_DB_PUSH !== 'true',
  }),
  collections: [Pages, Posts, Media, Categories, Users, Products, Orders, Reviews, Testimonials],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [
    Header,
    Footer,
    SiteSettings,
    HomepageSettings,
    ShopListing,
    ProductDetail,
    CartSettings,
    AccountSettings,
    OrderSuccessSettings,
  ],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
