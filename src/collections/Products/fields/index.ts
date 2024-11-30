import type { Field } from 'payload'
import { sidebarFields } from './sidebar'
import { tabsFields } from './tabs'

export const productFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    required: true,
    unique: true,
    index: true
  },
  ...sidebarFields,
  ...tabsFields
]
