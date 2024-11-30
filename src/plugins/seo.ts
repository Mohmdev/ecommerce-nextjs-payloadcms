import { getServerSideURL } from '@/utilities/getURL'
import { seoPlugin } from '@payloadcms/plugin-seo'

import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

const generateTitle: GenerateTitle = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Store` : 'Payload Store'
}

const generateURL: GenerateURL = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const seoPluginConfig = seoPlugin({
  generateTitle,
  generateURL,
  uploadsCollection: 'media'
})
