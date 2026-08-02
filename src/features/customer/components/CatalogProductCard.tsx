import { useEffect, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../../types'
import { formatMoney } from '../../../lib/catalogApi'
import { resolveSizes } from '../../../lib/inferProduct'
import { getEffectiveStock } from '../../../lib/stockAlerts'
import { useWishlist } from '../../../context/WishlistContext'
import { useCart } from '../../../context/CartContext'

function badgeFor(product: Product): { label: string; className: string } | null {
  if (!product.inStock) {
    return { label: 'Sold out', className: 'bg-slate-800 text-white' }
  }
  if (product.originalPrice && product.originalPrice > product.price) {
    const pct = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100,
    )
    return {
      label: `-${pct}%`,
      className: 'bg-rose-100 text-rose-700',
    }
  }
  if (product.featured) {
    return {
      label: 'Bestseller',
      className: 'bg-orange-100 text-orange-700',
    }
  }
  if (product.createdAt) {
    const age = Date.now() - new Date(product.createdAt).getTime()
    if (age < 1000 * 60 * 60 * 24 * 21) {
      return { label: 'New', className: 'bg-violet-100 text-violet-700' }
    }
  }
  return null
}

/** Customer catalog card — mockup layout with badges, swatches, add to bag. */
export function CatalogProductCard({
  product,
  layout = 'grid',
}: {
  product: Product
  layout?: 'grid' | 'list'
}) {
  const { isWished, toggle } = useWishlist()
  const { items, addToCart, removeItem, showSnackbar } = useCart()
  const wished = isWished(product.id)
  const inBag = items.filter((item) => item.product.id === product.id)
  const isInBag = inBag.length > 0
  const gallery = (
    product.images?.length ? product.images : [product.imageUrl].filter(Boolean)
  ).slice(0, 5)
  const [imgIndex, setImgIndex] = useState(0)
  const [pauseSlide, setPauseSlide] = useState(false)
  const badge = badgeFor(product)
  const activeImage = gallery[imgIndex] || product.imageUrl

  useEffect(() => {
    setImgIndex(0)
  }, [product.id])

  useEffect(() => {
    if (gallery.length <= 1 || pauseSlide) return
    const id = window.setInterval(() => {
      setImgIndex((i) => (i + 1) % gallery.length)
    }, 2800)
    return () => window.clearInterval(id)
  }, [gallery.length, pauseSlide, product.id])

  const onBagClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInBag) {
      for (const item of inBag) removeItem(item.key)
      showSnackbar(`Removed ${product.name} from bag`)
      return
    }

    if (!product.inStock) return

    const sizes = resolveSizes(product)
    const size =
      sizes.find(
        (s) =>
          getEffectiveStock(product.id, s, product.inStock, product.stockCount) >
          0,
      ) ?? sizes[0]

    if (!size) {
      showSnackbar('No size available for this item')
      return
    }

    const result = addToCart(product, size, 1)
    if (result.ok) {
      showSnackbar(`Added ${product.name} to bag`)
    } else {
      showSnackbar(result.error ?? 'Could not add to bag')
    }
  }

  const bagButtonClass = isInBag
    ? 'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100'
    : 'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400 bg-white py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50'

  const body = (
    <>
      <p className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
        {product.brand}
      </p>
      <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-900">
        {product.name}
      </h3>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
        <p className="text-base font-bold text-violet-700">
          {formatMoney(product.price, product.currency)}
        </p>
        {product.originalPrice != null && product.originalPrice > product.price && (
          <p className="text-xs text-slate-400 line-through">
            {formatMoney(product.originalPrice, product.currency)}
          </p>
        )}
      </div>
      {product.rating > 0 && (
        <p className="mt-1 text-xs text-slate-500">
          <span className="rating-star">★</span>{' '}
          {product.rating.toFixed(1)}
          {product.reviewCount > 0 ? ` (${product.reviewCount})` : ''}
        </p>
      )}
    </>
  )

  if (layout === 'list') {
    return (
      <article className="flex gap-4 overflow-hidden rounded-2xl border border-violet-100 bg-white p-3 shadow-sm shadow-violet-100/40">
        <Link
          to={`/customer/product/${product.id}`}
          className="relative h-36 w-32 shrink-0 overflow-hidden rounded-xl bg-violet-50/70"
        >
          {activeImage ? (
            <img src={activeImage} alt="" className="h-full w-full object-contain" loading="lazy" />
          ) : (
            <div className="grid h-full place-items-center text-xs text-slate-400">No image</div>
          )}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/customer/product/${product.id}`} className="min-w-0">
              {body}
            </Link>
            <button
              type="button"
              onClick={() => toggle(product)}
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-100 bg-white ${
                wished ? 'text-rose-500' : 'text-slate-400'
              }`}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart filled={wished} />
            </button>
          </div>
          <button
            type="button"
            disabled={!isInBag && !product.inStock}
            onClick={onBagClick}
            className={`mt-auto ${bagButtonClass}`}
          >
            <BagIcon />
            {isInBag ? 'Remove from bag' : 'Add to bag'}
          </button>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm shadow-violet-100/50 transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md hover:shadow-violet-200/50">
      <div className="p-[5px]">
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-gradient-to-b from-violet-50/80 to-slate-50"
          onMouseEnter={() => setPauseSlide(true)}
          onMouseLeave={() => setPauseSlide(false)}
        >
          <Link to={`/customer/product/${product.id}`} className="relative block h-full">
            {gallery.length > 0 ? (
              gallery.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 h-full w-full object-contain p-3 transition-all duration-700 ease-out group-hover:scale-[1.02] ${
                    i === imgIndex
                      ? 'z-[1] translate-x-0 scale-100 opacity-100'
                      : 'z-0 translate-x-3 scale-[0.98] opacity-0'
                  }`}
                />
              ))
            ) : (
              <div className="grid h-full place-items-center text-sm text-stone-400">
                No image
              </div>
            )}
          </Link>

          {badge && (
            <span
              className={`pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${badge.className}`}
            >
              {badge.label}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggle(product)
            }}
            className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-sm ${
              wished ? 'text-rose-500' : 'text-slate-400'
            }`}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart filled={wished} />
          </button>

          {gallery.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setImgIndex(i)
                  }}
                  className={`rounded-full transition-all duration-500 ease-out ${
                    i === imgIndex
                      ? 'h-1.5 w-4 bg-violet-600'
                      : 'h-1.5 w-1.5 bg-violet-200 hover:bg-violet-300'
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <Link to={`/customer/product/${product.id}`}>{body}</Link>
        <button
          type="button"
          disabled={!isInBag && !product.inStock}
          onClick={onBagClick}
          className={`mt-3 ${bagButtonClass}`}
        >
          <BagIcon />
          {isInBag ? 'Remove from bag' : 'Add to bag'}
        </button>
      </div>
    </article>
  )
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        d="M12.1 20.3 4.6 13a5.1 5.1 0 0 1 7.2-7.2l.3.3.3-.3a5.1 5.1 0 0 1 7.2 7.2l-7.5 7.3Z"
      />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
      <path
        d="M6 8h12l-1 11H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V7a3 3 0 0 1 6 0v1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
