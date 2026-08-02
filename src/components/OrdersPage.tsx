import { useMemo, useState } from 'react'
import { useOrders } from '../context/OrdersContext'
import { formatMoney } from '../lib/catalogApi'
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_META,
  canCancelOrder,
  formatOrderDate,
  paymentLabel,
} from '../lib/orders'
import type { Order, OrderStatus } from '../types'

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`order-status-badge is-${status}`}>
      {ORDER_STATUS_META[status].label}
    </span>
  )
}

function StatusTimeline({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <ol className="order-timeline is-cancelled">
        <li className="is-done is-cancelled-step">
          <span className="order-timeline-dot" />
          <div>
            <strong>{ORDER_STATUS_META.cancelled.label}</strong>
            <p>{ORDER_STATUS_META.cancelled.detail}</p>
          </div>
        </li>
      </ol>
    )
  }

  const activeIndex = ORDER_STATUS_FLOW.indexOf(order.status)

  return (
    <ol className="order-timeline">
      {ORDER_STATUS_FLOW.map((status, index) => {
        const state =
          index < activeIndex ? 'is-done' : index === activeIndex ? 'is-current' : ''
        return (
          <li key={status} className={state}>
            <span className="order-timeline-dot" />
            <div>
              <strong>{ORDER_STATUS_META[status].label}</strong>
              <p>{ORDER_STATUS_META[status].detail}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function OrdersPage() {
  const { orders, closeOrders, cancelOrder, loading } = useOrders()
  const [expandedId, setExpandedId] = useState<string | null>(orders[0]?.id ?? null)
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
    <main className="orders-page">
      <div className="orders-page-inner">
        <header className="orders-page-header">
          <div>
            <button type="button" className="back-btn" onClick={closeOrders}>
              <span aria-hidden>←</span>
              Back to shopping
            </button>
            <h1>Your orders</h1>
            <p className="cart-subtitle">
              {loading
                ? 'Loading orders…'
                : orders.length === 0
                  ? 'No orders yet'
                  : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </header>

        {orders.length > 0 && (
          <div className="orders-filters" role="tablist" aria-label="Filter orders">
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
                role="tab"
                aria-selected={filter === id}
                className={filter === id ? 'is-active' : ''}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {message && (
          <p className="orders-banner" role="status">
            {message}
            <button type="button" onClick={() => setMessage('')}>
              Dismiss
            </button>
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="orders-empty-panel">
            <p className="cart-success-title">
              {orders.length === 0 ? 'No orders yet' : 'No orders in this filter'}
            </p>
            <p>
              {orders.length === 0
                ? 'When you complete checkout, your order will appear here with live status updates.'
                : 'Try another filter to find older or cancelled orders.'}
            </p>
            <button type="button" className="solid-btn" onClick={closeOrders}>
              Continue shopping
            </button>
          </div>
        ) : (
          <ul className="orders-list">
            {filtered.map((order) => {
              const open = expandedId === order.id
              const itemCount = order.items.reduce((sum, line) => sum + line.quantity, 0)
              return (
                <li key={order.id} className={`order-card ${open ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="order-card-toggle"
                    onClick={() => setExpandedId(open ? null : order.id)}
                    aria-expanded={open}
                  >
                    <div className="order-card-main">
                      <div className="order-card-thumbs" aria-hidden>
                        {order.items.slice(0, 3).map((line) =>
                          line.imageUrl ? (
                            <img key={line.key} src={line.imageUrl} alt="" />
                          ) : (
                            <span key={line.key} className="order-thumb-fallback" />
                          ),
                        )}
                      </div>
                      <div>
                        <p className="order-id">{order.id}</p>
                        <p className="order-meta">
                          {formatOrderDate(order.createdAt)} · {itemCount} item
                          {itemCount === 1 ? '' : 's'} · {paymentLabel(order.paymentMethod)}
                        </p>
                      </div>
                    </div>
                    <div className="order-card-side">
                      <StatusBadge status={order.status} />
                      <strong>{formatMoney(order.total, order.currency)}</strong>
                    </div>
                  </button>

                  {open && (
                    <div className="order-card-body">
                      <StatusTimeline order={order} />

                      <ul className="order-lines">
                        {order.items.map((line) => (
                          <li key={line.key}>
                            <div className="order-line-media">
                              {line.imageUrl ? (
                                <img src={line.imageUrl} alt="" />
                              ) : (
                                <div className="product-image-fallback" />
                              )}
                            </div>
                            <div>
                              <p className="cart-line-brand">{line.brand}</p>
                              <h3>{line.name}</h3>
                              <p className="order-line-meta">
                                Size {line.size} · Qty {line.quantity}
                              </p>
                            </div>
                            <p className="cart-line-price">
                              {formatMoney(line.unitPrice * line.quantity, line.currency)}
                            </p>
                          </li>
                        ))}
                      </ul>

                      <div className="order-totals">
                        <div>
                          <span>Subtotal</span>
                          <span>{formatMoney(order.subtotal, order.currency)}</span>
                        </div>
                        <div>
                          <span>Shipping</span>
                          <span>
                            {order.shipping === 0
                              ? 'Free'
                              : formatMoney(order.shipping, order.currency)}
                          </span>
                        </div>
                        <div className="is-total">
                          <span>Total</span>
                          <span>{formatMoney(order.total, order.currency)}</span>
                        </div>
                      </div>

                      {canCancelOrder(order.status) && (
                        <div className="order-card-actions">
                          <button
                            type="button"
                            className="ghost-btn"
                            onClick={() => onCancel(order.id)}
                          >
                            Cancel order
                          </button>
                        </div>
                      )}
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
