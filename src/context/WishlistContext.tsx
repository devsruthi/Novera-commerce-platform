import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types'
import {
  addWishlistItem,
  fetchWishlist,
  removeWishlistItem,
} from '../services/wishlistService'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface WishlistContextValue {
  items: Product[]
  loading: boolean
  isWished: (productId: string) => boolean
  toggle: (product: Product) => void
  remove: (productId: string) => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.id || !isSupabaseConfigured) {
      setItems([])
      return
    }
    let cancelled = false
    setLoading(true)
    void fetchWishlist(user.id)
      .then((list) => {
        if (!cancelled) setItems(list)
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const isWished = useCallback(
    (productId: string) => items.some((p) => p.id === productId),
    [items],
  )

  const toggle = useCallback(
    (product: Product) => {
      if (!user?.id || !isSupabaseConfigured) return
      const exists = items.some((p) => p.id === product.id)
      setItems((prev) =>
        exists ? prev.filter((p) => p.id !== product.id) : [...prev, product],
      )
      void (exists
        ? removeWishlistItem(user.id, product.id)
        : addWishlistItem(user.id, product.id)
      ).catch(() => {})
    },
    [items, user?.id],
  )

  const remove = useCallback(
    (productId: string) => {
      if (!user?.id || !isSupabaseConfigured) return
      setItems((prev) => prev.filter((p) => p.id !== productId))
      void removeWishlistItem(user.id, productId).catch(() => {})
    },
    [user?.id],
  )

  const value = useMemo(
    () => ({ items, loading, isWished, toggle, remove }),
    [items, loading, isWished, toggle, remove],
  )

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
