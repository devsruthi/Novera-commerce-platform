import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatMoney } from '../../lib/catalogApi'
import { getMyShop, listMyProducts, shopStats } from '../../services/shopService'

/** Shop owner dashboard — inventory health + quick actions. */
export function ShopDashboardPage() {
  const { user } = useAuth()

  const shopQuery = useQuery({
    queryKey: ['my-shop', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => getMyShop(user!.id),
  })

  const statsQuery = useQuery({
    queryKey: ['shop-stats', shopQuery.data?.id],
    enabled: Boolean(shopQuery.data?.id),
    queryFn: () => shopStats(shopQuery.data!.id),
  })

  const productsQuery = useQuery({
    queryKey: ['my-products', shopQuery.data?.id],
    enabled: Boolean(shopQuery.data?.id),
    queryFn: () => listMyProducts(shopQuery.data!.id),
  })

  const shop = shopQuery.data
  const stats = statsQuery.data
  const lowStockItems = (productsQuery.data ?? [])
    .filter((p) => p.stock > 0 && p.stock <= 5)
    .slice(0, 5)

  return (
    <main className="space-y-6">
      <header className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start gap-4">
          {shop?.logo ? (
            <img
              src={shop.logo}
              alt=""
              className="h-16 w-16 rounded-2xl object-cover"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-400">
              Shop owner
            </p>
            <h1 className="mt-1 font-[Syne] text-3xl font-extrabold">
              {shop?.shop_name || 'Your shop'}
            </h1>
            <p className="mt-2 max-w-2xl text-stone-600">
              {shop?.description ||
                'Add products and keep stock healthy. Customers browse this inventory in the shop.'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/shop/products/new"
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Add product
          </Link>
          <Link
            to="/shop/products"
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold"
          >
            Manage products
          </Link>
          <Link
            to="/shop/categories"
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold"
          >
            Categories
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Total products', value: stats?.totalProducts ?? '—' },
          { label: 'In stock', value: stats?.inStock ?? '—' },
          { label: 'Out of stock', value: stats?.outOfStock ?? '—' },
          { label: 'Low stock (≤5)', value: stats?.lowStock ?? '—' },
          { label: 'Featured', value: stats?.featured ?? '—' },
          {
            label: 'Inventory value',
            value:
              stats != null
                ? formatMoney(stats.inventoryValue)
                : '—',
          },
        ].map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-stone-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{card.value}</p>
          </article>
        ))}
      </section>

      {lowStockItems.length > 0 && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50/60 p-5">
          <h2 className="font-semibold text-amber-950">Needs restock</h2>
          <ul className="mt-3 space-y-2">
            {lowStockItems.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="font-medium text-amber-950">{p.title}</span>
                <Link
                  to={`/shop/products/${p.id}/edit`}
                  className="font-semibold text-amber-800 underline"
                >
                  Stock {p.stock} · Edit
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(shopQuery.isError || statsQuery.isError) && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Could not load shop data. Confirm Phase 1–3 SQL is applied and your
          profile role is <code>shop_owner</code>.
        </p>
      )}
    </main>
  )
}
