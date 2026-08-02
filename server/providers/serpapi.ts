import type { Product } from '../../src/types'
import {
  inferCategory,
  inferColors,
  inferOccasions,
  inferSizes,
  inferTags,
} from '../../src/lib/inferProduct'

interface SerpShoppingItem {
  position?: number
  product_id?: string
  title?: string
  product_link?: string
  link?: string
  source?: string
  price?: string
  extracted_price?: number
  old_price?: string
  extracted_old_price?: number
  rating?: number
  reviews?: number
  /** ~270px Google Shopping list preview — too soft for large cards */
  thumbnail?: string
  thumbnails?: string[]
  /** Same bytes as thumbnail — not higher resolution */
  serpapi_thumbnail?: string
  serpapi_thumbnails?: string[]
  immersive_product_page_token?: string
  snippet?: string
  delivery?: string
}

interface SerpShoppingResponse {
  shopping_results?: SerpShoppingItem[]
  error?: string
  serpapi_pagination?: {
    current?: number
    next?: string
  }
}

interface SerpImmersiveResponse {
  error?: string
  product_results?: {
    thumbnails?: string[]
  }
}

export function serpApiConfigured(env: Record<string, string>): boolean {
  return Boolean(env.SERPAPI_API_KEY?.trim())
}

function buildTbs(minPrice: number | null, maxPrice: number | null): string | null {
  if (minPrice === null && maxPrice === null) return null
  const parts = ['mr:1', 'price:1']
  if (minPrice !== null && Number.isFinite(minPrice)) {
    parts.push(`ppr_min:${Math.max(0, Math.round(minPrice))}`)
  }
  if (maxPrice !== null && Number.isFinite(maxPrice)) {
    parts.push(`ppr_max:${Math.max(0, Math.round(maxPrice))}`)
  }
  return parts.join(',')
}

/** List-view fallback only — Google keeps these intentionally small. */
function pickListImage(item: SerpShoppingItem): string {
  return (
    item.thumbnails?.[0]?.trim() ||
    item.thumbnail?.trim() ||
    item.serpapi_thumbnail?.trim() ||
    ''
  )
}

/**
 * Immersive product thumbnails are typically ~560×840 vs ~270px list thumbs.
 * Costs one SerpAPI credit per product.
 */
async function fetchImmersiveImage(
  apiKey: string,
  pageToken: string,
): Promise<string | null> {
  const params = new URLSearchParams({
    engine: 'google_immersive_product',
    page_token: pageToken,
    api_key: apiKey,
  })
  const res = await fetch(`https://serpapi.com/search.json?${params}`)
  const data = (await res.json()) as SerpImmersiveResponse
  if (!res.ok || data.error) return null
  const thumbs = (data.product_results?.thumbnails ?? [])
    .map((u) => u?.trim())
    .filter(Boolean)
  return thumbs[0] ?? null
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let cursor = 0

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await fn(items[index]!, index)
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, Math.max(items.length, 1)) },
    () => worker(),
  )
  await Promise.all(workers)
  return results
}

function mapItem(
  item: SerpShoppingItem,
  index: number,
  pageStart: number,
  imageUrl: string,
): Product | null {
  const name = item.title?.trim()
  const productUrl = item.product_link || item.link || ''
  if (!name || !imageUrl) return null

  const price =
    typeof item.extracted_price === 'number'
      ? item.extracted_price
      : Number(String(item.price ?? '').replace(/[^0-9.]/g, '')) || 0

  const blob = `${name} ${item.snippet ?? ''} ${item.source ?? ''}`
  const category = inferCategory(blob)
  const brand = item.source?.trim() || 'Google Shopping'
  const stable =
    item.product_id ||
    `${pageStart + (item.position ?? index + 1)}-${name.slice(0, 24)}`

  return {
    id: `serp-${stable}`,
    name,
    brand,
    category,
    colors: inferColors(blob),
    price,
    originalPrice:
      typeof item.extracted_old_price === 'number'
        ? item.extracted_old_price
        : undefined,
    currency: 'EUR',
    occasions: inferOccasions(blob),
    tags: inferTags(blob),
    sizes: inferSizes(category),
    rating: typeof item.rating === 'number' ? item.rating : 0,
    reviewCount: typeof item.reviews === 'number' ? item.reviews : 0,
    imageUrl,
    productUrl: productUrl || undefined,
    description:
      item.snippet?.trim() ||
      [item.delivery, brand].filter(Boolean).join(' · ') ||
      name,
    inStock: true,
    stockCount: 8,
    source: 'serpapi',
  }
}

function parseStartFromNextUrl(nextUrl: string | undefined): number | null {
  if (!nextUrl) return null
  try {
    const u = new URL(nextUrl)
    const start = Number(u.searchParams.get('start'))
    return Number.isFinite(start) ? start : null
  } catch {
    return null
  }
}

function enrichEnabled(env: Record<string, string>): boolean {
  const raw = env.SERPAPI_ENRICH_IMAGES?.trim().toLowerCase()
  if (raw === '0' || raw === 'false' || raw === 'off') return false
  return true
}

export async function searchSerpApiShopping(
  env: Record<string, string>,
  opts: {
    q: string
    minPrice: number | null
    maxPrice: number | null
    limit: number
    start?: number
  },
): Promise<{ products: Product[]; hasMore: boolean; nextStart: number | null }> {
  const apiKey = env.SERPAPI_API_KEY?.trim()
  if (!apiKey) throw new Error('SERPAPI_API_KEY is not configured')

  const start = Math.max(0, opts.start ?? 0)
  const params = new URLSearchParams({
    engine: 'google_shopping',
    q: opts.q || 'fashion',
    api_key: apiKey,
    hl: env.SERPAPI_HL || 'en',
    gl: env.SERPAPI_GL || 'de',
    num: String(Math.min(Math.max(opts.limit, 10), 100)),
    start: String(start),
  })

  const tbs = buildTbs(opts.minPrice, opts.maxPrice)
  if (tbs) params.set('tbs', tbs)

  const res = await fetch(`https://serpapi.com/search.json?${params}`)
  const data = (await res.json()) as SerpShoppingResponse

  if (!res.ok) {
    throw new Error(data.error || `SerpAPI failed (${res.status})`)
  }
  if (data.error) throw new Error(data.error)

  const items = (data.shopping_results ?? []).slice(0, opts.limit)
  const shouldEnrich = enrichEnabled(env)

  const products = (
    await mapPool(items, 6, async (item, index) => {
      let imageUrl = pickListImage(item)
      const token = item.immersive_product_page_token?.trim()

      if (shouldEnrich && token) {
        try {
          const hiRes = await fetchImmersiveImage(apiKey, token)
          if (hiRes) imageUrl = hiRes
        } catch {
          /* keep list thumbnail */
        }
      }

      return mapItem(item, index, start, imageUrl)
    })
  ).filter((p): p is Product => !!p)

  const nextFromUrl = parseStartFromNextUrl(data.serpapi_pagination?.next)
  const hasMore = Boolean(data.serpapi_pagination?.next) || products.length >= opts.limit
  const nextStart =
    nextFromUrl ?? (hasMore && products.length > 0 ? start + products.length : null)

  return {
    products,
    hasMore: hasMore && nextStart !== null && nextStart !== start,
    nextStart: hasMore ? nextStart : null,
  }
}
