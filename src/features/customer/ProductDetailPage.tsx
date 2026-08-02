import { useMemo, useState } from 'react'
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
  const { addToCart, showSnackbar } = useCart()
  const { isWished, toggle } = useWishlist()
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)

  const productQuery = useQuery({
    queryKey: ['product', id],
    enabled: Boolean(id),
    queryFn: () => getProductById(id),
  })

  const product = productQuery.data
  const sizes = useMemo(() => product?.sizes ?? [], [product])

  if (productQuery.isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-[4/5] animate-pulse rounded-3xl bg-stone-200" />
          <div className="space-y-3">
            <div className="h-6 w-1/3 animate-pulse rounded bg-stone-200" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-stone-200" />
            <div className="h-24 animate-pulse rounded bg-stone-200" />
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="font-semibold">Product not found</p>
        <Link to="/customer/shop" className="mt-3 inline-block text-indigo-600">
          Back to shop
        </Link>
      </main>
    )
  }

  const wished = isWished(product.id)

  const onAdd = () => {
    const chosen = size || sizes[0] || 'One size'
    const result = addToCart(product, chosen, qty)
    if (!result.ok) {
      showSnackbar(result.error ?? 'Could not add to cart')
      return
    }
    showSnackbar('Added to cart')
    navigate('/customer/cart')
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to="/customer/shop"
        className="text-sm font-semibold text-stone-500 hover:text-indigo-600"
      >
        ← Back to shop
      </Link>

      <div className="mt-5 grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-100">
          <div className="aspect-[4/5]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-400">
            {product.brand}
          </p>
          <h1 className="mt-1 font-[Syne] text-3xl font-extrabold tracking-tight">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <p className="text-2xl font-bold text-indigo-700">
              {formatMoney(product.price, product.currency)}
            </p>
            {product.originalPrice != null && (
              <p className="text-sm text-stone-400 line-through">
                {formatMoney(product.originalPrice, product.currency)}
              </p>
            )}
            {product.rating > 0 && (
              <p className="text-sm text-stone-500">★ {product.rating.toFixed(1)}</p>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            {product.description}
          </p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                    (size || sizes[0]) === s
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-stone-200 bg-white text-stone-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <label className="text-sm font-semibold">
              Qty{' '}
              <input
                type="number"
                min={1}
                max={Math.max(1, product.stockCount ?? 10)}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 1)}
                className="ml-2 w-16 rounded-lg border border-stone-200 px-2 py-1"
              />
            </label>
            <span
              className={`text-sm font-semibold ${
                product.inStock ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {product.inStock
                ? `${product.stockCount ?? 'In'} stock`
                : 'Sold out'}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={onAdd}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => toggle(product)}
              className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold"
            >
              {wished ? 'Remove wishlist' : 'Wishlist'}
            </button>
            <Link
              to="/customer/cart"
              className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold"
            >
              View cart
            </Link>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-stone-100 px-3 py-2">
              <dt className="text-stone-500">Category</dt>
              <dd className="font-semibold capitalize">{product.category}</dd>
            </div>
            <div className="rounded-2xl bg-stone-100 px-3 py-2">
              <dt className="text-stone-500">Colors</dt>
              <dd className="font-semibold capitalize">
                {product.colors.join(', ') || '—'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  )
}
