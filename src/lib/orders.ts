import type { Order, OrderStatus } from '../types'

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'placed',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
]

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; detail: string }
> = {
  placed: {
    label: 'Order placed',
    detail: 'We’ve received your order.',
  },
  confirmed: {
    label: 'Confirmed',
    detail: 'Payment confirmed — preparing your items.',
  },
  processing: {
    label: 'Processing',
    detail: 'Your order is being packed.',
  },
  shipped: {
    label: 'Shipped',
    detail: 'On the way to the carrier hub.',
  },
  out_for_delivery: {
    label: 'Out for delivery',
    detail: 'Your package is out for delivery today.',
  },
  delivered: {
    label: 'Delivered',
    detail: 'Delivered — enjoy your new look.',
  },
  cancelled: {
    label: 'Cancelled',
    detail: 'This order was cancelled.',
  },
}

/** Demo timeline: advance automatically based on order age. */
export function statusFromAge(createdAt: number, cancelledAt?: number): OrderStatus {
  if (cancelledAt) return 'cancelled'
  const seconds = (Date.now() - createdAt) / 1000
  if (seconds >= 50) return 'delivered'
  if (seconds >= 34) return 'out_for_delivery'
  if (seconds >= 22) return 'shipped'
  if (seconds >= 12) return 'processing'
  if (seconds >= 5) return 'confirmed'
  return 'placed'
}

export function canCancelOrder(status: OrderStatus): boolean {
  return status === 'placed' || status === 'confirmed' || status === 'processing'
}

export function paymentLabel(method: Order['paymentMethod']): string {
  switch (method) {
    case 'card':
      return 'Card'
    case 'paypal':
      return 'PayPal'
    case 'applepay':
      return 'Apple Pay'
    case 'klarna':
      return 'Klarna'
  }
}

export function formatOrderDate(ts: number): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ts))
}
