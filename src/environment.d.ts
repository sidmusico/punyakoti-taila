declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      /** Set to `true` to skip Drizzle dev push (avoids interactive prompts blocking Next dev). */
      PAYLOAD_DISABLE_DB_PUSH?: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      SUPABASE_SERVICE_ROLE_KEY?: string
      CRON_SECRET?: string
      PREVIEW_SECRET?: string
      IMAGEKIT_PUBLIC_KEY: string
      IMAGEKIT_PRIVATE_KEY: string
      IMAGEKIT_URL_ENDPOINT: string
      IMAGEKIT_FOLDER?: string
      RAZORPAY_KEY_ID?: string
      RAZORPAY_KEY_SECRET?: string
      RESEND_API_KEY?: string
      RESEND_AUDIENCE_ID?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
