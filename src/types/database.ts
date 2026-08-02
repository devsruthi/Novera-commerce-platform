import type { UserRole } from './index'

export interface DbShop {
  id: string
  owner_id: string
  shop_name: string
  description: string
  logo: string | null
  address: string | null
  rating: number
  created_at: string
}

export interface DbCategory {
  id: string
  name: string
  image: string | null
  slug: string | null
}

export interface DbProduct {
  id: string
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
  rating: number
  created_at: string
  categories?: DbCategory | null
  shops?: Pick<DbShop, 'id' | 'shop_name' | 'logo'> | null
}

export interface DbProfile {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  role: UserRole
  created_at: string
}
