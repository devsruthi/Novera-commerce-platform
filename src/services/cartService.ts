import { getSupabase } from '../lib/supabase'
import type { CartItem, Product } from '../types'
import type { DbProduct } from '../types/database'
import { mapDbProduct } from './productService'

const LINE_SELECT =
  'id, product_id, size, quantity, products(*, categories(id, name, slug, image), shops(id, shop_name, logo))'

/** Nested FK select is typed loosely by Supabase; normalize object vs one-element array. */
function nestedProduct(value: unknown): DbProduct | null {
  if (!value) return null
  if (Array.isArray(value)) {
    const first = value[0]
    return first ? (first as DbProduct) : null
  }
  return value as DbProduct
}

async function getOrCreateCartId(userId: string): Promise<string> {
  const supabase = getSupabase()
  const { data: existing } = await supabase
    .from('carts')
    .select('id')
    .eq('customer_id', userId)
    .maybeSingle()
  if (existing?.id) return existing.id as string

  const { data, error } = await supabase
    .from('carts')
    .insert({ customer_id: userId })
    .select('id')
    .single()
  if (error) {
    // race: another request created it
    const { data: again, error: againErr } = await supabase
      .from('carts')
      .select('id')
      .eq('customer_id', userId)
      .single()
    if (againErr || !again) throw new Error(error.message)
    return again.id as string
  }
  return data.id as string
}

function lineToItem(row: {
  product_id: string
  size: string
  quantity: number
  products?: unknown
}): CartItem | null {
  const product = nestedProduct(row.products)
  if (!product) return null
  return {
    key: `${row.product_id}::${row.size}`,
    product: mapDbProduct(product),
    size: row.size,
    quantity: row.quantity,
  }
}

export async function fetchCartItems(userId: string): Promise<CartItem[]> {
  const cartId = await getOrCreateCartId(userId)
  const { data, error } = await getSupabase()
    .from('cart_lines')
    .select(LINE_SELECT)
    .eq('cart_id', cartId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? [])
    .map((row) =>
      lineToItem({
        product_id: String(row.product_id),
        size: String(row.size),
        quantity: Number(row.quantity),
        products: row.products,
      }),
    )
    .filter((item): item is CartItem => !!item)
}

export async function upsertCartItem(
  userId: string,
  product: Product,
  size: string,
  quantity: number,
): Promise<void> {
  const cartId = await getOrCreateCartId(userId)
  const { error } = await getSupabase().from('cart_lines').upsert(
    {
      cart_id: cartId,
      product_id: product.id,
      size,
      quantity,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'cart_id,product_id,size' },
  )
  if (error) throw new Error(error.message)
}

export async function setCartItemQuantity(
  userId: string,
  productId: string,
  size: string,
  quantity: number,
): Promise<void> {
  if (quantity <= 0) {
    await removeCartItem(userId, productId, size)
    return
  }
  const cartId = await getOrCreateCartId(userId)
  const { error } = await getSupabase()
    .from('cart_lines')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .eq('size', size)
  if (error) throw new Error(error.message)
}

export async function removeCartItem(
  userId: string,
  productId: string,
  size: string,
): Promise<void> {
  const cartId = await getOrCreateCartId(userId)
  const { error } = await getSupabase()
    .from('cart_lines')
    .delete()
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .eq('size', size)
  if (error) throw new Error(error.message)
}

export async function clearCartItems(userId: string): Promise<void> {
  const cartId = await getOrCreateCartId(userId)
  const { error } = await getSupabase()
    .from('cart_lines')
    .delete()
    .eq('cart_id', cartId)
  if (error) throw new Error(error.message)
}

export async function replaceCartItems(
  userId: string,
  items: CartItem[],
): Promise<void> {
  await clearCartItems(userId)
  if (items.length === 0) return
  const cartId = await getOrCreateCartId(userId)
  const { error } = await getSupabase().from('cart_lines').insert(
    items.map((item) => ({
      cart_id: cartId,
      product_id: item.product.id,
      size: item.size,
      quantity: item.quantity,
    })),
  )
  if (error) throw new Error(error.message)
}
