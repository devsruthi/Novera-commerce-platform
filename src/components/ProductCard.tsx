import type { RankedProduct } from '../types'
import { useShop } from '../context/ShopContext'
import { formatMoney } from '../lib/catalogApi'
import { sourceLabel } from '../lib/inferProduct'
import { ProductPurchaseOptions } from './ProductPurchaseOptions'
import { WishlistButton } from './WishlistButton'

interface ProductCardProps {
  item: RankedProduct
  index: number
}

export function ProductCard({ item, index }: ProductCardProps) {
  const { product, summary, score, reasons } = item
  const { openProduct } = useShop()

  return (
    <article
      className={`product-card is-clickable ${product.inStock ? '' : 'is-oos'}`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      onClick={() => openProduct(product.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openProduct(product.id)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
    >
      <div className="product-media">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="product-image"
          />
        ) : (
          <div className="product-image-fallback" aria-hidden />
        )}
        <span className="match-score">{Math.round(Math.max(score, 0))}</span>
        <span className="source-badge">{sourceLabel(product.source)}</span>
        <WishlistButton product={product} className="wishlist-heart-on-media" />
      </div>

      <div className="product-body">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-price-row">
          <span className="price">
            {formatMoney(product.price, product.currency)}
          </span>
          {product.originalPrice && (
            <span className="price-was">
              {formatMoney(product.originalPrice, product.currency)}
            </span>
          )}
          <span className="rating">
            {product.rating.toFixed(1)}★
            {product.reviewCount > 0 ? ` · ${product.reviewCount}` : ''}
          </span>
        </div>

        <p className="why-summary">{summary}</p>

        {reasons.length > 0 && (
          <ul className="why-list">
            {reasons.map((r) => (
              <li key={r.label}>{r.label}</li>
            ))}
          </ul>
        )}

        <ProductPurchaseOptions product={product} compact />
      </div>
    </article>
  )
}
