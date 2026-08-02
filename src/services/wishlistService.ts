import { getSupabase } from '../lib/supabase'
import type { Product } from '../types'
import type { DbProduct } from '../types/database'
import { mapDbProduct } from './productService'

const PRODUCT_SELECT =
  'product_id, products(*, categories(id, name, slug, image), shops(id, shop_name, logo))'

export async function fetchWishlist(userId: string): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from('wishlist')
    .select(PRODUCT_SELECT)
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? [])
    .map((row) => {
      const product = (row as { products?: DbProduct | null }).products
      return product ? mapDbProduct(product) : null
    })
    .filter((p): p is Product => !!p)
}

export async function addWishlistItem(
  userId: string,
  productId: string,
): Promise<void> {
  const { error } = await getSupabase().from('wishlist').upsert(
    { customer_id: userId, product_id: productId },
    { onConflict: 'customer_id,product_id' },
  )
  if (error) throw new Error(error.message)
}

export async function removeWishlistItem(
  userId: string,
  productId: string,
): Promise<void> {
  const { error } = await getSupabase()
    .from('wishlist')
    .delete()
    .eq('customer_id', userId)
    .eq('product_id', productId)
  if (error) throw new Error(error.message)
}

export async function isInWishlist(
  userId: string,
  productId: string,
): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from('wishlist')
    .select('id')
    .eq('customer_id', userId)
    .eq('product_id', productId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return Boolean(data)
}
