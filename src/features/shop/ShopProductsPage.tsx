import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatMoney } from '../../lib/catalogApi'
import { getMyShop, listMyProducts } from '../../services/shopService'
import { deleteProduct } from '../../services/shopProductService'
import { shop } from './shopUi'

type FilterTab = 'all' | 'active' | 'draft' | 'oos'

const PAGE_SIZE = 8

/** Shop inventory list with status tabs and table layout. */
export function ShopProductsPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [tab, setTab] = useState<FilterTab>('all')
  const [page, setPage] = useState(1)

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

  const remove = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['my-products'] })
      await qc.invalidateQueries({ queryKey: ['shop-stats'] })
    },
  })

  const products = productsQuery.data ?? []

  const counts = useMemo(() => {
    const active = products.filter((p) => p.stock > 0).length
    const oos = products.filter((p) => p.stock <= 0).length
    const draft = products.filter(
      (p) => !p.images?.length || !p.description?.trim(),
    ).length
    return { all: products.length, active, draft, oos }
  }, [products])

  const filtered = useMemo(() => {
    switch (tab) {
      case 'active':
        return products.filter((p) => p.stock > 0)
      case 'oos':
        return products.filter((p) => p.stock <= 0)
      case 'draft':
        return products.filter(
          (p) => !p.images?.length || !p.description?.trim(),
        )
      default:
        return products
    }
  }, [products, tab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'draft', label: 'Draft', count: counts.draft },
    { id: 'oos', label: 'Out of Stock', count: counts.oos },
  ]

  return (
    <div className={shop.page}>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={shop.title}>Products</h1>
          <p className={shop.subtitle}>
            Manage inventory, stock, pricing, and images.
          </p>
        </div>
        <Link to="/shop/products/new" className={shop.btnPrimary}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Product
        </Link>
      </header>

      <div className={shop.card}>
        <div className="flex flex-wrap gap-1 border-b border-slate-100 px-2 pt-2 sm:px-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id)
                setPage(1)
              }}
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
              'No products match this filter.'
            )}
          </div>
        )}

        {pageItems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold sm:px-6">Product</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Price</th>
                  <th className="px-3 py-3 font-semibold">Stock</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageItems.map((p) => {
                  const status =
                    p.stock <= 0
                      ? 'oos'
                      : !p.images?.length || !p.description?.trim()
                        ? 'draft'
                        : 'active'
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                            {p.images?.[0] ? (
                              <img
                                src={p.images[0]}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">
                              {p.title}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {p.brand || 'No brand'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">
                        {p.categories?.name || '—'}
                      </td>
                      <td className="px-3 py-3.5 font-medium text-slate-800">
                        {formatMoney(Number(p.price))}
                      </td>
                      <td className="px-3 py-3.5 text-slate-700">{p.stock}</td>
                      <td className="px-3 py-3.5">
                        <span
                          className={
                            status === 'active'
                              ? shop.pillActive
                              : status === 'oos'
                                ? shop.pillDanger
                                : shop.pillMuted
                          }
                        >
                          {status === 'active'
                            ? 'Active'
                            : status === 'oos'
                              ? 'Out of Stock'
                              : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 sm:px-6">
                        <div className="flex justify-end gap-1">
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
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6">
            <p className="text-sm text-slate-500">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{' '}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className={shop.btnSecondary}
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const n = i + 1
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
                      currentPage === n
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {n}
                  </button>
                )
              })}
              <button
                type="button"
                className={shop.btnSecondary}
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
