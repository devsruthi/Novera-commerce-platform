import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../../services/productService'
import { formatMoney } from '../../lib/catalogApi'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

/** Full product detail page for customer catalog. */
export function ProductDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { items, addToCart, removeItem, showSnackbar } = useCart()
  const { isWished, toggle } = useWishlist()
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const productQuery = useQuery({
    queryKey: ['product', id],
    enabled: Boolean(id),
    queryFn: () => getProductById(id),
  })

  const product = productQuery.data
  const sizes = useMemo(() => product?.sizes ?? [], [product])
  const gallery = useMemo(() => {
    if (!product) return [] as string[]
    const fromList = (product.images ?? []).filter(Boolean)
    if (fromList.length > 0) return fromList
    return product.imageUrl ? [product.imageUrl] : []
  }, [product])

  useEffect(() => {
    setActiveImage(0)
    setSize('')
    setQty(1)
  }, [product?.id])

  if (productQuery.isLoading) {
    return (
      <main className="page-shell page-x relative py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[4/5] animate-pulse rounded-3xl bg-violet-100/80" />
          <div className="space-y-4 pt-4">
            <div className="h-4 w-24 animate-pulse rounded bg-violet-100" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-violet-100" />
            <div className="h-8 w-32 animate-pulse rounded bg-violet-100" />
            <div className="h-28 animate-pulse rounded-2xl bg-violet-100" />
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="page-shell page-x py-16 text-center">
        <p className="font-semibold text-slate-800">Product not found</p>
        <Link
          to="/customer/shop"
          className="mt-3 inline-block text-sm font-semibold text-violet-600 hover:text-violet-800"
        >
          Back to shop
        </Link>
      </main>
    )
  }

  const wished = isWished(product.id)
  const inBag = items.filter((item) => item.product.id === product.id)
  const isInBag = inBag.length > 0
  const discountPct =
    product.originalPrice != null && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100,
        )
      : null
  const maxQty = Math.max(1, product.stockCount ?? 10)
  const chosenSize = size || sizes[0] || 'One size'

  const onAdd = () => {
    if (isInBag) {
      for (const item of inBag) removeItem(item.key)
      showSnackbar(`Removed ${product.name} from cart`)
      return
    }
    const result = addToCart(product, chosenSize, qty)
    if (!result.ok) {
      showSnackbar(result.error ?? 'Could not add to cart')
      return
    }
    showSnackbar('Added to cart')
  }

  return (
    <main className="relative overflow-hidden text-slate-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
        style={{
          background:
            'linear-gradient(145deg, #efe8ff 0%, #f8f5ff 42%, #faf8ff 70%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl"
      />

      <div className="page-shell page-x relative py-6">
        <Link
          to="/customer/shop"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-violet-700"
        >
          <span aria-hidden>←</span> Back to shop
        </Link>

        <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-[28px] border border-violet-100/80 bg-white p-[5px] shadow-lg shadow-violet-200/40">
              <div className="relative flex h-[min(58vh,480px)] items-center justify-center overflow-hidden rounded-[23px] bg-gradient-to-b from-violet-50 to-slate-50 sm:h-[min(62vh,540px)]">
                {gallery.length > 0 ? (
                  gallery.map((src, i) => (
                    <img
                      key={`${src}-${i}`}
                      src={src}
                      alt={i === activeImage ? product.name : ''}
                      className={`absolute inset-0 m-auto max-h-full max-w-full object-contain p-4 transition-all duration-700 ease-out sm:p-5 ${
                        i === activeImage
                          ? 'translate-x-0 scale-100 opacity-100'
                          : 'translate-x-4 scale-[0.97] opacity-0'
                      }`}
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No image</p>
                )}

                {discountPct != null && (
                  <span className="absolute left-4 top-4 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                    −{discountPct}%
                  </span>
                )}
                {!product.inStock && (
                  <span className="absolute left-4 top-4 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white">
                    Sold out
                  </span>
                )}
              </div>
            </div>

            {gallery.length > 1 && (
              <ul className="mt-3.5 flex gap-2.5 overflow-x-auto pb-1">
                {gallery.map((src, index) => {
                  const active = index === activeImage
                  return (
                    <li key={`${src}-${index}`} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`View image ${index + 1}`}
                        aria-current={active ? 'true' : undefined}
                        className={`relative h-20 w-20 overflow-hidden rounded-2xl border bg-white transition duration-300 sm:h-[88px] sm:w-[88px] ${
                          active
                            ? 'border-violet-500 shadow-md shadow-violet-200/60 ring-2 ring-violet-200'
                            : 'border-violet-100 hover:border-violet-300 hover:shadow-sm'
                        }`}
                      >
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-24 lg:pt-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
              {product.brand}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-[2.35rem] sm:leading-[1.15]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
              <p className="text-3xl font-extrabold text-violet-700">
                {formatMoney(product.price, product.currency)}
              </p>
              {product.originalPrice != null &&
                product.originalPrice > product.price && (
                  <p className="mb-1 text-base text-slate-400 line-through">
                    {formatMoney(product.originalPrice, product.currency)}
                  </p>
                )}
              {product.rating > 0 && (
                <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-semibold text-slate-700">
                  <span className="rating-star">★</span>
                  {product.rating.toFixed(1)}
                </p>
              )}
            </div>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-600">
              {product.description}
            </p>

            <div className="mt-7">
              <div className="mb-2.5 flex items-baseline justify-between gap-2">
                <p className="text-sm font-bold text-slate-800">Size</p>
                <p className="text-xs text-slate-400">Selected: {chosenSize}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const selected = chosenSize === s
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`min-w-11 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                        selected
                          ? 'border-violet-600 bg-violet-600 !text-white shadow-md shadow-violet-600/25'
                          : 'border-violet-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50'
                      }`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-slate-800">Qty</span>
                <div className="inline-flex items-center overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={qty <= 1 || isInBag}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-10 w-10 place-items-center text-lg font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="min-w-9 text-center text-sm font-bold text-slate-800">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={qty >= maxQty || isInBag}
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="grid h-10 w-10 place-items-center text-lg font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                  product.inStock
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    product.inStock ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                {product.inStock
                  ? `${product.stockCount ?? 'In'} in stock`
                  : 'Sold out'}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!isInBag && !product.inStock}
                onClick={onAdd}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition disabled:opacity-50 sm:flex-none sm:min-w-[180px] ${
                  isInBag
                    ? 'border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'bg-violet-600 !text-white shadow-lg shadow-violet-600/30 hover:bg-violet-700'
                }`}
              >
                <BagIcon />
                {isInBag ? 'Remove from cart' : 'Add to cart'}
              </button>
              <button
                type="button"
                onClick={() => toggle(product)}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold transition ${
                  wished
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-violet-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50'
                }`}
              >
                <Heart filled={wished} />
                {wished ? 'Saved' : 'Wishlist'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/customer/cart')}
                className="inline-flex items-center justify-center rounded-2xl border border-violet-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
              >
                View cart
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <MetaChip label="Category" value={product.category} />
              <MetaChip
                label="Colors"
                value={
                  product.colors.length
                    ? product.colors.map(capitalize).join(', ')
                    : '—'
                }
              />
              {product.tags.slice(0, 2).map((tag) => (
                <MetaChip key={tag} label="Tag" value={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 px-3.5 py-2.5 shadow-sm shadow-violet-100/50 backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold capitalize text-slate-800">{value}</p>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
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
