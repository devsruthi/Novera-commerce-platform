import { useEffect, useMemo, useState } from 'react'
import { useShop } from '../context/ShopContext'
import { formatMoney } from '../lib/catalogApi'
import { resolveSizes, sourceLabel } from '../lib/inferProduct'
import { getEffectiveStock } from '../lib/stockAlerts'
import { ProductPurchaseOptions } from './ProductPurchaseOptions'
import { WishlistButton } from './WishlistButton'

export function ProductDetail() {
  const {
    selectedProduct,
    closeProduct,
    toggleCompare,
    compareIds,
    mode,
  } = useShop()
  const [stockTick, setStockTick] = useState(0)

  useEffect(() => {
    if (!selectedProduct) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProduct()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedProduct, closeProduct])

  useEffect(() => {
    const onAvailable = () => setStockTick((n) => n + 1)
    window.addEventListener('styla:stock-available', onAvailable)
    return () => window.removeEventListener('styla:stock-available', onAvailable)
  }, [])

  const product = selectedProduct?.product
  const availableUnits = useMemo(() => {
    void stockTick
    if (!product) return 0
    return resolveSizes(product).reduce(
      (max, size) =>
        Math.max(
          max,
          getEffectiveStock(
            product.id,
            size,
            product.inStock,
            product.stockCount,
          ),
        ),
      0,
    )
  }, [product, stockTick])

  if (!selectedProduct || !product) return null

  const { summary, score, reasons } = selectedProduct
  const comparing = compareIds.includes(product.id)
  const outOfStock = availableUnits <= 0

  return (
    <div
      className="modal-backdrop product-detail-backdrop"
      role="presentation"
      onClick={closeProduct}
    >
      <div
        className="product-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="product-detail-close"
          onClick={closeProduct}
          aria-label="Close product details"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="product-detail-scroll">
          <div className="product-detail-grid">
            <div className="product-detail-media">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="product-image-fallback" />
              )}
              <WishlistButton product={product} className="wishlist-heart-on-media" />
            </div>

            <div className="product-detail-body">
              <p className="product-brand">
                {product.brand} · {sourceLabel(product.source)}
              </p>
              <h2 id="product-detail-title">{product.name}</h2>

              <div className="product-price-row">
                <span className="price">
                  {formatMoney(product.price, product.currency)}
                </span>
                <span className="rating">
                  {product.rating.toFixed(1)}
                  <span className="rating-star">★</span>
                  {product.reviewCount > 0
                    ? ` · ${product.reviewCount} reviews`
                    : ''}
                </span>
              </div>

              <p className="product-detail-desc">{product.description}</p>

              <ProductPurchaseOptions product={product} />

              <dl className="product-detail-meta">
                <div>
                  <dt>Category</dt>
                  <dd>{product.category}</dd>
                </div>
                <div>
                  <dt>Match score</dt>
                  <dd>{Math.round(Math.max(score, 0))}</dd>
                </div>
                {product.colors.length > 0 && (
                  <div>
                    <dt>Colors</dt>
                    <dd>{product.colors.join(', ')}</dd>
                  </div>
                )}
                <div className={outOfStock ? 'is-oos-meta' : 'is-instock-meta'}>
                  <dt>Availability</dt>
                  <dd>{outOfStock ? 'Out of stock' : 'In stock'}</dd>
                </div>
              </dl>

              <div className="product-detail-why">
                <h3>Why this match</h3>
                <p>{summary}</p>
                {reasons.length > 0 && (
                  <ul className="why-list">
                    {reasons.map((r) => (
                      <li key={r.label}>{r.label}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="product-detail-actions">
                {product.productUrl && (
                  <a
                    className="solid-btn product-external-link"
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shop at {product.brand || 'retailer'}
                  </a>
                )}
                {mode === 'compare' && (
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => toggleCompare(product.id)}
                  >
                    {comparing ? 'Remove from compare' : 'Add to compare'}
                  </button>
                )}
                <button type="button" className="ghost-btn" onClick={closeProduct}>
                  Back to results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
