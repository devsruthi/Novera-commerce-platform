import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatMoney } from '../../lib/catalogApi'

/** Customer cart page — Phase 2 (checkout arrives in Phase 4). */
export function CustomerCartPage() {
  const {
    items,
    itemCount,
    subtotal,
    currency,
    setItemQuantity,
    removeItem,
    clearCart,
    snackbar,
    dismissSnackbar,
  } = useCart()

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[Syne] text-3xl font-extrabold tracking-tight">
            Cart
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {itemCount} item{itemCount === 1 ? '' : 's'} · Checkout in Phase 4
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-semibold text-stone-500 hover:text-rose-600"
          >
            Clear cart
          </button>
        )}
      </div>

      {snackbar && (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          <span>{snackbar}</span>
          <button type="button" onClick={dismissSnackbar} className="font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <p className="font-semibold">Your cart is empty</p>
          <Link
            to="/customer/shop"
            className="mt-3 inline-block text-sm font-semibold text-indigo-600"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.key}
                className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm"
              >
                <Link
                  to={`/customer/product/${item.product.id}`}
                  className="h-24 w-20 overflow-hidden rounded-xl bg-stone-100"
                >
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/customer/product/${item.product.id}`}
                    className="font-semibold hover:text-indigo-700"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-stone-500">
                    {item.product.brand} · Size {item.size}
                  </p>
                  <p className="mt-1 text-sm font-bold text-indigo-700">
                    {formatMoney(item.product.price, item.product.currency)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        setItemQuantity(item.key, Number(e.target.value) || 1)
                      }
                      className="w-16 rounded-lg border border-stone-200 px-2 py-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="text-sm font-semibold text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Order summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span className="font-semibold">
                {formatMoney(subtotal, currency)}
              </span>
            </div>
            <p className="mt-4 text-xs text-stone-500">
              Shipping and payment are added in Phase 4 checkout.
            </p>
            <button
              type="button"
              disabled
              className="mt-5 w-full rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white opacity-50"
            >
              Checkout soon
            </button>
            <Link
              to="/customer/shop"
              className="mt-3 block text-center text-sm font-semibold text-indigo-600"
            >
              Keep shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  )
}
