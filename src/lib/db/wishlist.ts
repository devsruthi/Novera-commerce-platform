/**
 * Wishlist persistence — Phase 2 `wishlist` table (FK to products).
 * Adapters keep ShopContext / AI Discover call sites working.
 */
import type { Product } from '../../types'
import {
  addWishlistItem as addById,
  fetchWishlist as fetchRemote,
  removeWishlistItem as removeById,
} from '../../services/wishlistService'

export async function fetchWishlist(userId: string): Promise<Product[]> {
  return fetchRemote(userId)
}

export async function addWishlistItem(
  userId: string,
  product: Product,
): Promise<void> {
  await addById(userId, product.id)
}

export async function removeWishlistItem(
  userId: string,
  productId: string,
): Promise<void> {
  await removeById(userId, productId)
}

export async function replaceWishlist(
  userId: string,
  products: Product[],
): Promise<void> {
  const current = await fetchRemote(userId)
  const nextIds = new Set(products.map((p) => p.id))
  await Promise.all(
    current
      .filter((p) => !nextIds.has(p.id))
      .map((p) => removeById(userId, p.id)),
  )
  await Promise.all(
    products
      .filter((p) => !current.some((c) => c.id === p.id))
      .map((p) => addById(userId, p.id)),
  )
}
