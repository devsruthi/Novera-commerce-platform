import { getSupabase, trySupabase } from '../lib/supabase'
import type { DbProduct, DbShop } from '../types/database'

export async function getMyShop(ownerId: string): Promise<DbShop | null> {
  const supabase = trySupabase()
  if (!supabase) return null
  const { data } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', ownerId)
    .maybeSingle()
  return (data as DbShop | null) ?? null
}

export async function updateMyShop(
  ownerId: string,
  patch: Partial<Pick<DbShop, 'shop_name' | 'description' | 'logo' | 'address'>>,
): Promise<DbShop> {
  const { data, error } = await getSupabase()
    .from('shops')
    .update(patch)
    .eq('owner_id', ownerId)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data as DbShop
}

export async function listMyProducts(shopId: string): Promise<DbProduct[]> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*, categories(id, name, slug, image)')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as DbProduct[]
}

export async function shopStats(shopId: string): Promise<{
  totalProducts: number
  inStock: number
  outOfStock: number
  lowStock: number
  featured: number
  inventoryValue: number
}> {
  const products = await listMyProducts(shopId)
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const inventoryValue = products.reduce(
    (sum, p) => sum + Number(p.price) * p.stock,
    0,
  )
  return {
    totalProducts: products.length,
    inStock: products.filter((p) => p.stock > 0).length,
    outOfStock: products.filter((p) => p.stock <= 0).length,
    lowStock,
    featured: products.filter((p) => p.featured).length,
    inventoryValue,
  }
}

export async function uploadShopLogo(shopId: string, file: File): Promise<string> {
  const { uploadPublicImage } = await import('./storageService')
  const ext = file.name.split('.').pop() || 'jpg'
  return uploadPublicImage({
    bucket: 'shop-logos',
    path: `${shopId}/logo.${ext}`,
    file,
  })
}

export async function updateMyProfile(
  userId: string,
  patch: { name?: string; phone?: string | null; avatar?: string | null },
): Promise<void> {
  const { error } = await getSupabase()
    .from('profiles')
    .update(patch)
    .eq('id', userId)
  if (error) throw new Error(error.message)
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const { uploadPublicImage } = await import('./storageService')
  const ext = file.name.split('.').pop() || 'jpg'
  return uploadPublicImage({
    bucket: 'avatars',
    path: `${userId}/avatar.${ext}`,
    file,
  })
}
