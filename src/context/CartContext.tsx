import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, PaymentMethod, Product } from '../types'
import { getEffectiveStock, markAlertNotified } from '../lib/stockAlerts'
import type { StockAvailableDetail } from '../lib/stockAlerts'
import { cacheGet, cacheKeys, cacheRemove, cacheSet } from '../lib/localCache'
import {
  clearCartItems,
  fetchCartItems,
  removeCartItem,
  replaceCartItems,
  setCartItemQuantity,
  upsertCartItem,
} from '../lib/db/cart'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface CartCache {
  items: CartItem[]
  paymentMethod: PaymentMethod
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  paymentMethod: PaymentMethod
  itemCount: number
  subtotal: number
  currency: string
  snackbar: string | null
  openCart: () => void
  closeCart: () => void
  addToCart: (product: Product, size: string, quantity?: number) => {
    ok: boolean
    error?: string
  }
  setItemQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
  setPaymentMethod: (method: PaymentMethod) => void
  showSnackbar: (message: string) => void
  dismissSnackbar: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function itemKey(productId: string, size: string) {
  return `${productId}::${size}`
}

function parseKey(key: string) {
  const idx = key.lastIndexOf('::')
  return {
    productId: key.slice(0, idx),
    size: key.slice(idx + 2),
  }
}

function readGuestCart(): CartCache {
  const cached = cacheGet<CartCache>(cacheKeys.cart(cacheKeys.guestId))
  if (!cached || !Array.isArray(cached.items)) {
    return { items: [], paymentMethod: 'card' }
  }
  return {
    items: cached.items,
    paymentMethod: cached.paymentMethod ?? 'card',
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>(() => readGuestCart().items)
  const [isOpen, setIsOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    () => readGuestCart().paymentMethod,
  )
  const [snackbar, setSnackbar] = useState<string | null>(null)
  // Load / merge cart when auth changes
  useEffect(() => {
    let cancelled = false

    void (async () => {
      if (!user) {
        const guest = readGuestCart()
        if (!cancelled) {
          setItems(guest.items)
          setPaymentMethod(guest.paymentMethod)
        }
        return
      }

      if (!isSupabaseConfigured) {
        if (!cancelled) setItems([])
        return
      }

      try {
        const remote = await fetchCartItems(user.id)
        const guest = readGuestCart()
        if (guest.items.length > 0) {
          const map = new Map<string, CartItem>()
          for (const item of remote) map.set(item.key, item)
          for (const item of guest.items) {
            const existing = map.get(item.key)
            if (existing) {
              map.set(item.key, {
                ...existing,
                quantity: existing.quantity + item.quantity,
                product: item.product,
              })
            } else {
              map.set(item.key, item)
            }
          }
          const merged = [...map.values()]
          await replaceCartItems(user.id, merged)
          cacheRemove(cacheKeys.cart(cacheKeys.guestId))
          if (!cancelled) setItems(merged)
        } else if (!cancelled) {
          setItems(remote)
        }
      } catch {
        if (!cancelled) setItems([])
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id])

  // Persist guest cart locally
  useEffect(() => {
    if (user) return
    cacheSet(cacheKeys.cart(cacheKeys.guestId), {
      items,
      paymentMethod,
    } satisfies CartCache)
  }, [items, paymentMethod, user])

  useEffect(() => {
    if (!snackbar) return
    const timer = window.setTimeout(() => setSnackbar(null), 4200)
    return () => window.clearTimeout(timer)
  }, [snackbar])

  const showSnackbar = useCallback((message: string) => {
    setSnackbar(message)
  }, [])

  const dismissSnackbar = useCallback(() => {
    setSnackbar(null)
  }, [])

  useEffect(() => {
    const onAvailable = (event: Event) => {
      const detail = (event as CustomEvent<StockAvailableDetail>).detail
      if (!detail?.productName) return
      void markAlertNotified(detail.productId, detail.size, user?.id)
      setSnackbar(
        `${detail.productName}${detail.size ? ` (${detail.size})` : ''} is available again — add it to your cart.`,
      )
    }
    window.addEventListener('styla:stock-available', onAvailable)
    return () => window.removeEventListener('styla:stock-available', onAvailable)
  }, [user?.id])

  const addToCart = useCallback(
    (product: Product, size: string, quantity = 1) => {
      const available = getEffectiveStock(
        product.id,
        size,
        product.inStock,
        product.stockCount,
      )
      if (!size) return { ok: false, error: 'Choose a size first.' }
      if (available <= 0) return { ok: false, error: 'This size is sold out.' }

      const key = itemKey(product.id, size)
      let nextQty = quantity

      setItems((prev) => {
        const existing = prev.find((i) => i.key === key)
        nextQty = Math.min(available, (existing?.quantity ?? 0) + quantity)
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, quantity: nextQty, product } : i,
          )
        }
        return [
          ...prev,
          { key, product, size, quantity: Math.min(available, quantity) },
        ]
      })

      if (user && isSupabaseConfigured) {
        void upsertCartItem(
          user.id,
          product,
          size,
          Math.min(available, nextQty),
        ).catch(() => {
          /* keep optimistic cart */
        })
      }

      return { ok: true }
    },
    [user],
  )

  const setItemQuantity = useCallback(
    (key: string, quantity: number) => {
      const { productId, size } = parseKey(key)
      setItems((prev) =>
        prev
          .map((item) => {
            if (item.key !== key) return item
            const max = getEffectiveStock(
              item.product.id,
              item.size,
              item.product.inStock,
              item.product.stockCount,
            )
            const next = Math.min(max, Math.max(0, quantity))
            return { ...item, quantity: next }
          })
          .filter((item) => item.quantity > 0),
      )

      if (user && isSupabaseConfigured) {
        void setCartItemQuantity(user.id, productId, size, quantity).catch(
          () => {},
        )
      }
    },
    [user],
  )

  const removeItem = useCallback(
    (key: string) => {
      const { productId, size } = parseKey(key)
      setItems((prev) => prev.filter((item) => item.key !== key))
      if (user && isSupabaseConfigured) {
        void removeCartItem(user.id, productId, size).catch(() => {})
      }
    },
    [user],
  )

  const clearCart = useCallback(() => {
    setItems([])
    if (user && isSupabaseConfigured) {
      void clearCartItems(user.id).catch(() => {})
    } else {
      cacheRemove(cacheKeys.cart(cacheKeys.guestId))
    }
  }, [user])

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  )

  const currency = items[0]?.product.currency ?? 'EUR'

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      paymentMethod,
      itemCount,
      subtotal,
      currency,
      snackbar,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart,
      setItemQuantity,
      removeItem,
      clearCart,
      setPaymentMethod,
      showSnackbar,
      dismissSnackbar,
    }),
    [
      items,
      isOpen,
      paymentMethod,
      itemCount,
      subtotal,
      currency,
      snackbar,
      addToCart,
      setItemQuantity,
      removeItem,
      clearCart,
      showSnackbar,
      dismissSnackbar,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
