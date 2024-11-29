import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import type { Plugin } from 'payload'
import { formBuilderPluginConfig } from './formBuilder'
import { nestedDocsPluginConfig } from './nestedDocs'
import { redirectsPluginConfig } from './redirects'
import { s3StoragePlugin } from './s3Storage'
import { searchPluginConfig } from './search'
import { seoPluginConfig } from './seo'
import { stripePluginConfig } from './stripe'

export const plugins: Plugin[] = [
  s3StoragePlugin,
  redirectsPluginConfig,
  nestedDocsPluginConfig,
  searchPluginConfig,
  formBuilderPluginConfig,
  seoPluginConfig,
  stripePluginConfig,
  payloadCloudPlugin()
]
