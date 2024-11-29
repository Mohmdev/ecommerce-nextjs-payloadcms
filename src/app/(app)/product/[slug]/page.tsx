import { RenderBlocks } from '@/blocks/RenderBlocks'
import { GridTileImage } from '@/components/grid/tile'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Suspense, cache } from 'react'
import ProductPageClient from './page.client'

import type { Media, Product } from '@/payload-types'

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 2,
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug
      }
    }
  })

  return result.docs?.[0] || null
})

export default async function ProductPage({
  params: paramsPromise
}: {
  params: Promise<{
    slug: string
  }>
}) {
  const { slug } = await paramsPromise
  const product = (await queryProductBySlug({ slug })) as Product

  if (!product) return notFound()

  const variants = product.enableVariants ? product.variants?.variants : []

  const metaImage = (
    typeof product.meta?.image !== 'string' ? product.meta?.image : undefined
  ) as Media

  const hasStock = product.enableVariants
    ? variants?.some((variant) => variant?.stock > 0)
    : product.stock! > 0

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: typeof metaImage === 'object' ? metaImage?.url : undefined,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      price: product.price,
      priceCurrency: product.currency
    }
  }

  const relatedProducts = (product.relatedProducts?.filter(
    (relatedProduct) => typeof relatedProduct !== 'string'
  ) ?? []) as Product[]

  // const gallery = product.gallery
  //   ?.filter((image) => Boolean(image.image && typeof image.image !== 'string'))
  //   .map((image) => {
  //     if (image.image && typeof image.image !== 'string') return image.image
  //   }) as Media[]

  const gallery = product.gallery?.filter((item): item is Media => {
    return typeof item !== 'number' && item !== null
  })

  if (variants?.length) {
    variants.forEach((variant) => {
      if (variant?.images?.length) {
        const variantImages = variant.images.filter((item): item is Media => {
          return typeof item !== 'number' && item !== null
        })
        gallery?.push(...variantImages)
      }
    })
  }

  return (
    <React.Fragment>
      <ProductPageClient />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
        type="application/ld+json"
      />
      <div className="container">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:py-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              {gallery?.length && <Gallery images={gallery} />}
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} />
          </div>
        </div>
      </div>

      {product.layout && <RenderBlocks blocks={product.layout} />}

      {relatedProducts.length && (
        <div className="container">
          <RelatedProducts products={relatedProducts as Product[]} />
        </div>
      )}
    </React.Fragment>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {products.map((product) => (
          <li
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            key={product.id}
          >
            <Link
              href={`/product/${product.slug}`}
              className="relative h-full w-full"
            >
              <GridTileImage
                label={{
                  amount: product.price!,
                  currencyCode: product.currency!,
                  title: product.title
                }}
                media={product.meta?.image as Media}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// import type { Metadata } from 'next'
// import { HIDDEN_PRODUCT_TAG } from '@/lib/constants'

/* export async function generateMetadata({
  params,
}: {
  params: { handle: string }
}): Promise<Metadata> {
  const product = await queryProductBySlug(params.handle)

  if (!product) return notFound()

  const { altText: alt, height, url, width } = product.featuredImage || {}
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG)

  return {
    description: product.seo.description || product.description,
    openGraph: url
      ? {
          images: [
            {
              alt,
              height,
              url,
              width,
            },
          ],
        }
      : null,
    robots: {
      follow: indexable,
      googleBot: {
        follow: indexable,
        index: indexable,
      },
      index: indexable,
    },
    title: product.seo.title || product.title,
  }
} */
