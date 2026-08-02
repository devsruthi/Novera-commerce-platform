import { searchProducts, CATALOG_PAGE_SIZE } from '../services/productService'
import type { CatalogResponse, SearchFilters } from '../types'

export { CATALOG_PAGE_SIZE }

/**
 * Catalog entry point for AI search / infinite scroll.
 * Backed by Supabase products (SerpAPI path removed in Phase 1).
 */
export async function fetchCatalog(
  filters: SearchFilters,
  opts?: { limit?: number; start?: number },
): Promise<CatalogResponse> {
  return searchProducts(filters, opts)
}

export function formatMoney(amount: number, currency = 'EUR'): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}
