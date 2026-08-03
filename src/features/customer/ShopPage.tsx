import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import {
  browseProducts,
  listCategories,
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
    categorySlug: categorySlug || undefined,
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

function formatCount(n: number) {
  return n.toLocaleString('en-US')
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
  const [total, setTotal] = useState(0)
  const [nextStart, setNextStart] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const brandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: listDistinctBrands,
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
  })

  const categoryPills = useMemo(() => {
    const fromDb = (categoriesQuery.data ?? [])
      .map((c) => ({
        slug: (c.slug || c.name).toLowerCase(),
        label: c.name,
      }))
      .filter((c) => c.slug)
    return [{ slug: '', label: 'All Items' }, ...fromDb]
  }, [categoriesQuery.data])

  const pageQuery = useQuery({
    queryKey: ['browse', categorySlug ?? 'all', applied],
    queryFn: () => browseProducts(toBrowse(applied, categorySlug, 0)),
  })

  useEffect(() => {
    if (!pageQuery.data) return
    setProducts(pageQuery.data.products)
    setHasMore(pageQuery.data.hasMore)
    setNextStart(pageQuery.data.nextStart)
    setTotal(pageQuery.data.total)
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
      setTotal(page.total)
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

  const setSort = (sort: FilterState['sort']) => {
    const next = { ...draft, sort }
    setDraft(next)
    setApplied(next)
    const p = new URLSearchParams(params)
    if (sort === 'newest') p.delete('sort')
    else p.set('sort', sort)
    setParams(p, { replace: true })
  }

  return (
    <main className="relative min-h-[70vh] overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[#faf8ff]" />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="shopWaveA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#ede9fe" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#faf8ff" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="shopWaveB" x1="100%" y1="20%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f5f3ff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          fill="url(#shopWaveA)"
          d="M0 0h880C760 160 700 260 660 420c-50 200 0 330 150 480H0V0z"
        />
        <path
          fill="url(#shopWaveB)"
          d="M1440 0v900H640c160-100 240-240 280-400 40-180 10-320-100-500h620z"
        />
        <path
          fill="#a78bfa"
          fillOpacity="0.1"
          d="M0 680c200-40 340-10 500 50s300 70 420 30c130-40 280-20 520 30v110H0V680z"
        />
      </svg>

      <div className="page-shell page-x relative z-10 py-6">
      <header className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Shop
              <span className="inline-flex text-violet-500" aria-hidden>
                <Sparkle className="h-6 w-6 -translate-y-1" />
                <Sparkle className="h-4 w-4 translate-x-[-2px] translate-y-1" />
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Discover trendy styles from top brands.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {!pageQuery.isLoading && (
              <p className="text-sm text-slate-500">
                Showing {formatCount(products.length)}
                {total > products.length
                  ? ` of ${formatCount(total)}`
                  : ''}{' '}
                items
              </p>
            )}
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                <span className="text-slate-400">Sort by:</span>
                <select
                  className="bg-transparent font-semibold text-slate-800 outline-none"
                  value={draft.sort}
                  onChange={(e) => setSort(e.target.value as FilterState['sort'])}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="rating">Top rated</option>
                </select>
              </label>
              <div className="flex overflow-hidden rounded-xl border border-violet-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className={`grid h-10 w-10 place-items-center transition ${
                    view === 'grid'
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-500 hover:bg-violet-50'
                  }`}
                  aria-label="Grid view"
                >
                  <GridIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`grid h-10 w-10 place-items-center transition ${
                    view === 'list'
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-500 hover:bg-violet-50'
                  }`}
                  aria-label="List view"
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {categoryPills.map((pill) => {
            const active =
              (pill.slug === '' && !categorySlug) ||
              pill.slug === categorySlug
            const to = pill.slug
              ? `/customer/categories/${pill.slug}`
              : '/customer/shop'
            return (
              <Link
                key={pill.slug || 'all'}
                to={to}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? 'border-violet-300 bg-violet-100 text-violet-700'
                    : 'border-violet-100 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50'
                }`}
              >
                <CategoryIcon slug={pill.slug} />
                {pill.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="w-full self-start lg:sticky lg:top-24">
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
        </aside>

        <section>
          {pageQuery.isLoading && (
            <div
              className={
                view === 'grid'
                  ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
                  : 'flex flex-col gap-3'
              }
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse rounded-2xl bg-violet-100/70 ${
                    view === 'grid' ? 'h-80' : 'h-36'
                  }`}
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
            <div className="rounded-2xl border border-dashed border-violet-200 bg-white px-6 py-16 text-center">
              <p className="font-semibold text-slate-800">No products match</p>
              <p className="mt-1 text-sm text-slate-500">
                Try clearing filters or ask a shop owner to add inventory.
              </p>
            </div>
          )}

          {products.length > 0 && (
            <>
              <div
                className={
                  view === 'grid'
                    ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
                    : 'flex flex-col gap-3'
                }
              >
                {products.map((p) => (
                  <CatalogProductCard key={p.id} product={p} layout={view} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    disabled={loadingMore}
                    onClick={() => void loadMore()}
                    className="rounded-full border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-50 disabled:opacity-60"
                  >
                    {loadingMore ? 'Loading…' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
      </div>
    </main>
  )
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l1.2 6.3L19 9.5l-5.8 1.2L12 17l-1.2-6.3L5 9.5l5.8-1.2L12 2Z" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function iconTypeForSlug(slug: string): 'grid' | 'dress' | 'shirt' | 'shoe' | 'bag' | 'tag' {
  const s = slug.toLowerCase()
  if (!s) return 'grid'
  if (s.includes('dress') || s.includes('frock')) return 'dress'
  if (s.includes('top') || s.includes('shirt') || s.includes('tee')) return 'shirt'
  if (s.includes('shoe') || s.includes('sneaker') || s.includes('heel')) return 'shoe'
  if (s.includes('bag') || s.includes('purse') || s.includes('handbag')) return 'bag'
  return 'tag'
}

function CategoryIcon({ slug }: { slug: string }) {
  const type = iconTypeForSlug(slug)
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    'aria-hidden': true,
  }
  switch (type) {
    case 'grid':
      return (
        <svg {...common} fill="currentColor">
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      )
    case 'dress':
      return (
        <svg {...common}>
          <path
            d="M9 3h6l1.5 4-2 1v3l4 10H5.5l4-10V8l-2-1L9 3Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'shirt':
      return (
        <svg {...common}>
          <path
            d="M8 5 12 7l4-2 3 2-2 3v9H7V10L5 7l3-2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'shoe':
      return (
        <svg {...common}>
          <path
            d="M4 15c2-1 4-3 7-3 2 0 3 .5 5 2h4v2H4v-1Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M8 12c1-2 2-4 4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'bag':
      return (
        <svg {...common}>
          <path
            d="M6 8h12l-1 11H7L6 8Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9 8V7a3 3 0 0 1 6 0v1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'tag':
      return (
        <svg {...common}>
          <path
            d="M20 13 11 4H4v7l9 9 7-7Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
        </svg>
      )
  }
}
