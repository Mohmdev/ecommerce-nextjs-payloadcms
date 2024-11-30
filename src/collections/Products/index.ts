import { admins } from '@/access/admins'
import { adminsOrPublished } from '@/access/adminsOrPublished'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { getServerSideURL } from '@/utilities/getURL'
import type { CollectionConfig } from 'payload'
import { productFields } from './fields'
import { beforeProductChange } from './hooks/beforeChange'
import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'
import { revalidateProduct } from './hooks/revalidateProduct'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: admins,
    delete: admins,
    read: adminsOrPublished,
    update: admins
  },
  fields: [...productFields],
  admin: {
    defaultColumns: ['title', 'stripeProductID', '_status'],

    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'products'
        })

        return `${getServerSideURL()}${path}`
      }
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'products'
      })

      return `${getServerSideURL()}${path}`
    },
    useAsTitle: 'title'
  },
  hooks: {
    afterChange: [revalidateProduct],
    afterDelete: [deleteProductFromCarts],
    beforeChange: [beforeProductChange, populatePublishedAt]
  },
  versions: {
    drafts: {
      autosave: true
    },
    maxPerDoc: 50
  }
}
