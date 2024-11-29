import { beforeSyncWithSearch } from '@/search/beforeSync'
import { searchFields } from '@/search/fieldOverrides'
import { searchPlugin } from '@payloadcms/plugin-search'

export const searchPluginConfig = searchPlugin({
  collections: ['products'],
  beforeSync: beforeSyncWithSearch,
  searchOverrides: {
    fields: ({ defaultFields }) => {
      return [...defaultFields, ...searchFields]
    }
  }
})
