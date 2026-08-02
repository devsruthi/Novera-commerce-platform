import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Order, PaymentMethod } from '../types'
import { canCancelOrder, statusFromAge } from '../lib/orders'
import {
  cancelOrderRemote,
  createOrderRemote,
  fetchOrders,
  updateOrderStatusRemote,
} from '../lib/db/orders'
import { clearCartItems } from '../lib/db/cart'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface CreateOrderInput {
  items: CartItem[]
  paymentMethod: PaymentMethod
  subtotal: number
  shipping: number
  total: number
  currency: string
}

interface OrdersContextValue {
  orders: Order[]
  isOpen: boolean
  loading: boolean
  openOrders: () => void
  closeOrders: () => void
  refreshOrders: () => Promise<void>
  createOrder: (input: CreateOrderInput) => Promise<Order>
  cancelOrder: (orderId: string) => Promise<{ ok: boolean; error?: string }>
  getOrder: (orderId: string) => Order | undefined
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

function withLiveStatus(orders: Order[]): Order[] {
  return orders.map((order) => {
    if (order.status === 'cancelled') return order
    const next = statusFromAge(order.createdAt, order.cancelledAt)
    if (next === order.status) return order
    return { ...order, status: next, updatedAt: Date.now() }
  })
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ordersRef = useRef(orders)
  ordersRef.current = orders

  const refreshOrders = useCallback(async () => {
    if (!user || !isSupabaseConfigured) {
      setOrders([])
      return
    }
    setLoading(true)
    try {
      const remote = await fetchOrders(user.id)
      setOrders(withLiveStatus(remote))
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refreshOrders()
  }, [refreshOrders])

  useEffect(() => {
    if (!isOpen) return
    void refreshOrders()
  }, [isOpen, refreshOrders])

  // Demo status progression + persist to Supabase when status changes
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return
    const id = window.setInterval(() => {
      setOrders((prev) => {
        const next = withLiveStatus(prev)
        for (let i = 0; i < next.length; i++) {
          if (next[i].status !== prev[i]?.status && next[i].status !== 'cancelled') {
            void updateOrderStatusRemote(user.id, next[i].id, next[i].status).catch(
              () => {},
            )
          }
        }
        const changed = next.some((order, i) => order.status !== prev[i]?.status)
        return changed ? next : prev
      })
    }, 2000)
    return () => window.clearInterval(id)
  }, [user])

  const createOrder = useCallback(
    async (input: CreateOrderInput) => {
      if (!user) throw new Error('Sign in required')
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured')
      }

      const order = await createOrderRemote({
        userId: user.id,
        items: input.items,
        paymentMethod: input.paymentMethod,
        subtotal: input.subtotal,
        shipping: input.shipping,
        total: input.total,
        currency: input.currency,
      })

      await clearCartItems(user.id).catch(() => {})

      setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)])
      return order
    },
    [user],
  )

  const cancelOrder = useCallback(
    async (orderId: string) => {
      if (!user) return { ok: false, error: 'Sign in required.' }
      const current = ordersRef.current.find((order) => order.id === orderId)
      if (!current) return { ok: false, error: 'Order not found.' }
      if (!canCancelOrder(current.status)) {
        return { ok: false, error: 'This order can no longer be cancelled.' }
      }
      try {
        const updated = await cancelOrderRemote(user.id, orderId)
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? updated : order)),
        )
        return { ok: true }
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : 'Could not cancel order.',
        }
      }
    },
    [user],
  )

  const getOrder = useCallback(
    (orderId: string) => orders.find((order) => order.id === orderId),
    [orders],
  )

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders,
      isOpen,
      loading,
      openOrders: () => setIsOpen(true),
      closeOrders: () => setIsOpen(false),
      refreshOrders,
      createOrder,
      cancelOrder,
      getOrder,
    }),
    [orders, isOpen, loading, refreshOrders, createOrder, cancelOrder, getOrder],
  )

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
