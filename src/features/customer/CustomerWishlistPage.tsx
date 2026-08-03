import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatMoney } from '../../lib/catalogApi'
import { resolveSizes } from '../../lib/inferProduct'
import { getEffectiveStock } from '../../lib/stockAlerts'
import type { Product } from '../../types'

/** Customer wishlist backed by Supabase `wishlist` table. */
export function CustomerWishlistPage() {
  const navigate = useNavigate()
  const { items, loading, remove } = useWishlist()
  const { addToCart, showSnackbar, snackbar, dismissSnackbar } = useCart()

  const moveToCart = (product: Product) => {
    const size =
      resolveSizes(product).find(
        (s) =>
          getEffectiveStock(product.id, s, product.inStock, product.stockCount) >
          0,
      ) ?? resolveSizes(product)[0]

    if (!size) {
      showSnackbar('No size available for this item')
      return
    }

    const result = addToCart(product, size, 1)
    if (!result.ok) {
      showSnackbar(result.error ?? 'Could not move to cart')
      return
    }

    remove(product.id)
    showSnackbar(`Moved to cart (size ${size})`)
  }

  return (
    <main className="page-shell page-x py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Wishlist
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? 'Loading…'
              : items.length === 0
                ? 'No saved pieces yet'
                : `${items.length} saved item${items.length === 1 ? '' : 's'}`}
          </p>
        </div>
        {items.length > 0 && (
          <Link
            to="/customer/cart"
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold !text-white shadow-md shadow-violet-600/25 transition hover:bg-violet-700"
          >
            Go to cart
          </Link>
        )}
      </div>

      {snackbar && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-violet-50 px-4 py-3 text-sm text-violet-900">
          <span>{snackbar}</span>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/customer/cart')}
              className="font-semibold text-violet-700 hover:text-violet-900"
            >
              View cart
            </button>
            <button
              type="button"
              onClick={dismissSnackbar}
              className="font-semibold text-slate-500 hover:text-slate-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {loading && (
        <p className="mt-8 text-sm text-slate-500">Loading wishlist…</p>
      )}

      {!loading && items.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-violet-200 bg-white px-6 py-16 text-center">
          <p className="font-semibold text-slate-800">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-slate-500">
            Tap the heart on any product to save it here. Then move items to your
            cart when you’re ready.
          </p>
          <Link
            to="/customer/shop"
            className="mt-5 inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold !text-white shadow-md shadow-violet-600/25 transition hover:bg-violet-700"
          >
            Browse the shop
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <li
              key={product.id}
              className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm shadow-violet-100/50"
            >
              <Link
                to={`/customer/product/${product.id}`}
                className="block aspect-[4/5] bg-violet-50/60"
                aria-label={`View ${product.name}`}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-slate-400">
                    No image
                  </div>
                )}
              </Link>
              <div className="p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {product.brand}
                </p>
                <Link
                  to={`/customer/product/${product.id}`}
                  className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 hover:text-violet-700"
                >
                  {product.name}
                </Link>
                <p className="mt-2 text-sm font-bold text-violet-700">
                  {formatMoney(product.price, product.currency)}
                  {product.rating > 0 && (
                    <span className="ml-2 font-normal text-slate-500">
                      <span className="rating-star">★</span> {product.rating.toFixed(1)}
                    </span>
                  )}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => moveToCart(product)}
                    disabled={!product.inStock}
                    className="w-full rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-semibold !text-white shadow-sm shadow-violet-600/25 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {product.inStock ? 'Move to cart' : 'Sold out'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(product.id)}
                    className="w-full rounded-xl border border-rose-500 bg-white px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 hover:border-rose-600 hover:text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
