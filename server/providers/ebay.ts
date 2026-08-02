import type { Product } from '../../src/types'
import {
  inferCategory,
  inferColors,
  inferOccasions,
  inferTags,
} from '../../src/lib/inferProduct'

interface EbayToken {
  access_token: string
  expires_at: number
}

let cachedToken: EbayToken | null = null

export function ebayConfigured(env: Record<string, string>): boolean {
  return Boolean(env.EBAY_CLIENT_ID && env.EBAY_CLIENT_SECRET)
}

async function getEbayToken(env: Record<string, string>): Promise<string> {
  if (cachedToken && cachedToken.expires_at > Date.now() + 60_000) {
    return cachedToken.access_token
  }

  const credentials = Buffer.from(
    `${env.EBAY_CLIENT_ID}:${env.EBAY_CLIENT_SECRET}`,
  ).toString('base64')

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'https://api.ebay.com/oauth/api_scope',
  })

  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`eBay auth failed (${res.status}): ${text.slice(0, 200)}`)
  }

  const data = (await res.json()) as {
    access_token: string
    expires_in: number
  }

  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }

  return data.access_token
}

interface EbayItem {
  itemId: string
  title: string
  price?: { value: string; currency: string }
  marketingPrice?: {
    originalPrice?: { value: string; currency: string }
  }
  image?: { imageUrl: string }
  thumbnailImages?: Array<{ imageUrl: string }>
  itemWebUrl?: string
  seller?: { username?: string }
  condition?: string
  categories?: Array<{ categoryName?: string }>
}

export async function searchEbay(
  env: Record<string, string>,
  opts: {
    q: string
    minPrice: number | null
    maxPrice: number | null
    limit: number
  },
): Promise<Product[]> {
  const token = await getEbayToken(env)
  const marketplace = env.EBAY_MARKETPLACE_ID || 'EBAY_DE'
  const currency = env.EBAY_CURRENCY || 'EUR'

  const filters: string[] = [`priceCurrency:${currency}`]
  if (opts.minPrice !== null || opts.maxPrice !== null) {
    const min = opts.minPrice ?? 0
    const max = opts.maxPrice ?? ''
    filters.push(`price:[${min}..${max}]`)
  }
  filters.push('conditions:{NEW}')

  const params = new URLSearchParams({
    q: opts.q || 'fashion',
    limit: String(Math.min(opts.limit, 50)),
    filter: filters.join(','),
  })

  const res = await fetch(
    `https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': marketplace,
        'Accept-Language': 'en-GB',
      },
    },
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`eBay search failed (${res.status}): ${text.slice(0, 200)}`)
  }

  const data = (await res.json()) as { itemSummaries?: EbayItem[] }
  const items = data.itemSummaries ?? []

  return items.map((item): Product => {
    const blob = `${item.title} ${item.categories?.map((c) => c.categoryName).join(' ') ?? ''}`
    const price = Number(item.price?.value ?? 0)
    const original = item.marketingPrice?.originalPrice?.value
      ? Number(item.marketingPrice.originalPrice.value)
      : undefined

    return {
      id: `ebay-${item.itemId}`,
      name: item.title,
      brand: item.seller?.username || 'eBay seller',
      category: inferCategory(blob),
      colors: inferColors(blob),
      price,
      originalPrice: original && original > price ? original : undefined,
      currency: item.price?.currency || currency,
      occasions: inferOccasions(blob),
      tags: inferTags(blob),
      sizes: [],
      rating: 4.2,
      reviewCount: 0,
      imageUrl:
        item.image?.imageUrl ||
        item.thumbnailImages?.[0]?.imageUrl ||
        '',
      productUrl: item.itemWebUrl,
      description: item.condition
        ? `${item.title} · ${item.condition}`
        : item.title,
      inStock: true,
      source: 'ebay',
    }
  })
}
