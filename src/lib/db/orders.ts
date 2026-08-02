import type {
  CartItem,
  Order,
  OrderLine,
  OrderStatus,
  PaymentMethod,
} from '../../types'
import { getSupabase } from '../supabase'

interface OrderRow {
  id: string
  status: OrderStatus
  payment_method: PaymentMethod
  subtotal: number
  shipping: number
  total: number
  currency: string
  cancelled_at: string | null
  created_at: string
  updated_at: string
  order_items?: Array<{
    id: string
    product_id: string
    name: string
    brand: string
    image_url: string
    size: string
    quantity: number
    unit_price: number
    currency: string
  }>
}

function mapOrder(row: OrderRow): Order {
  const items: OrderLine[] = (row.order_items ?? []).map((line) => ({
    key: line.id,
    productId: line.product_id,
    name: line.name,
    brand: line.brand,
    imageUrl: line.image_url,
    size: line.size,
    quantity: line.quantity,
    unitPrice: Number(line.unit_price),
    currency: line.currency,
  }))
  return {
    id: row.id,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    status: row.status,
    paymentMethod: row.payment_method,
    items,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    currency: row.currency,
    cancelledAt: row.cancelled_at
      ? new Date(row.cancelled_at).getTime()
      : undefined,
  }
}

export async function fetchOrders(userId: string): Promise<Order[]> {
  const { data, error } = await getSupabase()
    .from('orders')
    .select(
      'id, status, payment_method, subtotal, shipping, total, currency, cancelled_at, created_at, updated_at, order_items(*)',
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as OrderRow[] | null)?.map(mapOrder) ?? []
}

export async function createOrderRemote(input: {
  userId: string
  items: CartItem[]
  paymentMethod: PaymentMethod
  subtotal: number
  shipping: number
  total: number
  currency: string
}): Promise<Order> {
  const supabase = getSupabase()
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: input.userId,
      status: 'placed',
      payment_method: input.paymentMethod,
      subtotal: input.subtotal,
      shipping: input.shipping,
      total: input.total,
      currency: input.currency,
    })
    .select(
      'id, status, payment_method, subtotal, shipping, total, currency, cancelled_at, created_at, updated_at',
    )
    .single()

  if (error) throw error

  const lines = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    name: item.product.name,
    brand: item.product.brand,
    image_url: item.product.imageUrl,
    size: item.size,
    quantity: item.quantity,
    unit_price: item.product.price,
    currency: item.product.currency,
  }))

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .insert(lines)
    .select(
      'id, product_id, name, brand, image_url, size, quantity, unit_price, currency',
    )

  if (itemsError) throw itemsError

  return mapOrder({
    ...(order as OrderRow),
    order_items: items ?? [],
  })
}

export async function cancelOrderRemote(
  userId: string,
  orderId: string,
): Promise<Order> {
  const now = new Date().toISOString()
  const { data, error } = await getSupabase()
    .from('orders')
    .update({
      status: 'cancelled',
      cancelled_at: now,
      updated_at: now,
    })
    .eq('id', orderId)
    .eq('user_id', userId)
    .select(
      'id, status, payment_method, subtotal, shipping, total, currency, cancelled_at, created_at, updated_at, order_items(*)',
    )
    .single()

  if (error) throw error
  return mapOrder(data as OrderRow)
}

export async function updateOrderStatusRemote(
  userId: string,
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  const { error } = await getSupabase()
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .eq('user_id', userId)
  if (error) throw error
}
