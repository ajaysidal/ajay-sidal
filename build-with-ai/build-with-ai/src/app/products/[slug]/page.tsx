import type { Metadata } from 'next'
import { allProducts } from '@/lib/openprovider-products'
import { notFound } from 'next/navigation'
import ClientProductPage from './ClientProductPage'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = allProducts.find((p) => p.slug === params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://buildwithai.digital').replace(/\/$/, '')
  const canonicalUrl = `${siteUrl}/products/${params.slug}`

  return {
    title: `${product.name} | BUILD WITH AI`,
    description: product.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} | BUILD WITH AI`,
      description: product.description,
      url: canonicalUrl,
    },
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ClientProductPage params={params} />
}
