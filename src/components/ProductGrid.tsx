import { useDeferredValue, useEffect, useRef } from 'react'
import { useShop } from '../context/ShopContext'
import { ProductCard } from './ProductCard'
import type { SortOption } from '../types'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'rating', label: 'Top rated' },
]

export function ProductGrid() {
  const {
    results,
    status,
    sort,
    setSort,
    isPending,
    suggestions,
    hasSearched,
    sourceNote,
    sources,
    error,
    search,
    query,
    hasMore,
    loadMore,
    loadingMore,
  } = useShop()
  const deferred = useDeferredValue(results)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore || status !== 'ready') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          void loadMore()
        }
      },
      { root: null, rootMargin: '240px 0px', threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadMore, status, deferred.length])

  if (!hasSearched) return null

  if (status === 'parsing') {
    return (
      <section className="results-section" aria-busy="true">
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
        <p className="status-line">
          Parsing intent and fetching live catalog results…
        </p>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="results-section">
        <div className="empty-state">
          <p>{error || 'Could not load products.'}</p>
          <button
            type="button"
            className="solid-btn"
            onClick={() => void search(query)}
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={`results-section ${isPending ? 'is-pending' : ''}`}>
      {sourceNote && (
        <p className={`source-note ${sources.includes('fakestore') ? 'is-live' : ''}`}>
          {sourceNote}
        </p>
      )}

      <div className="results-toolbar">
        <h2>
          {deferred.length} {deferred.length === 1 ? 'match' : 'matches'}
        </h2>
        <label className="sort-label">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {deferred.length === 0 ? (
        <div className="empty-state">
          <p>No pieces matched those filters. Try loosening a chip or rephrasing.</p>
          {suggestions.length > 0 && (
            <ul>
              {suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <div className="product-grid">
            {deferred.map((item, index) => (
              <ProductCard key={item.product.id} item={item} index={index} />
            ))}
          </div>
          {(hasMore || loadingMore) && (
            <div
              ref={sentinelRef}
              className="infinite-scroll-sentinel"
              aria-hidden={!loadingMore}
            >
              {loadingMore && (
                <div className="infinite-scroll-loader" role="status" aria-live="polite">
                  <span className="infinite-scroll-spinner" aria-hidden />
                  <span className="sr-only">Loading more products</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}
