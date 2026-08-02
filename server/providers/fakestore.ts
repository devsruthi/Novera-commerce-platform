import type { Category, Product } from '../../src/types'
import {
  inferCategory,
  inferColors,
  inferOccasions,
  inferSizes,
  inferTags,
} from '../../src/lib/inferProduct'

interface FakeStoreProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating?: { rate: number; count: number }
}

const FAKE_CATEGORY_MAP: Partial<Record<Category, string[]>> = {
  dresses: ["women's clothing"],
  tops: ["women's clothing", "men's clothing"],
  bottoms: ["women's clothing", "men's clothing"],
  outerwear: ["women's clothing", "men's clothing"],
  accessories: ['jewelery'],
  electronics: ['electronics'],
  shoes: ["men's clothing", "women's clothing"],
  other: ["women's clothing", "men's clothing"],
}

export function mapFake(p: FakeStoreProduct): Product {
  const blob = `${p.title} ${p.description} ${p.category}`
  const fallback: Category = p.category.includes('electronics')
    ? 'electronics'
    : p.category.includes('jewel')
      ? 'accessories'
      : p.category.includes("women")
        ? 'tops'
        : 'other'

  const category = inferCategory(blob, fallback)
  // FakeStore has no inventory — derive a stable stock signal from id + rating volume
  const stockCount = Math.max(
    0,
    ((p.id * 7 + Math.round((p.rating?.count ?? 0) / 50)) % 14) - 1,
  )

  return {
    id: `fake-${p.id}`,
    name: p.title,
    brand: 'FakeStore',
    category,
    colors: inferColors(blob),
    price: p.price,
    currency: 'EUR',
    occasions: inferOccasions(blob),
    tags: inferTags(blob),
    sizes: inferSizes(category),
    rating: p.rating?.rate ?? 4,
    reviewCount: p.rating?.count ?? 0,
    imageUrl: p.image,
    productUrl: `https://fakestoreapi.com/products/${p.id}`,
    description: p.description,
    inStock: stockCount > 0,
    stockCount,
    source: 'fakestore',
  }
}

async function fetchProducts(path = '/products'): Promise<FakeStoreProduct[]> {
  const res = await fetch(`https://fakestoreapi.com${path}`)
  if (!res.ok) throw new Error(`FakeStoreAPI failed (${res.status})`)
  return (await res.json()) as FakeStoreProduct[]
}

export async function searchFakeStore(opts: {
  q: string
  minPrice: number | null
  maxPrice: number | null
  limit: number
  start?: number
  categories?: Category[]
}): Promise<{ products: Product[]; hasMore: boolean; nextStart: number | null }> {
  const categorySlugs = [
    ...new Set(
      (opts.categories?.length
        ? opts.categories
        : (['tops', 'accessories', 'electronics'] as Category[])
      ).flatMap((c) => FAKE_CATEGORY_MAP[c] ?? ["women's clothing"]),
    ),
  ].slice(0, 3)

  const requests = [
    fetchProducts('/products'),
    ...categorySlugs.map((slug) =>
      fetchProducts(`/products/category/${encodeURIComponent(slug)}`),
    ),
  ]

  const settled = await Promise.allSettled(requests)
  const byId = new Map<number, FakeStoreProduct>()
  for (const result of settled) {
    if (result.status !== 'fulfilled') continue
    for (const p of result.value) byId.set(p.id, p)
  }

  let products = [...byId.values()].map(mapFake)

  const words = opts.q
    .toLowerCase()
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 2 &&
        !['the', 'and', 'for', 'under', 'need', 'with'].includes(w),
    )

  if (words.length) {
    const scored = products
      .map((p) => {
        const blob = `${p.name} ${p.description} ${p.category}`.toLowerCase()
        const hits = words.filter((w) => blob.includes(w)).length
        return { p, hits }
      })
      .sort((a, b) => b.hits - a.hits)

    // Prefer matches, but keep catalog if query is too specific for FakeStore
    const matched = scored.filter((x) => x.hits > 0).map((x) => x.p)
    products = matched.length ? matched : scored.map((x) => x.p)
  }

  if (opts.minPrice !== null) {
    products = products.filter((p) => p.price >= opts.minPrice!)
  }
  if (opts.maxPrice !== null) {
    products = products.filter((p) => p.price <= opts.maxPrice!)
  }

  const start = Math.max(0, opts.start ?? 0)
  const page = products.slice(start, start + opts.limit)
  const nextStart = start + page.length
  const hasMore = nextStart < products.length

  return {
    products: page,
    hasMore,
    nextStart: hasMore ? nextStart : null,
  }
}
