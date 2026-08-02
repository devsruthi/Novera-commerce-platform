import type {
  Category,
  Color,
  Occasion,
  ParseResult,
  SearchFilters,
} from '../types'

const emptyFilters = (query = ''): SearchFilters => ({
  query,
  categories: [],
  colors: [],
  occasions: [],
  maxPrice: null,
  minPrice: null,
  brands: [],
  sizes: [],
  tags: [],
})

const COLOR_MAP: Record<string, Color> = {
  black: 'black',
  white: 'white',
  blue: 'blue',
  navy: 'navy',
  red: 'red',
  green: 'green',
  emerald: 'green',
  beige: 'beige',
  cream: 'beige',
  pink: 'pink',
  grey: 'grey',
  gray: 'grey',
  brown: 'brown',
  yellow: 'yellow',
  gold: 'yellow',
  purple: 'purple',
  orange: 'orange',
  coral: 'orange',
}

const CATEGORY_PATTERNS: Array<{ pattern: RegExp; category: Category }> = [
  { pattern: /\b(dress|dresses|gown|gowns)\b/i, category: 'dresses' },
  { pattern: /\b(blazer|coat|jacket|outerwear)\b/i, category: 'outerwear' },
  { pattern: /\b(shirt|top|tops|knit|camisole|blouse|sweater)\b/i, category: 'tops' },
  { pattern: /\b(trousers|pants|skirt|leggings|bottoms)\b/i, category: 'bottoms' },
  { pattern: /\b(shoes|boots|heels|sneakers|sandals)\b/i, category: 'shoes' },
  { pattern: /\b(bag|earrings|scarf|jewelry|accessories)\b/i, category: 'accessories' },
  {
    pattern: /\b(headphones?|earbuds?|laptop|phone|tablet|electronics?)\b/i,
    category: 'electronics',
  },
]

const OCCASION_PATTERNS: Array<{ pattern: RegExp; occasion: Occasion }> = [
  { pattern: /\b(wedding|ceremony|guest|bridal)\b/i, occasion: 'wedding' },
  { pattern: /\b(office|work|workwear|business|desk)\b/i, occasion: 'office' },
  { pattern: /\b(casual|everyday|weekend)\b/i, occasion: 'casual' },
  { pattern: /\b(party|cocktail|evening|night out|celebration)\b/i, occasion: 'party' },
  { pattern: /\b(date|dinner|romantic)\b/i, occasion: 'date' },
  { pattern: /\b(sport|gym|running|athletic|workout)\b/i, occasion: 'sport' },
  { pattern: /\b(travel|vacation|holiday|trip)\b/i, occasion: 'travel' },
]

const TAG_KEYWORDS = [
  'midi',
  'mini',
  'maxi',
  'satin',
  'silk',
  'linen',
  'velvet',
  'denim',
  'elegant',
  'affordable',
  'summer',
  'winter',
  'tailored',
  'floral',
  'sequin',
  'leather',
  'comfort',
  'comfortable',
  'formal',
  'romantic',
  'minimal',
]

const BRANDS: Array<{ match: string; label: string }> = [
  { match: 'mango', label: 'Mango' },
  { match: 'cos', label: 'COS' },
  { match: 'zara', label: 'Zara' },
  { match: 'h&m', label: 'H&M' },
  { match: 'nike', label: 'Nike' },
  { match: 'adidas', label: 'Adidas' },
  { match: 'arket', label: 'Arket' },
  { match: 'weekday', label: 'Weekday' },
  { match: 'uniqlo', label: 'Uniqlo' },
  { match: 'reformation', label: 'Reformation' },
  { match: 'sandro', label: 'Sandro' },
  { match: "levi's", label: "Levi's" },
  { match: 'steve madden', label: 'Steve Madden' },
  { match: 'ted baker', label: 'Ted Baker' },
  { match: 'selected femme', label: 'Selected Femme' },
  { match: '& other stories', label: '& Other Stories' },
  { match: 'max mara', label: 'Max Mara' },
  { match: 'vagabond', label: 'Vagabond' },
  { match: 'guess', label: 'Guess' },
  { match: 'pilgrim', label: 'Pilgrim' },
  { match: 'acne studios', label: 'Acne Studios' },
]

function toNumber(raw: string): number {
  return Number(raw.replace(',', '.'))
}

function extractPrice(text: string): { max: number | null; min: number | null } {
  const between = text.match(
    /\bbetween\s*€?\s*(\d+(?:[.,]\d+)?)\s*(?:and|to|-)\s*€?\s*(\d+(?:[.,]\d+)?)/i,
  )
  if (between) {
    return { min: toNumber(between[1]), max: toNumber(between[2]) }
  }

  const under = text.match(
    /\b(?:under|below|max(?:imum)?|less than|up to)\s*€?\s*(\d+(?:[.,]\d+)?)/i,
  )
  const over = text.match(
    /\b(?:over|above|min(?:imum)?|more than)\s*€?\s*(\d+(?:[.,]\d+)?)/i,
  )

  return {
    max: under ? toNumber(under[1]) : null,
    min: over ? toNumber(over[1]) : null,
  }
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)]
}

/**
 * Deterministic NL → structured filters parser.
 * Simulates an LLM intent parser with clear, explainable rules —
 * swap this module for a real model API later without changing the UI contract.
 */
export function parseQuery(raw: string): ParseResult {
  const query = raw.trim()
  const filters = emptyFilters(query)
  const lower = query.toLowerCase()
  let hits = 0

  for (const [word, color] of Object.entries(COLOR_MAP)) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(lower)) {
      filters.colors.push(color)
      hits += 1
    }
  }
  filters.colors = unique(filters.colors)

  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(query)) {
      filters.categories.push(category)
      hits += 1
    }
  }
  filters.categories = unique(filters.categories)

  for (const { pattern, occasion } of OCCASION_PATTERNS) {
    if (pattern.test(query)) {
      filters.occasions.push(occasion)
      hits += 1
    }
  }
  filters.occasions = unique(filters.occasions)

  const { max, min } = extractPrice(query)
  filters.maxPrice = max
  filters.minPrice = min
  if (max !== null || min !== null) hits += 1

  if (/\b(affordable|cheap|budget)\b/i.test(query)) {
    filters.tags.push('affordable')
    if (filters.maxPrice === null) filters.maxPrice = 80
    hits += 1
  }

  if (/\b(elegant|formal|dressy)\b/i.test(query)) {
    filters.tags.push('elegant')
    hits += 1
  }

  if (/\b(comfort(?:able)?)\b/i.test(query)) {
    filters.tags.push('comfort')
    hits += 1
  }

  for (const tag of TAG_KEYWORDS) {
    if (new RegExp(`\\b${tag}\\b`, 'i').test(lower)) {
      filters.tags.push(tag === 'comfortable' ? 'comfort' : tag)
      hits += 0.5
    }
  }
  filters.tags = unique(filters.tags)

  for (const brand of BRANDS) {
    if (lower.includes(brand.match)) {
      filters.brands.push(brand.label)
      hits += 1
    }
  }
  filters.brands = unique(filters.brands)

  const interpretation = describeFilters(filters)
  const confidence = Math.min(0.95, 0.35 + hits * 0.12)
  const suggestions = suggestMissingFilters(filters)

  return { filters, interpretation, confidence, suggestions }
}

/** Human-readable summary of the active filter chips (updates when chips change). */
export function describeFilters(filters: SearchFilters): string {
  const parts: string[] = []
  if (filters.colors.length) parts.push(filters.colors.join('/'))
  if (filters.categories.length) parts.push(filters.categories.join(', '))
  if (filters.occasions.length) {
    parts.push(`for ${filters.occasions.join(' / ')}`)
  }
  if (filters.maxPrice !== null) parts.push(`under €${filters.maxPrice}`)
  if (filters.minPrice !== null) parts.push(`from €${filters.minPrice}`)
  if (filters.tags.includes('affordable')) parts.push('(budget-friendly)')
  if (filters.tags.filter((t) => t !== 'affordable').length) {
    const styles = filters.tags.filter((t) => t !== 'affordable')
    parts.push(`(${styles.join(', ')})`)
  }
  if (filters.brands.length) parts.push(`from ${filters.brands.join(', ')}`)

  return parts.length > 0
    ? `Looking for ${parts.join(' ')}.`
    : 'No strong filters left — showing a broader catalog match.'
}

export function suggestMissingFilters(filters: SearchFilters): string[] {
  const suggestions: string[] = []
  if (!filters.colors.length) suggestions.push('Add a color, e.g. “navy” or “black”')
  if (!filters.occasions.length) suggestions.push('Mention an occasion like wedding or office')
  if (filters.maxPrice === null) suggestions.push('Set a budget, e.g. under €100')
  return suggestions
}

export function filtersToLabel(filters: SearchFilters): string[] {
  const chips: string[] = []
  for (const c of filters.colors) chips.push(`Color: ${c}`)
  for (const c of filters.categories) chips.push(`Category: ${c}`)
  for (const o of filters.occasions) chips.push(`Occasion: ${o}`)
  if (filters.maxPrice !== null) chips.push(`Max €${filters.maxPrice}`)
  if (filters.minPrice !== null) chips.push(`Min €${filters.minPrice}`)
  for (const t of filters.tags) chips.push(`Style: ${t}`)
  for (const b of filters.brands) chips.push(`Brand: ${b}`)
  return chips
}

/** Rebuild the search-box text from active chips (drops removed constraints). */
export function filtersToQuery(filters: SearchFilters): string {
  const styles = filters.tags.filter((t) => t !== 'affordable')
  const parts: string[] = []

  if (filters.colors.length) parts.push(filters.colors.join(' '))
  if (styles.length) parts.push(styles.join(' '))
  if (filters.categories.length) parts.push(filters.categories.join(' '))
  if (filters.occasions.length) {
    parts.push(`for ${filters.occasions.join(' ')}`)
  }
  if (filters.maxPrice !== null) parts.push(`under ${filters.maxPrice} euros`)
  if (filters.minPrice !== null) parts.push(`from ${filters.minPrice} euros`)
  if (filters.brands.length) parts.push(filters.brands.join(' '))
  if (filters.tags.includes('affordable')) parts.push('affordable')

  const rebuilt = parts.join(' ').replace(/\s+/g, ' ').trim()
  if (!rebuilt) return 'fashion'

  return rebuilt.charAt(0).toUpperCase() + rebuilt.slice(1)
}
