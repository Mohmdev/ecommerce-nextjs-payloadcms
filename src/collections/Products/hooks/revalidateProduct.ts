import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook } from 'payload'

export const revalidateProduct: CollectionAfterChangeHook = ({
  doc,
  req: { payload }
}) => {
  if (doc._status === 'published') {
    const path = `/products/${doc.slug}`
    payload.logger.info(`Revalidating product at path: ${path}`)
    revalidatePath(path)
  }

  return doc
}
