import { getSupabase, trySupabase } from '../lib/supabase'
import type { Category, CatalogResponse, Color, Product, SearchFilters } from '../types'
import type { DbCategory, DbProduct } from '../types/database'

export const CATALOG_PAGE_SIZE = 24

const CATEGORY_SLUGS: Category[] = [
  'dresses',
  'tops',
  'bottoms',
  'outerwear',
  'shoes',
  'accessories',
  'electronics',
  'other',
]

function asCategory(value: string | null | undefined): Category {
  const slug = (value || 'other').toLowerCase()
  return (CATEGORY_SLUGS.includes(slug as Category) ? slug : 'other') as Category
}

function asColors(values: string[] | null | undefined): Color[] {
  const allowed = new Set([
    'black',
    'white',
    'blue',
    'navy',
    'red',
    'green',
    'beige',
    'pink',
    'grey',
    'brown',
    'yellow',
    'purple',
    'orange',
    'multicolor',
  ])
  return (values ?? [])
    .map((c) => c.toLowerCase())
    .filter((c): c is Color => allowed.has(c))
}

/** Map a Supabase product row into the app Product shape used by AI/rankers. */
export function mapDbProduct(row: DbProduct): Product {
  const price = Number(row.discount_price ?? row.price)
  const original =
    row.discount_price != null && Number(row.discount_price) < Number(row.price)
      ? Number(row.price)
      : undefined

  return {
    id: row.id,
    name: row.title,
    brand: row.brand || row.shops?.shop_name || 'Styla',
    category: asCategory(row.categories?.slug ?? row.categories?.name),
    colors: asColors(row.colors),
    price,
    originalPrice: original,
    currency: 'EUR',
    occasions: [],
    tags: row.tags ?? [],
    sizes: row.sizes?.length ? row.sizes : ['One size'],
    rating: Number(row.rating) || 0,
    reviewCount: 0,
    imageUrl: row.images?.[0] || '',
    description: row.description || row.title,
    inStock: row.stock > 0,
    stockCount: row.stock,
    source: 'supabase',
  }
}

export async function searchProducts(
  filters: SearchFilters,
  opts?: { limit?: number; start?: number },
): Promise<CatalogResponse> {
  const supabase = trySupabase()
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }

  const limit = opts?.limit ?? CATALOG_PAGE_SIZE
  const start = Math.max(0, opts?.start ?? 0)
  const end = start + limit - 1

  let query = supabase
    .from('products')
    .select(
      '*, categories(id, name, slug, image), shops(id, shop_name, logo)',
      { count: 'exact' },
    )
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .range(start, end)

  const text = (filters.query || '').trim()
  if (text) {
    // Broad text match across title / brand / tags
    query = query.or(
      `title.ilike.%${text}%,brand.ilike.%${text}%,description.ilike.%${text}%`,
    )
  }

  if (filters.minPrice !== null) query = query.gte('price', filters.minPrice)
  if (filters.maxPrice !== null) query = query.lte('price', filters.maxPrice)
  if (filters.brands.length) query = query.in('brand', filters.brands)
  if (filters.colors.length) query = query.overlaps('colors', filters.colors)
  if (filters.tags.length) query = query.overlaps('tags', filters.tags)
  if (filters.sizes.length) query = query.overlaps('sizes', filters.sizes)

  if (filters.categories.length) {
    const { data: cats } = await supabase
      .from('categories')
      .select('id, slug, name')
      .or(
        filters.categories
          .map((c) => `slug.eq.${c},name.ilike.${c}`)
          .join(','),
      )
    const ids = (cats ?? []).map((c) => c.id)
    if (ids.length) query = query.in('category_id', ids)
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  const rows = (data ?? []) as DbProduct[]
  const products = rows.map(mapDbProduct)
  const total = count ?? products.length
  const nextStart = start + products.length
  const hasMore = nextStart < total

  return {
    products,
    source: 'supabase',
    sources: ['supabase'],
    note:
      products.length === 0
        ? 'No products in Supabase yet. Sign up as a shop owner and add inventory, or run the Phase 1 seed.'
        : 'Catalog powered by Supabase — local shop inventory.',
    hasMore,
    nextStart: hasMore ? nextStart : null,
  }
}

export async function listFeaturedProducts(limit = 12): Promise<Product[]> {
  const supabase = trySupabase()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug, image), shops(id, shop_name, logo)')
    .eq('featured', true)
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error || !data) return []
  return (data as DbProduct[]).map(mapDbProduct)
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*, categories(id, name, slug, image), shops(id, shop_name, logo)')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return null
  return mapDbProduct(data as DbProduct)
}

export async function listCategories(): Promise<DbCategory[]> {
  const supabase = trySupabase()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, image, slug')
    .order('name', { ascending: true })
  if (error || !data) return []
  return data as DbCategory[]
}

export type BrowseSort = 'newest' | 'price-asc' | 'price-desc' | 'rating'

export interface BrowseFilters {
  q?: string
  categorySlug?: string
  minPrice?: number | null
  maxPrice?: number | null
  minRating?: number | null
  brands?: string[]
  colors?: string[]
  sizes?: string[]
  sort?: BrowseSort
  limit?: number
  start?: number
}

export async function browseProducts(filters: BrowseFilters = {}): Promise<{
  products: Product[]
  hasMore: boolean
  nextStart: number | null
  total: number
}> {
  const searchFilters: SearchFilters = {
    query: filters.q ?? '',
    categories: filters.categorySlug
      ? [filters.categorySlug as Category]
      : [],
    colors: (filters.colors ?? []) as Color[],
    occasions: [],
    maxPrice: filters.maxPrice ?? null,
    minPrice: filters.minPrice ?? null,
    brands: filters.brands ?? [],
    sizes: filters.sizes ?? [],
    tags: [],
  }

  const page = await searchProducts(searchFilters, {
    limit: filters.limit,
    start: filters.start,
  })

  let products = page.products
  if (filters.minRating != null) {
    products = products.filter((p) => p.rating >= filters.minRating!)
  }

  const sort = filters.sort ?? 'newest'
  products = [...products].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return {
    products,
    hasMore: Boolean(page.hasMore),
    nextStart: page.nextStart ?? null,
    total: products.length + (page.hasMore ? 1 : 0),
  }
}

export async function listDistinctBrands(): Promise<string[]> {
  const supabase = trySupabase()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('products')
    .select('brand')
    .gt('stock', 0)
    .neq('brand', '')
    .limit(200)
  if (error || !data) return []
  return [...new Set(data.map((r) => r.brand as string).filter(Boolean))].sort()
}
