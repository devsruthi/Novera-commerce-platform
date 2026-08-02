import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  browseProducts,
  listDistinctBrands,
  type BrowseFilters,
} from '../../services/productService'
import type { Product } from '../../types'
import { CatalogProductCard } from './components/CatalogProductCard'
import {
  defaultFilters,
  ProductFilters,
  type FilterState,
} from './components/ProductFilters'

function toBrowse(
  filters: FilterState,
  categorySlug: string | undefined,
  start: number,
): BrowseFilters {
  return {
    q: filters.q.trim() || undefined,
    categorySlug,
    minPrice: filters.minPrice ? Number(filters.minPrice) : null,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
    minRating: filters.minRating ? Number(filters.minRating) : null,
    brands: filters.brand ? [filters.brand] : [],
    colors: filters.color ? [filters.color] : [],
    sizes: filters.size.trim() ? [filters.size.trim()] : [],
    sort: filters.sort,
    limit: 24,
    start,
  }
}

/** Customer product listing with advanced filters + load more. */
export function ShopPage({ categorySlug }: { categorySlug?: string }) {
  const [params, setParams] = useSearchParams()
  const [draft, setDraft] = useState<FilterState>(() => ({
    ...defaultFilters(),
    q: params.get('q') ?? '',
    sort: (params.get('sort') as FilterState['sort']) || 'newest',
  }))
  const [applied, setApplied] = useState(draft)
  const [products, setProducts] = useState<Product[]>([])
  const [nextStart, setNextStart] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const brandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: listDistinctBrands,
  })

  const pageQuery = useQuery({
    queryKey: ['browse', categorySlug ?? 'all', applied],
    queryFn: () => browseProducts(toBrowse(applied, categorySlug, 0)),
  })

  useEffect(() => {
    if (!pageQuery.data) return
    setProducts(pageQuery.data.products)
    setHasMore(pageQuery.data.hasMore)
    setNextStart(pageQuery.data.nextStart)
  }, [pageQuery.data])

  const loadMore = async () => {
    if (nextStart == null || loadingMore) return
    setLoadingMore(true)
    try {
      const page = await browseProducts(
        toBrowse(applied, categorySlug, nextStart),
      )
      setProducts((prev) => {
        const seen = new Set(prev.map((p) => p.id))
        return [...prev, ...page.products.filter((p) => !seen.has(p.id))]
      })
      setHasMore(page.hasMore)
      setNextStart(page.nextStart)
    } finally {
      setLoadingMore(false)
    }
  }

  const apply = () => {
    setApplied(draft)
    const next = new URLSearchParams()
    if (draft.q) next.set('q', draft.q)
    if (draft.sort !== 'newest') next.set('sort', draft.sort)
    setParams(next, { replace: true })
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="font-[Syne] text-3xl font-extrabold tracking-tight">
          {categorySlug
            ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
            : 'Shop'}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Browse live inventory from Styla shops.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <ProductFilters
          value={draft}
          brands={brandsQuery.data ?? []}
          onChange={setDraft}
          onApply={apply}
          onReset={() => {
            const blank = defaultFilters()
            setDraft(blank)
            setApplied(blank)
            setParams({}, { replace: true })
          }}
        />

        <section>
          {pageQuery.isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl bg-stone-200/80"
                />
              ))}
            </div>
          )}

          {pageQuery.isError && (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {(pageQuery.error as Error).message}
            </p>
          )}

          {!pageQuery.isLoading && products.length === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <p className="font-semibold">No products match</p>
              <p className="mt-1 text-sm text-stone-500">
                Try clearing filters or ask a shop owner to add inventory.
              </p>
            </div>
          )}

          {products.length > 0 && (
            <>
              <p className="mb-4 text-sm text-stone-500">
                Showing {products.length} item{products.length === 1 ? '' : 's'}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <CatalogProductCard key={p.id} product={p} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    disabled={loadingMore}
                    onClick={() => void loadMore()}
                    className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-stone-50 disabled:opacity-60"
                  >
                    {loadingMore ? 'Loading…' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}
