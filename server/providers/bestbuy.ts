import type { Product } from '../../src/types'
import {
  inferCategory,
  inferColors,
  inferOccasions,
  inferTags,
} from '../../src/lib/inferProduct'

export function bestBuyConfigured(env: Record<string, string>): boolean {
  return Boolean(env.BESTBUY_API_KEY)
}

interface BestBuyProduct {
  sku: number
  name: string
  salePrice: number
  regularPrice?: number
  manufacturer?: string
  shortDescription?: string
  customerReviewAverage?: number | null
  customerReviewCount?: number | null
  image?: string
  url?: string
  categoryPath?: Array<{ name: string }>
  onlineAvailability?: boolean
}

export async function searchBestBuy(
  env: Record<string, string>,
  opts: {
    q: string
    minPrice: number | null
    maxPrice: number | null
    limit: number
  },
): Promise<Product[]> {
  const key = env.BESTBUY_API_KEY
  const q = opts.q.replace(/"/g, ' ')
  const parts = [`(search=${q})`]

  // Best Buy uses USD; keep price filters when present
  if (opts.minPrice !== null) parts.push(`salePrice>=${opts.minPrice}`)
  if (opts.maxPrice !== null) parts.push(`salePrice<=${opts.maxPrice}`)

  const query = parts.length > 1 ? parts.join('&') : parts[0]
  const params = new URLSearchParams({
    format: 'json',
    apiKey: key,
    pageSize: String(Math.min(opts.limit, 40)),
    show: [
      'sku',
      'name',
      'salePrice',
      'regularPrice',
      'manufacturer',
      'shortDescription',
      'customerReviewAverage',
      'customerReviewCount',
      'image',
      'url',
      'categoryPath',
      'onlineAvailability',
    ].join(','),
  })

  const res = await fetch(
    `https://api.bestbuy.com/v1/products${query}?${params}`,
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Best Buy search failed (${res.status}): ${text.slice(0, 200)}`)
  }

  const data = (await res.json()) as { products?: BestBuyProduct[] }

  return (data.products ?? []).map((p): Product => {
    const blob = `${p.name} ${p.shortDescription ?? ''} ${p.categoryPath?.map((c) => c.name).join(' ') ?? ''}`
    return {
      id: `bestbuy-${p.sku}`,
      name: p.name,
      brand: p.manufacturer || 'Best Buy',
      category: inferCategory(blob, 'electronics'),
      colors: inferColors(blob),
      price: p.salePrice,
      originalPrice:
        p.regularPrice && p.regularPrice > p.salePrice
          ? p.regularPrice
          : undefined,
      currency: 'USD',
      occasions: inferOccasions(blob),
      tags: inferTags(blob),
      sizes: [],
      rating: p.customerReviewAverage ?? 4,
      reviewCount: p.customerReviewCount ?? 0,
      imageUrl: p.image || '',
      productUrl: p.url,
      description: p.shortDescription || p.name,
      inStock: p.onlineAvailability !== false,
      source: 'bestbuy',
    }
  })
}
