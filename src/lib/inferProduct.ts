import type { Category, Color, Occasion, ProductSource } from '../types'

const COLOR_WORDS: Array<{ word: string; color: Color }> = [
  { word: 'navy', color: 'navy' },
  { word: 'black', color: 'black' },
  { word: 'white', color: 'white' },
  { word: 'blue', color: 'blue' },
  { word: 'red', color: 'red' },
  { word: 'green', color: 'green' },
  { word: 'beige', color: 'beige' },
  { word: 'cream', color: 'beige' },
  { word: 'pink', color: 'pink' },
  { word: 'grey', color: 'grey' },
  { word: 'gray', color: 'grey' },
  { word: 'brown', color: 'brown' },
  { word: 'yellow', color: 'yellow' },
  { word: 'gold', color: 'yellow' },
  { word: 'purple', color: 'purple' },
  { word: 'orange', color: 'orange' },
  { word: 'coral', color: 'orange' },
]

const CATEGORY_RULES: Array<{ pattern: RegExp; category: Category }> = [
  { pattern: /\b(dress|gown|frock|jumpsuit)\b/i, category: 'dresses' },
  { pattern: /\b(blazer|coat|jacket|parka|hoodie)\b/i, category: 'outerwear' },
  { pattern: /\b(shoe|boot|sneaker|heel|sandal|loafer)\b/i, category: 'shoes' },
  { pattern: /\b(bag|watch|earring|scarf|jewelry|sunglass|hat|belt)\b/i, category: 'accessories' },
  { pattern: /\b(trouser|pant|skirt|jean|legging|short)\b/i, category: 'bottoms' },
  { pattern: /\b(shirt|top|blouse|knit|sweater|tee|t-shirt|camisole)\b/i, category: 'tops' },
  {
    pattern: /\b(laptop|phone|tablet|tv|headphone|camera|electronics?)\b/i,
    category: 'electronics',
  },
]

const OCCASION_RULES: Array<{ pattern: RegExp; occasion: Occasion }> = [
  { pattern: /\b(wedding|bridal|ceremony|guest)\b/i, occasion: 'wedding' },
  { pattern: /\b(office|work|business|formal)\b/i, occasion: 'office' },
  { pattern: /\b(party|cocktail|evening|club)\b/i, occasion: 'party' },
  { pattern: /\b(date|romantic|dinner)\b/i, occasion: 'date' },
  { pattern: /\b(sport|running|gym|athletic|training)\b/i, occasion: 'sport' },
  { pattern: /\b(travel|vacation|holiday)\b/i, occasion: 'travel' },
  { pattern: /\b(casual|everyday|weekend)\b/i, occasion: 'casual' },
]

export function inferColors(text: string): Color[] {
  const lower = text.toLowerCase()
  const hits = COLOR_WORDS.filter(({ word }) =>
    new RegExp(`\\b${word}\\b`, 'i').test(lower),
  ).map(({ color }) => color)
  return [...new Set(hits)]
}

export function inferCategory(text: string, fallback: Category = 'other'): Category {
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(text)) return rule.category
  }
  return fallback
}

export function inferOccasions(text: string): Occasion[] {
  const hits = OCCASION_RULES.filter((r) => r.pattern.test(text)).map(
    (r) => r.occasion,
  )
  return hits.length ? [...new Set(hits)] : ['casual']
}

export function inferTags(text: string): string[] {
  const tags = [
    'midi',
    'mini',
    'maxi',
    'satin',
    'silk',
    'linen',
    'leather',
    'denim',
    'wool',
    'cotton',
    'elegant',
    'summer',
    'winter',
    'sport',
    'wireless',
  ]
  const lower = text.toLowerCase()
  return tags.filter((t) => lower.includes(t))
}

export function buildCatalogQuery(parts: {
  query: string
  colors: string[]
  categories: string[]
  occasions: string[]
  tags: string[]
  brands: string[]
}): string {
  const tokens = [
    ...parts.colors,
    ...parts.categories,
    ...parts.occasions,
    ...parts.tags,
    ...parts.brands,
  ]
  const base = parts.query.trim()
  // Prefer structured tokens when the raw query is long/natural-language
  const structured = tokens.join(' ').trim()
  if (structured && base.split(/\s+/).length > 6) return structured
  if (structured) {
    // Merge unique words from both
    const words = new Set(
      `${base} ${structured}`
        .toLowerCase()
        .split(/[^a-z0-9€]+/)
        .filter((w) => w && !['i', 'need', 'a', 'an', 'for', 'the', 'under', 'and', 'to', 'of', 'my'].includes(w) && !/^\d+$/.test(w) && w !== 'euros' && w !== 'euro'),
    )
    return [...words].join(' ')
  }
  return base
}

export function sourceLabel(source: ProductSource): string {
  switch (source) {
    case 'supabase':
      return 'Styla Shop'
    case 'ebay':
      return 'eBay'
    case 'bestbuy':
      return 'Best Buy'
    case 'dummyjson':
      return 'DummyJSON'
    case 'fakestore':
      return 'Fake Store'
    case 'serpapi':
      return 'Google Shopping'
  }
}

export function inferSizes(category: Category): string[] {
  switch (category) {
    case 'shoes':
      return ['36', '37', '38', '39', '40', '41']
    case 'accessories':
    case 'electronics':
      return ['One size']
    default:
      return ['XS', 'S', 'M', 'L', 'XL']
  }
}

function hashSeed(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Deterministic per-size availability for catalogs that omit stock counts. */
export function stockForSize(
  productId: string,
  size: string,
  inStock: boolean,
  stockCount?: number,
): number {
  if (!inStock || stockCount === 0) return 0
  const ceiling = typeof stockCount === 'number' ? Math.max(stockCount, 1) : 10
  const n = hashSeed(`${productId}:${size}`) % (ceiling + 2)
  // Some sizes sell out while others remain
  return Math.min(n, ceiling)
}

export function resolveSizes(product: {
  sizes: string[]
  category: Category
}): string[] {
  return product.sizes.length > 0 ? product.sizes : inferSizes(product.category)
}
