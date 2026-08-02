import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../../context/OrdersContext'
import { formatMoney } from '../../lib/catalogApi'
import {
  ORDER_STATUS_META,
  canCancelOrder,
  formatOrderDate,
} from '../../lib/orders'
import type { OrderStatus } from '../../types'

function OrdersContent() {
  const { orders, cancelOrder, loading } = useOrders()
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered' | 'cancelled'>(
    'all',
  )
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

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your orders</h1>
      <p className="mt-1 text-sm text-slate-500">
        {loading
          ? 'Loading orders…'
          : orders.length === 0
            ? 'No orders yet'
            : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
      </p>

      {orders.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
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
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                filter === id
                  ? 'bg-violet-600 !text-white shadow-sm'
                  : 'border border-violet-200 bg-white text-slate-600 hover:bg-violet-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {message && (
        <p className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-violet-50 px-4 py-2.5 text-sm text-violet-800">
          {message}
          <button
            type="button"
            className="font-semibold"
            onClick={() => setMessage('')}
          >
            Dismiss
          </button>
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-violet-200 bg-white px-6 py-14 text-center">
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
            className="mt-5 inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold !text-white shadow-md shadow-violet-600/25 transition hover:bg-violet-700"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((order) => {
            const status = order.status as OrderStatus
            return (
              <li
                key={order.id}
                className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm shadow-violet-100/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                    {ORDER_STATUS_META[status].label}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-violet-700">
                  {formatMoney(order.total, order.currency)}
                  <span className="ml-2 font-normal text-slate-500">
                    · {order.items.length} item{order.items.length === 1 ? '' : 's'}
                  </span>
                </p>
                {canCancelOrder(order) && (
                  <button
                    type="button"
                    onClick={() => onCancel(order.id)}
                    className="mt-3 text-sm font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Cancel order
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}

/** Customer orders list. */
export function CustomerOrdersPage() {
  return <OrdersContent />
}
