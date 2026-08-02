import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { formatMoney } from '../../lib/catalogApi'
import { getMyShop, listMyProducts, shopStats } from '../../services/shopService'
import { shop } from './shopUi'

const RANGE_OPTIONS = ['This Week', 'This Month', 'This Year'] as const

function buildSalesSeries(seed: number) {
  const days = 14
  const now = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (days - 1 - i))
    const wave = Math.sin((i + seed) / 2.4) * 0.35 + 1
    const base = 1200 + ((seed * (i + 3)) % 900)
    return {
      label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      sales: Math.round(base * wave),
    }
  })
}

function MiniSpark({
  color,
  points,
}: {
  color: string
  points: number[]
}) {
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const span = max - min || 1
  const w = 72
  const h = 28
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - ((v - min) / span) * (h - 4) - 2
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Shop owner overview — KPIs, sales chart, top products, activity. */
export function ShopDashboardPage() {
  const { user } = useAuth()
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]>('This Month')

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

  const stats = statsQuery.data
  const products = productsQuery.data ?? []
  const seed = shopQuery.data?.id?.length ?? 7

  const salesData = useMemo(() => buildSalesSeries(seed), [seed])

  const topProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => Number(b.price) * (b.featured ? 2 : 1) - Number(a.price) * (a.featured ? 2 : 1))
        .slice(0, 5),
    [products],
  )

  const recentProducts = products.slice(0, 5)

  const performance = useMemo(() => {
    const inStock = stats?.inStock ?? 0
    const out = stats?.outOfStock ?? 0
    const low = stats?.lowStock ?? 0
    const total = Math.max(inStock + out, 1)
    return [
      { name: 'In stock', value: inStock, color: '#7C3AED' },
      { name: 'Low stock', value: low, color: '#A78BFA' },
      { name: 'Out of stock', value: out, color: '#E9D5FF' },
      { name: 'Healthy', value: Math.max(total - low - out, 0), color: '#F3E8FF' },
    ]
  }, [stats])

  const metricCards = [
    {
      label: 'Inventory Value',
      value: stats != null ? formatMoney(stats.inventoryValue) : '—',
      delta: '+12.5%',
      spark: [12, 18, 14, 22, 20, 28, 26],
      sparkColor: '#7C3AED',
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? '—',
      delta: '+5.2%',
      spark: [8, 10, 9, 14, 13, 16, 18],
      sparkColor: '#3B82F6',
    },
    {
      label: 'In Stock',
      value: stats?.inStock ?? '—',
      delta: '+8.3%',
      spark: [10, 12, 11, 15, 14, 17, 19],
      sparkColor: '#F59E0B',
    },
    {
      label: 'Out of Stock',
      value: stats?.outOfStock ?? '—',
      delta: stats && stats.outOfStock > 0 ? 'Needs attention' : 'Healthy',
      spark: [6, 5, 7, 4, 5, 3, 4],
      sparkColor: '#10B981',
      deltaTone: stats && stats.outOfStock > 0 ? 'warn' : 'ok',
    },
  ] as const

  return (
    <div className={shop.page}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={shop.title}>Overview</h1>
          <p className={shop.subtitle}>
            Track inventory health and store performance for{' '}
            {shopQuery.data?.shop_name || 'your shop'}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={shop.btnPrimary}>
            Export Report
          </button>
          <select
            className={`${shop.input} w-auto min-w-[140px]`}
            value={range}
            onChange={(e) =>
              setRange(e.target.value as (typeof RANGE_OPTIONS)[number])
            }
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <article key={card.label} className={`${shop.card} p-5`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </p>
                <p
                  className={`mt-2 text-xs font-semibold ${
                    'deltaTone' in card && card.deltaTone === 'warn'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {card.delta}
                </p>
              </div>
              <MiniSpark color={card.sparkColor} points={[...card.spark]} />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <article className={`${shop.card} p-5 sm:p-6`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className={shop.sectionTitle}>Sales Overview</h2>
            <span className="text-xs font-medium text-slate-400">
              Sample trend · {range}
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#EEF0F5" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `€${v}`}
                  width={56}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 8px 24px rgb(15 23 42 / 8%)',
                  }}
                  formatter={(value) => [
                    formatMoney(Number(value ?? 0)),
                    'Sales',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#7C3AED"
                  strokeWidth={2.5}
                  fill="url(#salesFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className={`${shop.card} p-5 sm:p-6`}>
          <h2 className={shop.sectionTitle}>Top Selling Products</h2>
          <ul className="mt-4 space-y-3">
            {topProducts.length === 0 && (
              <li className="rounded-xl border border-dashed border-slate-200 px-3 py-8 text-center text-sm text-slate-500">
                No products yet.{' '}
                <Link to="/shop/products/new" className="font-semibold text-violet-600">
                  Add one
                </Link>
              </li>
            )}
            {topProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="h-11 w-11 overflow-hidden rounded-xl bg-slate-100">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatMoney(Number(p.price))}
                  </p>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  {p.stock} units
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <article className={`${shop.card} overflow-hidden`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className={shop.sectionTitle}>Recent Inventory</h2>
            <Link
              to="/shop/products"
              className="text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold sm:px-6">Product</th>
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Stock</th>
                  <th className="px-3 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-slate-500 sm:px-6"
                    >
                      No products yet.
                    </td>
                  </tr>
                )}
                {recentProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3 sm:px-6">
                      <Link
                        to={`/shop/products/${p.id}/edit`}
                        className="font-semibold text-slate-800 hover:text-violet-700"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-slate-500">
                      {p.categories?.name || '—'}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{p.stock}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {formatMoney(Number(p.price))}
                    </td>
                    <td className="px-5 py-3 sm:px-6">
                      <span
                        className={
                          p.stock > 0 ? shop.pillActive : shop.pillDanger
                        }
                      >
                        {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className={`${shop.card} flex flex-col p-5 sm:p-6`}>
          <h2 className={shop.sectionTitle}>Store Performance</h2>
          <p className="mt-1 text-sm text-slate-500">Inventory distribution</p>
          <div className="relative mx-auto mt-2 h-48 w-full max-w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performance}
                  dataKey="value"
                  innerRadius={58}
                  outerRadius={82}
                  startAngle={210}
                  endAngle={-30}
                  paddingAngle={2}
                  stroke="none"
                >
                  {performance.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-2">
              <p className="text-xs font-medium text-slate-400">Products</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats?.totalProducts ?? 0}
              </p>
            </div>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-violet-50 px-3 py-2">
              <p className="text-violet-500">In stock</p>
              <p className="mt-0.5 text-sm font-bold text-violet-800">
                {stats?.inStock ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-slate-500">Low stock</p>
              <p className="mt-0.5 text-sm font-bold text-slate-800">
                {stats?.lowStock ?? 0}
              </p>
            </div>
          </div>
        </article>
      </section>

      {(shopQuery.isError || statsQuery.isError) && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Could not load shop data. Confirm Phase 1–3 SQL is applied and your
          profile role is <code>shop_owner</code>.
        </p>
      )}
    </div>
  )
}
