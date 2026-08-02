import type { Occasion, RankedProduct } from '../types'

const OCCASION_QUERIES: Record<Occasion, string> = {
  wedding: 'elegant clothing jewelery for wedding guest',
  office: 'mens clothing office shirt jacket',
  casual: 'casual clothing everyday wear',
  party: 'party clothing fashion',
  date: 'stylish clothing for date night',
  sport: 'electronics fitness headphones',
  travel: 'comfortable clothing travel essentials',
}

export function buildOutfitQuery(
  occasion: Occasion,
  maxPrice: number,
  notes: string,
): string {
  const base = OCCASION_QUERIES[occasion]
  const note = notes.trim()
  return `${base}${note ? ` ${note}` : ''} under €${maxPrice}`
}

/** Pick a compact “look” shortlist from ranked results */
export function buildOutfitSlots(results: RankedProduct[]): RankedProduct[] {
  const picked: RankedProduct[] = []
  const used = new Set<string>()

  const take = (pred: (r: RankedProduct) => boolean) => {
    const hit = results.find((r) => !used.has(r.product.id) && pred(r))
    if (hit) {
      used.add(hit.product.id)
      picked.push(hit)
    }
  }

  // Prefer a varied shopping shortlist (works for FakeStore + Google Shopping)
  take((r) =>
    ['dresses', 'tops', 'outerwear', 'other'].includes(r.product.category),
  )
  take((r) => r.product.category === 'accessories')
  take((r) => r.product.category === 'shoes')
  take((r) => r.product.category === 'bottoms' || r.product.category === 'electronics')

  // Fill remaining slots with top-ranked shopping matches
  for (const r of results) {
    if (picked.length >= 8) break
    if (used.has(r.product.id)) continue
    used.add(r.product.id)
    picked.push(r)
  }

  return picked.slice(0, 8)
}

export function summarizeReviews(results: RankedProduct[]) {
  if (!results.length) {
    return {
      avgRating: 0,
      totalReviews: 0,
      topRated: null as RankedProduct | null,
      mostReviewed: null as RankedProduct | null,
      insights: [] as string[],
    }
  }

  const avgRating =
    results.reduce((sum, r) => sum + r.product.rating, 0) / results.length
  const totalReviews = results.reduce((sum, r) => sum + r.product.reviewCount, 0)
  const topRated = [...results].sort(
    (a, b) => b.product.rating - a.product.rating,
  )[0]
  const mostReviewed = [...results].sort(
    (a, b) => b.product.reviewCount - a.product.reviewCount,
  )[0]

  const insights = [
    `Average match rating is ${avgRating.toFixed(1)}★ across ${results.length} items.`,
    topRated
      ? `Highest rated: “${topRated.product.name}” at ${topRated.product.rating.toFixed(1)}★.`
      : '',
    mostReviewed
      ? `Most reviewed: “${mostReviewed.product.name}” with ${mostReviewed.product.reviewCount} reviews.`
      : '',
    results.filter((r) => r.product.rating >= 4.5).length
      ? `${results.filter((r) => r.product.rating >= 4.5).length} items sit at 4.5★ or above.`
      : 'Fewer ultra-high ratings — weigh price and fit cues carefully.',
  ].filter(Boolean)

  return { avgRating, totalReviews, topRated, mostReviewed, insights }
}
