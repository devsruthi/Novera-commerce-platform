import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../../context/OrdersContext'
import { formatMoney } from '../../lib/catalogApi'
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_META,
  canCancelOrder,
  formatOrderDate,
  paymentLabel,
} from '../../lib/orders'
import type { Order, OrderStatus } from '../../types'

const STATUS_BADGE: Record<OrderStatus, string> = {
  placed: 'bg-sky-50 text-sky-700 ring-sky-200',
  confirmed: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  processing: 'bg-amber-50 text-amber-800 ring-amber-200',
  shipped: 'bg-violet-50 text-violet-700 ring-violet-200',
  out_for_delivery: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${STATUS_BADGE[status]}`}
    >
      {ORDER_STATUS_META[status].label}
    </span>
  )
}

function StatusTimeline({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <ol className="mt-2.5 space-y-2">
        <li className="flex gap-2.5">
          <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
          <div>
            <p className="text-sm font-bold text-rose-700">
              {ORDER_STATUS_META.cancelled.label}
            </p>
            <p className="text-xs text-slate-500">
              {ORDER_STATUS_META.cancelled.detail}
            </p>
          </div>
        </li>
      </ol>
    )
  }

  const activeIndex = ORDER_STATUS_FLOW.indexOf(order.status)

  return (
    <ol className="mt-2.5 space-y-0">
      {ORDER_STATUS_FLOW.map((status, index) => {
        const done = index < activeIndex
        const current = index === activeIndex
        return (
          <li key={status} className="relative flex gap-2.5 pb-3 last:pb-0">
            {index < ORDER_STATUS_FLOW.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-[4px] top-3 h-[calc(100%-4px)] w-0.5 ${
                  done ? 'bg-violet-400' : 'bg-violet-100'
                }`}
              />
            )}
            <span
              className={`relative z-[1] mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                current
                  ? 'bg-violet-600 ring-4 ring-violet-200'
                  : done
                    ? 'bg-violet-500'
                    : 'bg-violet-200'
              }`}
            />
            <div>
              <p
                className={`text-sm font-bold ${
                  current || done ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {ORDER_STATUS_META[status].label}
              </p>
              <p className="text-xs text-slate-500">
                {ORDER_STATUS_META[status].detail}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function OrdersContent() {
  const { orders, cancelOrder, loading } = useOrders()
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered' | 'cancelled'>(
    'all',
  )
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (filter === 'all') return true
      if (filter === 'active') {
        return order.status !== 'delivered' && order.status !== 'cancelled'
      }
      if (filter === 'delivered') return order.status === 'delivered'
      return order.status === 'cancelled'
    })
  }, [orders, filter])

  const counts = useMemo(() => {
    let active = 0
    let delivered = 0
    let cancelled = 0
    for (const order of orders) {
      if (order.status === 'delivered') delivered += 1
      else if (order.status === 'cancelled') cancelled += 1
      else active += 1
    }
    return { active, delivered, cancelled, all: orders.length }
  }, [orders])

  const onCancel = (orderId: string) => {
    void (async () => {
      const result = await cancelOrder(orderId)
      if (!result.ok) {
        setMessage(result.error ?? 'Could not cancel order.')
        return
      }
      setMessage('Order cancelled.')
    })()
  }

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
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
          <linearGradient id="ordersWaveA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#ede9fe" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#faf8ff" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="ordersWaveB" x1="100%" y1="20%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f5f3ff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          fill="url(#ordersWaveA)"
          d="M0 0h880C760 160 700 260 660 420c-50 200 0 330 150 480H0V0z"
        />
        <path
          fill="url(#ordersWaveB)"
          d="M1440 0v900H640c160-100 240-240 280-400 40-180 10-320-100-500h620z"
        />
        <path
          fill="#a78bfa"
          fillOpacity="0.1"
          d="M0 680c200-40 340-10 500 50s300 70 420 30c130-40 280-20 520 30v110H0V680z"
        />
      </svg>

      <div className="page-shell page-x relative z-10 py-5">
        <header className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">
              Order history
            </p>
            <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Your orders
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {loading
                ? 'Loading orders…'
                : orders.length === 0
                  ? 'No orders yet'
                  : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
            </p>
          </div>
          {orders.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800 ring-1 ring-inset ring-amber-200">
                {counts.active} active
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                {counts.delivered} delivered
              </span>
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700 ring-1 ring-inset ring-rose-200">
                {counts.cancelled} cancelled
              </span>
            </div>
          )}
        </header>

        {orders.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(
              [
                ['all', 'All'],
                ['active', 'Active'],
                ['delivered', 'Delivered'],
                ['cancelled', 'Cancelled'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
                  filter === id
                    ? 'bg-violet-600 !text-white shadow-md shadow-violet-600/25'
                    : 'border border-violet-200 bg-white/90 text-slate-600 backdrop-blur hover:bg-violet-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {message && (
          <p className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-white/90 px-3 py-2 text-sm text-violet-800 shadow-sm">
            {message}
            <button
              type="button"
              className="font-semibold text-violet-600"
              onClick={() => setMessage('')}
            >
              Dismiss
            </button>
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-violet-200 bg-white/80 px-5 py-10 text-center shadow-sm backdrop-blur">
            <p className="font-semibold text-slate-800">
              {orders.length === 0 ? 'No orders yet' : 'No orders in this filter'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {orders.length === 0
                ? 'When you complete checkout, your orders will show up here.'
                : 'Try another filter to find more orders.'}
            </p>
            <Link
              to="/customer/shop"
              className="mt-4 inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold !text-white shadow-md shadow-violet-600/25 transition hover:bg-violet-700"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {filtered.map((order) => {
              const status = order.status as OrderStatus
              const open = expandedId === order.id
              return (
                <li
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-violet-100/90 bg-white/95 shadow-md shadow-violet-200/40 backdrop-blur"
                >
                  <button
                    type="button"
                    onClick={() => toggle(order.id)}
                    className="flex w-full items-start justify-between gap-3 p-3 text-left transition hover:bg-violet-50/40 sm:p-3.5"
                    aria-expanded={open}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <StatusBadge status={status} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatOrderDate(order.createdAt)}
                      </p>
                      <p className="mt-2 text-sm font-bold text-violet-700">
                        {formatMoney(order.total, order.currency)}
                        <span className="ml-2 font-normal text-slate-500">
                          · {order.items.length} item
                          {order.items.length === 1 ? '' : 's'}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {ORDER_STATUS_META[status].detail}
                      </p>
                    </div>
                    <span
                      className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-violet-200 bg-white text-violet-700 transition ${
                        open ? 'rotate-180 bg-violet-50' : ''
                      }`}
                      aria-hidden
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  {open && (
                    <div className="border-t border-violet-100 bg-violet-50/40 px-3 py-3 sm:px-3.5">
                      <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr] sm:gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                            Items
                          </p>
                          <ul className="mt-1.5 space-y-2">
                            {order.items.map((item) => (
                              <li
                                key={item.key}
                                className="flex items-center gap-2.5 rounded-xl border border-violet-100 bg-white p-2"
                              >
                                <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-violet-50">
                                  {item.imageUrl ? (
                                    <img
                                      src={item.imageUrl}
                                      alt=""
                                      className="h-full w-full object-contain p-1"
                                    />
                                  ) : null}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-bold uppercase tracking-wide text-violet-600">
                                    {item.brand}
                                  </p>
                                  <p className="truncate text-sm font-semibold text-slate-900">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Size {item.size} · Qty {item.quantity}
                                  </p>
                                </div>
                                <p className="shrink-0 text-sm font-bold text-violet-700">
                                  {formatMoney(
                                    item.unitPrice * item.quantity,
                                    item.currency,
                                  )}
                                </p>
                              </li>
                            ))}
                          </ul>

                          <dl className="mt-3 space-y-1 text-sm">
                            <div className="flex justify-between text-slate-600">
                              <dt>Subtotal</dt>
                              <dd>
                                {formatMoney(order.subtotal, order.currency)}
                              </dd>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <dt>Shipping</dt>
                              <dd>
                                {order.shipping === 0
                                  ? 'Free'
                                  : formatMoney(order.shipping, order.currency)}
                              </dd>
                            </div>
                            <div className="flex justify-between font-bold text-slate-900">
                              <dt>Total</dt>
                              <dd className="text-violet-700">
                                {formatMoney(order.total, order.currency)}
                              </dd>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <dt>Payment</dt>
                              <dd>{paymentLabel(order.paymentMethod)}</dd>
                            </div>
                          </dl>
                        </div>

                        <div className="rounded-2xl border border-violet-100 bg-white p-3">
                          <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                            Status timeline
                          </p>
                          <StatusTimeline order={order} />
                          {canCancelOrder(status) && (
                            <button
                              type="button"
                              onClick={() => onCancel(order.id)}
                              className="mt-3 w-full rounded-xl border border-rose-200 bg-rose-50 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                            >
                              Cancel order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}

/** Customer orders list. */
export function CustomerOrdersPage() {
  return <OrdersContent />
}
