export type Category =
  | 'dresses'
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'shoes'
  | 'accessories'
  | 'electronics'
  | 'other'

export type Occasion =
  | 'wedding'
  | 'office'
  | 'casual'
  | 'party'
  | 'date'
  | 'sport'
  | 'travel'

export type Color =
  | 'black'
  | 'white'
  | 'blue'
  | 'navy'
  | 'red'
  | 'green'
  | 'beige'
  | 'pink'
  | 'grey'
  | 'brown'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'multicolor'

export type UserRole = 'customer' | 'shop_owner'

export type ProductSource =
  | 'supabase'
  | 'ebay'
  | 'bestbuy'
  | 'dummyjson'
  | 'fakestore'
  | 'serpapi'

export interface Profile {
  id: string
  name: string
  email: string
  phone: string | null
  avatar: string | null
  role: UserRole
  created_at?: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: Category
  colors: Color[]
  price: number
  originalPrice?: number
  currency: string
  occasions: Occasion[]
  tags: string[]
  sizes: string[]
  rating: number
  reviewCount: number
  imageUrl: string
  /** Full gallery when available; `imageUrl` is the primary/cover. */
  images?: string[]
  productUrl?: string
  description: string
  inStock: boolean
  /** Units available when known; otherwise inferred client-side */
  stockCount?: number
  featured?: boolean
  createdAt?: string
  source: ProductSource
}

export interface SearchFilters {
  query: string
  categories: Category[]
  colors: Color[]
  occasions: Occasion[]
  maxPrice: number | null
  minPrice: number | null
  brands: string[]
  sizes: string[]
  tags: string[]
}

export interface MatchReason {
  label: string
  weight: number
}

export interface RankedProduct {
  product: Product
  score: number
  reasons: MatchReason[]
  summary: string
}

export interface ParseResult {
  filters: SearchFilters
  interpretation: string
  confidence: number
  suggestions: string[]
}

export interface User {
  id: string
  name: string
  email: string
  username: string
  phone?: string | null
  avatar?: string | null
  role: UserRole
  /** Present when signed in via Supabase session */
  token?: string
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating'

export type FeatureMode =
  | 'search'
  | 'outfit'
  | 'compare'
  | 'assistant'
  | 'reviews'

export interface CatalogResponse {
  products: Product[]
  source: ProductSource
  sources: ProductSource[]
  note?: string
  /** Offset to request for the next page (Load more) */
  nextStart?: number | null
  hasMore?: boolean
  /** Exact match count when available from Supabase */
  total?: number
}

export interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  text: string
}

export type PaymentMethod = 'card' | 'paypal' | 'applepay' | 'klarna'

export interface CartItem {
  key: string
  product: Product
  size: string
  quantity: number
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export interface OrderLine {
  key: string
  productId: string
  name: string
  brand: string
  imageUrl: string
  size: string
  quantity: number
  unitPrice: number
  currency: string
}

export interface Order {
  id: string
  createdAt: number
  updatedAt: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  items: OrderLine[]
  subtotal: number
  shipping: number
  total: number
  currency: string
  cancelledAt?: number
}
