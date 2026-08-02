import type {
  MatchReason,
  Product,
  RankedProduct,
  SearchFilters,
  SortOption,
} from '../types'
import { parseQueryWithAI } from './aiApi'
import { fetchCatalog, formatMoney } from './catalogApi'
import { parseQuery } from './parseQuery'

function scoreProduct(product: Product, filters: SearchFilters): RankedProduct {
  const reasons: MatchReason[] = []
  let score = 0

  score += product.rating * 2
  score += Math.min(product.reviewCount / 200, 5)

  if (filters.colors.length) {
    const matched = product.colors.filter((c) => filters.colors.includes(c))
    if (matched.length) {
      score += 40
      reasons.push({
        label: `Matches your color (${matched.join(', ')})`,
        weight: 40,
      })
    } else {
      // Title/description soft match for live catalog items without color metadata
      const blob = `${product.name} ${product.description}`.toLowerCase()
      const soft = filters.colors.filter((c) => blob.includes(c))
      if (soft.length) {
        score += 28
        reasons.push({
          label: `Color cues in listing (${soft.join(', ')})`,
          weight: 28,
        })
      } else {
        score -= 12
      }
    }
  }

  if (filters.categories.length) {
    if (filters.categories.includes(product.category)) {
      score += 35
      reasons.push({
        label: `Right category: ${product.category}`,
        weight: 35,
      })
    } else {
      const blob = `${product.name} ${product.description}`.toLowerCase()
      const soft = filters.categories.some((c) => blob.includes(c.replace(/s$/, '')))
      if (soft) {
        score += 20
        reasons.push({ label: 'Category cues in listing title', weight: 20 })
      } else {
        score -= 15
      }
    }
  }

  if (filters.occasions.length) {
    const occasionHits = product.occasions.filter((o) =>
      filters.occasions.includes(o),
    )
    if (occasionHits.length) {
      const weight = 30 + occasionHits.length * 5
      score += weight
      reasons.push({
        label: `Fits ${occasionHits.join(' & ')}`,
        weight,
      })
    } else {
      const blob = `${product.name} ${product.description}`.toLowerCase()
      const soft = filters.occasions.filter((o) => blob.includes(o))
      if (soft.length) {
        score += 18
        reasons.push({
          label: `Occasion cues: ${soft.join(', ')}`,
          weight: 18,
        })
      } else {
        score -= 8
      }
    }
  }

  if (filters.maxPrice !== null) {
    if (product.price <= filters.maxPrice) {
      const headroom = filters.maxPrice - product.price
      const weight = 25 + Math.min(headroom / 10, 10)
      score += weight
      reasons.push({
        label: `Within budget at ${formatMoney(product.price, product.currency)}`,
        weight,
      })
    } else {
      score -= 50
    }
  }

  if (filters.minPrice !== null) {
    if (product.price >= filters.minPrice) score += 10
    else score -= 30
  }

  if (filters.tags.length) {
    const tagHits = product.tags.filter((t) =>
      filters.tags.some((ft) => t.includes(ft) || ft.includes(t)),
    )
    if (tagHits.length) {
      const weight = tagHits.length * 12
      score += weight
      reasons.push({
        label: `Style cues: ${tagHits.slice(0, 3).join(', ')}`,
        weight,
      })
    }
  }

  if (filters.brands.length) {
    if (
      filters.brands.some(
        (b) => b.toLowerCase() === product.brand.toLowerCase(),
      )
    ) {
      score += 20
      reasons.push({ label: `Brand match: ${product.brand}`, weight: 20 })
    }
  }

  if (product.originalPrice && product.originalPrice > product.price) {
    score += 8
    reasons.push({
      label: `On sale (−${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)`,
      weight: 8,
    })
  }

  if (!product.inStock) {
    score -= 60
    reasons.push({ label: 'Currently out of stock', weight: -60 })
  } else {
    reasons.push({ label: 'Available to buy', weight: 5 })
    score += 5
  }

  if (product.rating >= 4.5) {
    reasons.push({
      label: `Highly rated (${product.rating.toFixed(1)}★)`,
      weight: 10,
    })
    score += 10
  }

  if (product.source === 'ebay' || product.source === 'bestbuy') {
    score += 6
    reasons.push({
      label: `Live listing from ${product.source === 'ebay' ? 'eBay' : 'Best Buy'}`,
      weight: 6,
    })
  }

  const topReasons = reasons
    .filter((r) => r.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)

  const summary =
    topReasons.length > 0
      ? topReasons.map((r) => r.label).join(' · ')
      : 'General catalog match based on your query.'

  return { product, score, reasons: topReasons, summary }
}

export function rankProducts(
  filters: SearchFilters,
  sort: SortOption = 'relevance',
  catalog: Product[] = [],
): RankedProduct[] {
  let ranked = catalog.map((p) => scoreProduct(p, filters))

  // Soft filter: keep budget hard, keep soft mismatches with low scores
  ranked = ranked.filter((r) => {
    if (filters.maxPrice !== null && r.product.price > filters.maxPrice) {
      return false
    }
    if (filters.minPrice !== null && r.product.price < filters.minPrice) {
      return false
    }
    return r.score > -20
  })

  ranked.sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.product.price - b.product.price
      case 'price-desc':
        return b.product.price - a.product.price
      case 'rating':
        return b.product.rating - a.product.rating
      case 'relevance':
      default:
        return b.score - a.score
    }
  })

  return ranked
}

export async function searchWithAI(
  query: string,
  sort: SortOption,
): Promise<{
  ranked: RankedProduct[]
  filters: SearchFilters
  interpretation: string
  confidence: number
  suggestions: string[]
  catalog: Product[]
  sourceNote: string
  sources: string[]
  hasMore: boolean
  nextStart: number | null
}> {
  let parsed = parseQuery(query)
  try {
    parsed = await parseQueryWithAI(query)
  } catch {
    /* keep rule-based parse */
  }
  const catalogRes = await fetchCatalog(parsed.filters)
  const ranked = rankProducts(parsed.filters, sort, catalogRes.products)

  return {
    ranked,
    filters: parsed.filters,
    interpretation: parsed.interpretation,
    confidence: parsed.confidence,
    suggestions: parsed.suggestions,
    catalog: catalogRes.products,
    sourceNote: catalogRes.note ?? '',
    sources: catalogRes.sources,
    hasMore: Boolean(catalogRes.hasMore),
    nextStart: catalogRes.nextStart ?? null,
  }
}
