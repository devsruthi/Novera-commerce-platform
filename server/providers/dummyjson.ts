import type { Category, Product } from '../../src/types'
import {
  inferCategory,
  inferColors,
  inferOccasions,
  inferTags,
} from '../../src/lib/inferProduct'

interface DummyProduct {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage?: number
  rating: number
  stock: number
  brand?: string
  tags?: string[]
  thumbnail: string
  images?: string[]
  availabilityStatus?: string
}

const CATEGORY_MAP: Partial<Record<Category, string[]>> = {
  dresses: ['womens-dresses'],
  tops: ['tops', 'womens-tops', 'mens-shirts'],
  bottoms: ['womens-dresses', 'tops'],
  outerwear: ['tops', 'mens-shirts'],
  shoes: ['womens-shoes', 'mens-shoes'],
  accessories: ['womens-bags', 'sunglasses', 'womens-jewellery', 'mens-watches'],
  electronics: ['smartphones', 'laptops', 'tablets', 'mobile-accessories'],
  other: ['womens-dresses', 'tops'],
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`DummyJSON failed (${res.status})`)
  return (await res.json()) as T
}

function mapDummy(p: DummyProduct): Product {
  const blob = `${p.title} ${p.description} ${p.category} ${(p.tags ?? []).join(' ')}`
  const original =
    p.discountPercentage && p.discountPercentage > 0
      ? Number((p.price / (1 - p.discountPercentage / 100)).toFixed(2))
      : undefined

  return {
    id: `dummy-${p.id}`,
    name: p.title,
    brand: p.brand || 'DummyJSON',
    category: inferCategory(blob, mapCategorySlug(p.category)),
    colors: inferColors(blob),
    price: p.price,
    originalPrice: original && original > p.price ? original : undefined,
    currency: 'EUR',
    occasions: inferOccasions(blob),
    tags: [...new Set([...(p.tags ?? []), ...inferTags(blob)])],
    sizes: [],
    rating: p.rating,
    reviewCount: Math.round(p.rating * 40),
    imageUrl: p.thumbnail || p.images?.[0] || '',
    productUrl: `https://dummyjson.com/products/${p.id}`,
    description: p.description,
    inStock: (p.stock ?? 0) > 0 && p.availabilityStatus !== 'Out of Stock',
    source: 'dummyjson',
  }
}

function mapCategorySlug(slug: string): Category {
  if (slug.includes('dress')) return 'dresses'
  if (slug.includes('shoe')) return 'shoes'
  if (slug.includes('bag') || slug.includes('watch') || slug.includes('sunglass') || slug.includes('jewellery')) {
    return 'accessories'
  }
  if (slug.includes('shirt') || slug.includes('top')) return 'tops'
  if (slug.includes('phone') || slug.includes('laptop') || slug.includes('tablet')) {
    return 'electronics'
  }
  return 'other'
}

export async function searchDummyJson(opts: {
  q: string
  categories: Category[]
  minPrice: number | null
  maxPrice: number | null
  limit: number
}): Promise<Product[]> {
  const categorySlugs = [
    ...new Set(
      (opts.categories.length ? opts.categories : (['dresses', 'tops', 'shoes', 'accessories'] as Category[]))
        .flatMap((c) => CATEGORY_MAP[c] ?? ['womens-dresses']),
    ),
  ].slice(0, 4)

  type DummyList = { products?: DummyProduct[] }

  const requests = [
    fetchJson<DummyList>(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(opts.q || 'dress')}&limit=30`,
    ),
    ...categorySlugs.map((slug) =>
      fetchJson<DummyList>(
        `https://dummyjson.com/products/category/${slug}?limit=20`,
      ),
    ),
  ]

  const settled = await Promise.allSettled(requests)
  const byId = new Map<number, DummyProduct>()

  for (const result of settled) {
    if (result.status !== 'fulfilled') continue
    for (const p of result.value.products ?? []) byId.set(p.id, p)
  }

  let products = [...byId.values()].map(mapDummy)

  if (opts.minPrice !== null) {
    products = products.filter((p) => p.price >= opts.minPrice!)
  }
  if (opts.maxPrice !== null) {
    products = products.filter((p) => p.price <= opts.maxPrice!)
  }

  return products.slice(0, opts.limit)
}
