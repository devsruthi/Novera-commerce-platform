import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatMoney } from '../../lib/catalogApi'
import { getMyShop, listMyProducts } from '../../services/shopService'
import { deleteProduct } from '../../services/shopProductService'

/** Shop inventory list with links to add / edit / delete. */
export function ShopProductsPage() {
  const { user } = useAuth()
  const qc = useQueryClient()

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

  return (
    <main className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[Syne] text-2xl font-extrabold">Products</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage inventory, stock, and images for your shop.
          </p>
        </div>
        <Link
          to="/shop/products/new"
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Add product
        </Link>
      </div>

      {productsQuery.isLoading && (
        <p className="mt-6 text-sm text-stone-500">Loading products…</p>
      )}

      {productsQuery.isError && (
        <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {(productsQuery.error as Error).message}
        </p>
      )}

      {!productsQuery.isLoading && products.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 px-4 py-10 text-center text-sm text-stone-500">
          No products yet.{' '}
          <Link to="/shop/products/new" className="font-semibold text-indigo-600">
            Add your first product
          </Link>
          .
        </div>
      )}

      {products.length > 0 && (
        <ul className="mt-6 divide-y divide-stone-100">
          {products.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="h-14 w-14 overflow-hidden rounded-xl bg-stone-100">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.title}</p>
                <p className="text-sm text-stone-500">
                  Stock {p.stock}
                  {p.stock > 0 && p.stock <= 5 ? ' · Low' : ''}
                  {p.stock <= 0 ? ' · Out' : ''} · {formatMoney(Number(p.price))}
                  {p.featured ? ' · Featured' : ''}
                  {p.categories?.name ? ` · ${p.categories.name}` : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/shop/products/${p.id}/edit`}
                  className="rounded-full border border-stone-200 px-3 py-1.5 text-sm font-semibold hover:bg-stone-50"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="rounded-full border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  disabled={remove.isPending}
                  onClick={() => {
                    if (
                      window.confirm(`Delete “${p.title}”? This cannot be undone.`)
                    ) {
                      remove.mutate(p.id)
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
