import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { plugins } from './plugins'

import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Orders } from '@/collections/Orders'
import { Pages } from '@/collections/Pages'
import { Products } from '@/collections/Products'
import { Users } from '@/collections/Users'
import { createPaymentIntent } from '@/endpoints/create-payment-intent'
import { customersProxy } from '@/endpoints/customers'
import { productsProxy } from '@/endpoints/products'
import { seed } from '@/endpoints/seed'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  UnderlineFeature,
  lexicalEditor
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

// import { DocumentInfoContext } from '@payloadcms/ui'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export type GenerateTitle2<T = unknown> = (args: {
  doc: T
  locale?: string
}) => Promise<string> | string

export default buildConfig({
  globals: [Footer, Header],
  collections: [Users, Products, Pages, Categories, Media, Orders],
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard']
    },
    user: Users.slug
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI
    }
    // prodMigrations: migrations,
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal'
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true
              }
            ]
          }
        })
      ]
    }
  }),
  email: nodemailerAdapter(),
  endpoints: [
    {
      handler: productsProxy,
      method: 'get',
      path: '/stripe/products'
    },
    {
      handler: createPaymentIntent,
      method: 'post',
      path: '/create-payment-intent'
    },

    {
      handler: customersProxy,
      method: 'get',
      path: '/stripe/customers'
    },
    // The seed endpoint is used to populate the database with some example data
    // You should delete this endpoint before deploying your site to production
    {
      handler: seed,
      method: 'get',
      path: '/seed'
    }
  ],
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET || 'demo-secret',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  }
})
