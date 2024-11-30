import { slugField } from '@/fields/slug'
import type { Field } from 'payload'

export const sidebarFields: Field[] = [
  // Slug
  ...slugField(),
  // Published At
  {
    name: 'publishedAt',
    type: 'date',
    admin: {
      date: {
        pickerAppearance: 'dayAndTime'
      },
      position: 'sidebar'
    }
  },
  // Categories
  {
    name: 'categories',
    type: 'relationship',
    admin: {
      position: 'sidebar',
      sortOptions: 'title'
    },
    hasMany: true,
    relationTo: 'categories'
  },
  // Related Products
  {
    name: 'relatedProducts',
    type: 'relationship',
    filterOptions: ({ id }) => {
      return {
        id: {
          not_in: [id]
        }
      }
    },
    hasMany: true,
    relationTo: 'products',
    admin: {
      position: 'sidebar'
    }
  },
  // Skip Sync
  {
    name: 'skipSync',
    type: 'checkbox',
    admin: {
      // hidden: true,
      position: 'sidebar',
      readOnly: true
    },
    label: 'Skip Sync'
  }
]
