import type { Product } from '../types'

let pending: Product | null = null

export function setPendingWishlistProduct(product: Product | null) {
  pending = product
}

export function takePendingWishlistProduct(productId?: string | null) {
  if (!pending) return null
  if (productId && pending.id !== productId) return null
  const value = pending
  pending = null
  return value
}
