import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'

export const redirectsPluginConfig = redirectsPlugin({
  collections: ['pages', 'products'],
  overrides: {
    // @ts-expect-error
    fields: ({ defaultFields }) => {
      return defaultFields.map((field) => {
        if ('name' in field && field.name === 'from') {
          return {
            ...field,
            admin: {
              description:
                'You will need to rebuild the website when changing this field.'
            }
          }
        }
        return field
      })
    },
    hooks: {
      afterChange: [revalidateRedirects]
    }
  }
})
