import { Link } from 'react-router-dom'
import type { Product } from '../../../types'
import { formatMoney } from '../../../lib/catalogApi'
import { useWishlist } from '../../../context/WishlistContext'

/** Customer catalog card — links to PDP, supports wishlist. */
export function CatalogProductCard({ product }: { product: Product }) {
  const { isWished, toggle } = useWishlist()
  const wished = isWished(product.id)

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/5] bg-stone-100">
        <Link to={`/customer/product/${product.id}`} className="block h-full">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-stone-400">
              No image
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={() => toggle(product)}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow ${
            wished ? 'text-rose-500' : 'text-stone-500'
          }`}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path
              fill={wished ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
              d="M12.1 20.3 4.6 13a5.1 5.1 0 0 1 7.2-7.2l.3.3.3-.3a5.1 5.1 0 0 1 7.2 7.2l-7.5 7.3Z"
            />
          </svg>
        </button>
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-stone-900/80 px-2.5 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </div>
      <Link to={`/customer/product/${product.id}`} className="block p-3.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
          {product.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-stone-900">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-indigo-700">
            {formatMoney(product.price, product.currency)}
          </p>
          {product.rating > 0 && (
            <p className="text-xs text-stone-500">★ {product.rating.toFixed(1)}</p>
          )}
        </div>
      </Link>
    </article>
  )
}
