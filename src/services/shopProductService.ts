import { getSupabase } from '../lib/supabase'
import type { DbCategory, DbProduct } from '../types/database'
import { uploadPublicImage } from './storageService'

export interface ProductInput {
  shop_id: string
  category_id: string | null
  title: string
  description: string
  price: number
  discount_price: number | null
  stock: number
  brand: string
  images: string[]
  colors: string[]
  sizes: string[]
  tags: string[]
  featured: boolean
  rating?: number
}

export async function getMyProduct(
  shopId: string,
  productId: string,
): Promise<DbProduct | null> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*, categories(id, name, slug, image)')
    .eq('shop_id', shopId)
    .eq('id', productId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data as DbProduct | null) ?? null
}

export async function createProduct(input: ProductInput): Promise<DbProduct> {
  const { data, error } = await getSupabase()
    .from('products')
    .insert({
      shop_id: input.shop_id,
      category_id: input.category_id,
      title: input.title,
      description: input.description,
      price: input.price,
      discount_price: input.discount_price,
      stock: input.stock,
      brand: input.brand,
      images: input.images,
      colors: input.colors,
      sizes: input.sizes,
      tags: input.tags,
      featured: input.featured,
      rating: input.rating ?? 0,
    })
    .select('*, categories(id, name, slug, image)')
    .single()
  if (error) throw new Error(error.message)
  return data as DbProduct
}

export async function updateProduct(
  productId: string,
  input: Omit<ProductInput, 'shop_id'>,
): Promise<DbProduct> {
  const { data, error } = await getSupabase()
    .from('products')
    .update({
      category_id: input.category_id,
      title: input.title,
      description: input.description,
      price: input.price,
      discount_price: input.discount_price,
      stock: input.stock,
      brand: input.brand,
      images: input.images,
      colors: input.colors,
      sizes: input.sizes,
      tags: input.tags,
      featured: input.featured,
    })
    .eq('id', productId)
    .select('*, categories(id, name, slug, image)')
    .single()
  if (error) throw new Error(error.message)
  return data as DbProduct
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await getSupabase()
    .from('products')
    .delete()
    .eq('id', productId)
  if (error) throw new Error(error.message)
}

export async function uploadProductImages(
  shopId: string,
  productKey: string,
  files: File[],
): Promise<string[]> {
  const urls: string[] = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]!
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${shopId}/${productKey}/${Date.now()}-${i}.${ext}`
    const url = await uploadPublicImage({
      bucket: 'product-images',
      path,
      file,
    })
    urls.push(url)
  }
  return urls
}

function slugifyCategoryName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function uploadCategoryImage(
  shopId: string,
  categoryId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  return uploadPublicImage({
    bucket: 'product-images',
    path: `${shopId}/categories/${categoryId}.${ext}`,
    file,
  })
}

export async function createCategory(input: {
  name: string
  slug?: string
  image?: string | null
}): Promise<DbCategory> {
  const slug = input.slug?.trim() || slugifyCategoryName(input.name)

  const { data, error } = await getSupabase()
    .from('categories')
    .insert({
      name: input.name.trim(),
      slug,
      image: input.image ?? null,
    })
    .select('id, name, slug, image')
    .single()
  if (error) throw new Error(error.message)
  return data as DbCategory
}

export async function updateCategory(
  id: string,
  input: { name: string; slug?: string; image?: string | null },
): Promise<DbCategory> {
  const patch: {
    name: string
    slug?: string
    image?: string | null
  } = {
    name: input.name.trim(),
  }

  if (input.slug !== undefined) {
    patch.slug = input.slug.trim() || slugifyCategoryName(input.name)
  }

  // Only overwrite image when the caller explicitly passes it
  if ('image' in input) {
    patch.image = input.image ?? null
  }

  const { data, error } = await getSupabase()
    .from('categories')
    .update(patch)
    .eq('id', id)
    .select('id, name, slug, image')
    .single()
  if (error) throw new Error(error.message)
  return data as DbCategory
}
