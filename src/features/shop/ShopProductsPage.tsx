import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatMoney } from '../../lib/catalogApi'
import { listCategories } from '../../services/productService'
import { getMyShop, listMyProducts } from '../../services/shopService'
import { deleteProduct } from '../../services/shopProductService'
import type { DbProduct } from '../../types/database'
import { shop } from './shopUi'

type FilterTab = 'all' | 'active' | 'draft' | 'oos' | 'low'
type ViewMode = 'list' | 'grid'
type SortKey = 'title' | 'price' | 'stock'

const PAGE_SIZE = 9
const LOW_STOCK_MAX = 5

function isDraft(p: DbProduct) {
  return !p.images?.length || !p.description?.trim()
}

function productStatus(p: DbProduct): 'active' | 'draft' | 'oos' {
  if (p.stock <= 0) return 'oos'
  if (isDraft(p)) return 'draft'
  return 'active'
}

function skuFor(p: DbProduct) {
  if (p.brand?.trim()) return p.brand.trim()
  return `NOV-${p.id.slice(0, 6).toUpperCase()}`
}

function variantCount(p: DbProduct) {
  const sizes = p.sizes?.length ?? 0
  const colors = p.colors?.length ?? 0
  if (sizes && colors) return sizes * colors
  return sizes || colors || 1
}

function matchesSearch(product: DbProduct, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    product.title.toLowerCase().includes(q) ||
    product.brand.toLowerCase().includes(q) ||
    skuFor(product).toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    (product.categories?.name ?? '').toLowerCase().includes(q) ||
    (product.tags ?? []).some((t) => t.toLowerCase().includes(q))
  )
}

function exportCsv(rows: DbProduct[]) {
  const header = [
    'Title',
    'SKU',
    'Category',
    'Price',
    'Discount Price',
    'Stock',
    'Status',
    'Brand',
  ]
  const lines = rows.map((p) => {
    const status = productStatus(p)
    const cells = [
      p.title,
      skuFor(p),
      p.categories?.name ?? '',
      String(p.price),
      p.discount_price != null ? String(p.discount_price) : '',
      String(p.stock),
      status,
      p.brand,
    ]
    return cells
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(',')
  })
  const blob = new Blob([[header.join(','), ...lines].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `novera-products-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/** Shop inventory list — Novera products design with filters & views. */
export function ShopProductsPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTab] = useState<FilterTab>('all')
  const [page, setPage] = useState(1)
  const [view, setView] = useState<ViewMode>('list')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('title')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [menuFor, setMenuFor] = useState<string | null>(null)

  const searchQuery = searchParams.get('q') ?? ''
  const categoryFilter = searchParams.get('category') ?? ''
  const stockFilter = searchParams.get('stock') ?? '' // '', 'in', 'low', 'out'

  const shopQuery = useQuery({
    queryKey: ['my-shop', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => getMyShop(user!.id),
  })

  const productsQuery = useQuery({
    queryKey: ['my-products', shopQuery.data?.id],
    enabled: Boolean(shopQuery.data?.id),
    queryFn: () => listMyProducts(shopQuery.data!.id),
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
  })

  const remove = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: async () => {
      setMenuFor(null)
      await qc.invalidateQueries({ queryKey: ['my-products'] })
      await qc.invalidateQueries({ queryKey: ['shop-stats'] })
    },
  })

  const products = productsQuery.data ?? []
  const categories = categoriesQuery.data ?? []

  const scoped = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter && p.category_id !== categoryFilter) return false
      if (stockFilter === 'in' && !(p.stock > LOW_STOCK_MAX)) return false
      if (
        stockFilter === 'low' &&
        !(p.stock > 0 && p.stock <= LOW_STOCK_MAX)
      ) {
        return false
      }
      if (stockFilter === 'out' && p.stock > 0) return false
      return matchesSearch(p, searchQuery)
    })
  }, [products, categoryFilter, stockFilter, searchQuery])

  const counts = useMemo(() => {
    const draft = scoped.filter(isDraft).length
    const oos = scoped.filter((p) => p.stock <= 0).length
    const low = scoped.filter(
      (p) => p.stock > 0 && p.stock <= LOW_STOCK_MAX,
    ).length
    const active = scoped.filter(
      (p) => p.stock > 0 && !isDraft(p),
    ).length
    return { all: scoped.length, active, draft, oos, low }
  }, [scoped])

  const filtered = useMemo(() => {
    let rows: DbProduct[]
    switch (tab) {
      case 'active':
        rows = scoped.filter((p) => p.stock > 0 && !isDraft(p))
        break
      case 'oos':
        rows = scoped.filter((p) => p.stock <= 0)
        break
      case 'draft':
        rows = scoped.filter(isDraft)
        break
      case 'low':
        rows = scoped.filter(
          (p) => p.stock > 0 && p.stock <= LOW_STOCK_MAX,
        )
        break
      default:
        rows = scoped
    }

    const sorted = [...rows].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'title') cmp = a.title.localeCompare(b.title)
      else if (sortKey === 'price') cmp = Number(a.price) - Number(b.price)
      else cmp = a.stock - b.stock
      return sortDir === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [scoped, tab, sortKey, sortDir])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, categoryFilter, stockFilter, tab, sortKey, sortDir])

  useEffect(() => {
    const onDocClick = () => setMenuFor(null)
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const selectedCategoryName =
    categories.find((c) => c.id === categoryFilter)?.name ?? null

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('category')
    next.delete('stock')
    setSearchParams(next, { replace: true })
    setTab('all')
    setFiltersOpen(false)
  }

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Products', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'draft', label: 'Draft', count: counts.draft },
    { id: 'oos', label: 'Out of Stock', count: counts.oos },
    { id: 'low', label: 'Low Stock', count: counts.low },
  ]

  const hasActiveFilters = Boolean(
    searchQuery.trim() || categoryFilter || stockFilter,
  )
  const filterCount =
    (categoryFilter ? 1 : 0) + (stockFilter ? 1 : 0) + (searchQuery.trim() ? 1 : 0)

  const pageButtons = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const buttons: (number | '…')[] = [1]
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    if (start > 2) buttons.push('…')
    for (let i = start; i <= end; i++) buttons.push(i)
    if (end < totalPages - 1) buttons.push('…')
    buttons.push(totalPages)
    return buttons
  }, [currentPage, totalPages])

  return (
    <div className={shop.page}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={shop.title}>Products</h1>
          <p className={shop.subtitle}>
            Manage and organize all your products in one place.
            {selectedCategoryName ? (
              <>
                {' '}
                Filtered by{' '}
                <span className="font-semibold text-violet-700">
                  {selectedCategoryName}
                </span>
                .
              </>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={`${shop.btnSecondary} ${filtersOpen || hasActiveFilters ? 'border-violet-300 bg-violet-50 text-violet-700' : ''}`}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 5h16l-6 7v5l-4 2v-7L4 5z" />
            </svg>
            Filter
            {filterCount > 0 && (
              <span className="ml-0.5 rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] font-bold !text-white">
                {filterCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className={shop.btnSecondary}
            onClick={() => exportCsv(filtered)}
            disabled={filtered.length === 0}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
            </svg>
            Export
          </button>
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              title="Grid view"
              onClick={() => setView('grid')}
              className={`rounded-lg p-2 transition ${
                view === 'grid'
                  ? 'bg-violet-600 !text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </button>
            <button
              type="button"
              title="List view"
              onClick={() => setView('list')}
              className={`rounded-lg p-2 transition ${
                view === 'list'
                  ? 'bg-violet-600 !text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {filtersOpen && (
        <div className={`${shop.card} grid gap-4 p-4 sm:grid-cols-3 sm:p-5`}>
          <label className="block">
            <span className={shop.label}>Category</span>
            <select
              className={shop.input}
              value={categoryFilter}
              onChange={(e) => setParam('category', e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={shop.label}>Stock level</span>
            <select
              className={shop.input}
              value={stockFilter}
              onChange={(e) => setParam('stock', e.target.value)}
            >
              <option value="">Any stock</option>
              <option value="in">In stock (&gt;{LOW_STOCK_MAX})</option>
              <option value="low">Low stock (1–{LOW_STOCK_MAX})</option>
              <option value="out">Out of stock</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button
              type="button"
              className={shop.btnGhost}
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      <div className={shop.card}>
        <div className="flex flex-wrap gap-1 border-b border-slate-100 px-2 pt-2 sm:px-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative px-3 py-3 text-sm font-semibold transition ${
                tab === t.id
                  ? 'text-violet-700 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-violet-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}{' '}
              <span
                className={`ml-1 rounded-md px-1.5 py-0.5 text-xs ${
                  tab === t.id
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {productsQuery.isLoading && (
          <p className="px-5 py-10 text-sm text-slate-500">Loading products…</p>
        )}

        {productsQuery.isError && (
          <p className="m-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {(productsQuery.error as Error).message}
          </p>
        )}

        {!productsQuery.isLoading && filtered.length === 0 && (
          <div className="px-5 py-14 text-center text-sm text-slate-500">
            {products.length === 0 ? (
              <>
                No products yet.{' '}
                <Link
                  to="/shop/products/new"
                  className="font-semibold text-violet-600"
                >
                  Add your first product
                </Link>
                .
              </>
            ) : (
              <>
                No products match this filter.{' '}
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="font-semibold text-violet-600"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {pageItems.length > 0 && view === 'list' && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold sm:px-6">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1"
                      onClick={() => toggleSort('title')}
                    >
                      Product
                      <SortIcon active={sortKey === 'title'} dir={sortDir} />
                    </button>
                  </th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1"
                      onClick={() => toggleSort('price')}
                    >
                      Price
                      <SortIcon active={sortKey === 'price'} dir={sortDir} />
                    </button>
                  </th>
                  <th className="px-3 py-3 font-semibold">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1"
                      onClick={() => toggleSort('stock')}
                    >
                      Stock
                      <SortIcon active={sortKey === 'stock'} dir={sortDir} />
                    </button>
                  </th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageItems.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    menuOpen={menuFor === p.id}
                    onToggleMenu={(e) => {
                      e.stopPropagation()
                      setMenuFor((id) => (id === p.id ? null : p.id))
                    }}
                    onDelete={() => {
                      if (
                        window.confirm(
                          `Delete “${p.title}”? This cannot be undone.`,
                        )
                      ) {
                        remove.mutate(p.id)
                      }
                    }}
                    deletePending={remove.isPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pageItems.length > 0 && view === 'grid' && (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-5">
            {pageItems.map((p) => {
              const status = productStatus(p)
              const low = p.stock > 0 && p.stock <= LOW_STOCK_MAX
              return (
                <article
                  key={p.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-[4/3] bg-slate-100">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold text-slate-900">
                          {p.title}
                        </h2>
                        <p className="text-xs font-semibold text-violet-600">
                          SKU: {skuFor(p)}
                        </p>
                      </div>
                      <StatusPill status={status} />
                    </div>
                    <p className="line-clamp-2 text-xs text-slate-500">
                      {p.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900">
                        {formatMoney(Number(p.price))}
                      </span>
                      <span
                        className={
                          p.stock <= 0
                            ? 'text-rose-600'
                            : low
                              ? 'font-semibold text-rose-600'
                              : 'text-emerald-600'
                        }
                      >
                        {p.stock} ·{' '}
                        {p.stock <= 0
                          ? 'Out of Stock'
                          : low
                            ? 'Low Stock'
                            : 'In Stock'}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Link
                        to={`/shop/products/${p.id}/edit`}
                        className={`${shop.btnSecondary} flex-1`}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                        disabled={remove.isPending}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete “${p.title}”? This cannot be undone.`,
                            )
                          ) {
                            remove.mutate(p.id)
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{' '}
              {filtered.length} products
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                ‹
              </button>
              {pageButtons.map((n, i) =>
                n === '…' ? (
                  <span key={`e-${i}`} className="px-1 text-slate-400">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                      currentPage === n
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SortIcon({
  active,
  dir,
}: {
  active: boolean
  dir: 'asc' | 'desc'
}) {
  return (
    <span
      className={`text-[10px] ${active ? 'text-violet-600' : 'text-slate-300'}`}
    >
      {active ? (dir === 'asc' ? '▲' : '▼') : '▼'}
    </span>
  )
}

function StatusPill({ status }: { status: 'active' | 'draft' | 'oos' }) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    )
  }
  if (status === 'oos') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Out of Stock
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Draft
    </span>
  )
}

function ProductRow({
  product: p,
  menuOpen,
  onToggleMenu,
  onDelete,
  deletePending,
}: {
  product: DbProduct
  menuOpen: boolean
  onToggleMenu: (e: MouseEvent) => void
  onDelete: () => void
  deletePending: boolean
}) {
  const status = productStatus(p)
  const low = p.stock > 0 && p.stock <= LOW_STOCK_MAX
  const variants = variantCount(p)

  return (
    <tr className="hover:bg-slate-50/70">
      <td className="px-5 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="h-[88px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-[104px] sm:w-[88px]">
            {p.images?.[0] ? (
              <img
                src={p.images[0]}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m3 16 5-5 4 4 3-3 6 6" />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{p.title}</p>
            <p className="mt-0.5 text-xs font-semibold text-violet-600">
              SKU: {skuFor(p)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-violet-50 text-xs font-bold text-violet-700">
            {p.categories?.image ? (
              <img
                src={p.categories.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              (p.categories?.name?.[0] || '?').toUpperCase()
            )}
          </span>
          <div>
            <p className="font-medium text-slate-800">
              {p.categories?.name || 'Uncategorized'}
            </p>
            <p className="text-xs text-slate-500">
              {variants} {variants === 1 ? 'variant' : 'variants'}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 font-semibold text-slate-900">
        {formatMoney(Number(p.discount_price ?? p.price))}
        {p.discount_price != null && (
          <p className="text-xs font-normal text-slate-400 line-through">
            {formatMoney(Number(p.price))}
          </p>
        )}
      </td>
      <td className="px-3 py-4">
        <p className="font-semibold text-slate-900">{p.stock}</p>
        <p
          className={`text-xs font-semibold ${
            p.stock <= 0
              ? 'text-rose-600'
              : low
                ? 'text-rose-600'
                : 'text-emerald-600'
          }`}
        >
          {p.stock <= 0 ? 'Out of Stock' : low ? 'Low Stock' : 'In Stock'}
        </p>
      </td>
      <td className="px-3 py-4">
        <StatusPill status={status} />
      </td>
      <td className="px-5 py-4 sm:px-6">
        <div className="relative flex justify-end gap-0.5">
          <Link
            to={`/shop/products/${p.id}/edit`}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
            title="Edit"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
            title="Delete"
            disabled={deletePending}
            onClick={onDelete}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            title="More"
            onClick={onToggleMenu}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="19" cy="12" r="1.6" />
            </svg>
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-10 z-10 min-w-[160px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                to={`/shop/products/${p.id}/edit`}
                className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Edit product
              </Link>
              {p.category_id && (
                <Link
                  to={`/shop/products?category=${encodeURIComponent(p.category_id)}`}
                  className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  View category
                </Link>
              )}
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}
