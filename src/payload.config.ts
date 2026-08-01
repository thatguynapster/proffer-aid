import path from 'path'
import { fileURLToPath } from 'url'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Campaigns } from './collections/Campaigns'
import { Donations } from './collections/Donations'
import { FormSubmissions } from './collections/FormSubmissions'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { TeamMembers } from './collections/TeamMembers'
import { Testimonials } from './collections/Testimonials'
import { Updates } from './collections/Updates'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Media must not touch the local filesystem — Vercel's is ephemeral, so
// uploads written to disk vanish on the next deploy (PRD §9). The S3 adapter
// is only registered when configured, so local development still works before
// bucket credentials exist.
const s3Configured = Boolean(
  process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY,
)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Proffer Aid',
      icons: [{ rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' }],
    },
    components: {
      beforeDashboard: ['/components/admin/DashboardPanel#DashboardPanel'],
      graphics: {
        // Paths resolve against `importMap.baseDir` above (src/), not the
        // tsconfig `@/` alias — the import-map generator does not read those.
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
    },
  },

  collections: [
    Pages,
    Updates,
    Campaigns,
    TeamMembers,
    Testimonials,
    Media,
    FormSubmissions,
    Donations,
    Users,
  ],

  globals: [SiteSettings],

  editor: lexicalEditor(),

  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,

  sharp,

  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@profferaid.com',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Proffer Aid International Foundation',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,

  plugins: [
    ...(s3Configured
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.S3_BUCKET!,
            config: {
              region: process.env.S3_REGION,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
              },
              ...(process.env.S3_ENDPOINT
                ? { endpoint: process.env.S3_ENDPOINT, forcePathStyle: true }
                : {}),
            },
          }),
        ]
      : []),
  ],
})
