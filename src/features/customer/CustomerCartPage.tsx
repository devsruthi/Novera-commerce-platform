import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useOrders } from '../../context/OrdersContext'
import { formatMoney } from '../../lib/catalogApi'
import { getEffectiveStock } from '../../lib/stockAlerts'
import type { PaymentMethod } from '../../types'

const PAYMENT_OPTIONS: Array<{
  id: PaymentMethod
  label: string
  hint: string
}> = [
  { id: 'card', label: 'Card', hint: 'Visa, Mastercard, Amex' },
  { id: 'paypal', label: 'PayPal', hint: 'Pay with PayPal balance' },
  { id: 'applepay', label: 'Apple Pay', hint: 'Touch ID / Face ID' },
  { id: 'klarna', label: 'Klarna', hint: 'Pay in 3 interest-free' },
]

const FREE_SHIP_AT = 75

/** Customer cart — Novera checkout with shipping, payment, and order placement. */
export function CustomerCartPage() {
  const navigate = useNavigate()
  const {
    items,
    itemCount,
    subtotal,
    currency,
    paymentMethod,
    setPaymentMethod,
    setItemQuantity,
    removeItem,
    clearCart,
  } = useCart()
  const { user } = useAuth()
  const { createOrder } = useOrders()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const shipping = items.length === 0 || subtotal >= FREE_SHIP_AT ? 0 : 4.99
  const total = subtotal + shipping
  const shipProgress = Math.min(100, (subtotal / FREE_SHIP_AT) * 100)
  const remainingForFree = Math.max(0, FREE_SHIP_AT - subtotal)

  const onCheckout = () => {
    if (!user) {
      navigate('/auth/login')
      setError('Sign in to place an order.')
      return
    }
    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }
    setBusy(true)
    setError('')
    void (async () => {
      try {
        const order = await createOrder({
          items,
          paymentMethod,
          subtotal,
          shipping,
          total,
          currency,
        })
        clearCart()
        setOrderId(order.id)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Checkout failed.')
      } finally {
        setBusy(false)
      }
    })()
  }

  if (orderId) {
    return (
      <main className="page-x relative mx-auto max-w-2xl py-12">
        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-200/40">
          <div className="relative h-44 overflow-hidden bg-violet-100">
            <img
              src="/auth/login-shop.jpg"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          </div>
          <div className="relative -mt-8 px-6 pb-8 text-center sm:px-10">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-violet-600 text-2xl font-bold !text-white shadow-lg shadow-violet-600/30">
              ✓
            </div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
              You’re all set
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Order placed
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Order <span className="font-semibold text-slate-700">{orderId.slice(0, 8)}</span>…
              is saved to your account. Track it under Orders.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/customer/orders"
                className="inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold !text-white shadow-md shadow-violet-600/25 transition hover:bg-violet-700"
              >
                View order
              </Link>
              <Link
                to="/customer/shop"
                className="inline-flex rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                Keep shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="page-x relative mx-auto max-w-3xl py-10">
        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-lg shadow-violet-100/50">
          <div className="grid sm:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-[220px] bg-violet-100 sm:min-h-[320px]">
              <img
                src="/auth/login-hero.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/80 max-sm:bg-gradient-to-t max-sm:from-white/90 max-sm:via-transparent max-sm:to-transparent" />
            </div>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
                Start styling
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Your cart is waiting
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Discover a look, choose your size, then add it here. We’ll hold
                everything ready for a smooth checkout.
              </p>
              <Link
                to="/customer/shop"
                className="mt-6 inline-flex w-fit rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold !text-white shadow-md shadow-violet-600/25 transition hover:bg-violet-700"
              >
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell page-x relative py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72"
        style={{
          background:
            'linear-gradient(180deg, #efe8ff 0%, #faf8ff 55%, transparent 100%)',
        }}
      />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/customer/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800"
          >
            <span aria-hidden>←</span>
            Continue shopping
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Your cart
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {itemCount} item{itemCount === 1 ? '' : 's'} ready to check out
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Estimated total
            </p>
            <p className="text-xl font-bold text-violet-700">
              {formatMoney(total, currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-semibold text-slate-500 transition hover:text-rose-600"
          >
            Clear all
          </button>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <section className="space-y-4" aria-label="Cart items">
          <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3.5 shadow-sm shadow-violet-100/50">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">
                {shipping === 0
                  ? 'You’ve unlocked free shipping'
                  : `${formatMoney(remainingForFree, currency)} away from free shipping`}
              </span>
              <span className="font-semibold text-violet-600">
                {Math.round(shipProgress)}%
              </span>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-violet-100">
              <div
                className="h-full rounded-full bg-violet-600 transition-all duration-500"
                style={{ width: `${shipProgress}%` }}
              />
            </div>
          </div>

          <ul className="space-y-3">
            {items.map((item) => {
              const max = getEffectiveStock(
                item.product.id,
                item.size,
                item.product.inStock,
                item.product.stockCount,
              )
              return (
                <li
                  key={item.key}
                  className="flex gap-4 rounded-2xl border border-violet-100 bg-white p-3.5 shadow-sm shadow-violet-100/40 transition hover:border-violet-200 hover:shadow-md hover:shadow-violet-100/60 sm:p-4"
                >
                  <Link
                    to={`/customer/product/${item.product.id}`}
                    className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-violet-50 sm:h-32 sm:w-24"
                  >
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-xs text-slate-400">
                        No image
                      </div>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {item.product.brand}
                        </p>
                        <Link
                          to={`/customer/product/${item.product.id}`}
                          className="mt-0.5 block text-sm font-semibold text-slate-900 hover:text-violet-700 sm:text-base"
                        >
                          {item.product.name}
                        </Link>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                            Size {item.size}
                          </span>
                          {max <= 3 && (
                            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                              Only {max} left
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-violet-700 sm:text-base">
                          {formatMoney(
                            item.product.price * item.quantity,
                            item.product.currency,
                          )}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-slate-400">
                            {formatMoney(item.product.price, item.product.currency)} each
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                      <div className="inline-flex items-center rounded-xl border border-violet-200 bg-violet-50/50">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            setItemQuantity(item.key, item.quantity - 1)
                          }
                          className="grid h-9 w-9 place-items-center text-lg font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-40"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={item.quantity >= max}
                          onClick={() =>
                            setItemQuantity(item.key, item.quantity + 1)
                          }
                          className="grid h-9 w-9 place-items-center text-lg font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="text-sm font-semibold text-slate-500 transition hover:text-rose-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <aside className="lg:sticky lg:top-24">
          <section
            className="rounded-3xl border border-violet-100 bg-white p-5 shadow-lg shadow-violet-100/50 sm:p-6"
            aria-label="Order summary"
          >
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Order summary
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">Secure demo checkout</p>

            <div className="mt-5 space-y-2.5 border-b border-violet-50 pb-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  {formatMoney(subtotal, currency)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span
                  className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : 'text-slate-800'}`}
                >
                  {shipping === 0 ? 'Free' : formatMoney(shipping, currency)}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-base">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-violet-700">
                  {formatMoney(total, currency)}
                </span>
              </div>
            </div>

            <div className="mt-5" aria-label="Payment method">
              <h3 className="text-sm font-semibold text-slate-800">Payment</h3>
              <div className="mt-2.5 grid gap-2">
                {PAYMENT_OPTIONS.map((option) => {
                  const selected = paymentMethod === option.id
                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                        selected
                          ? 'border-violet-400 bg-violet-50 shadow-sm shadow-violet-100'
                          : 'border-violet-100 bg-white hover:border-violet-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={selected}
                        onChange={() => setPaymentMethod(option.id)}
                        className="h-4 w-4 border-violet-300 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-slate-800">
                          {option.label}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {option.hint}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Demo only — no real payment is charged.
              </p>
            </div>

            {error && (
              <p
                className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              disabled={busy}
              onClick={onCheckout}
              className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold !text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700 disabled:opacity-60"
            >
              {busy ? 'Placing order…' : `Pay ${formatMoney(total, currency)}`}
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">
              Free returns within 30 days · Encrypted checkout
            </p>
          </section>
        </aside>
      </div>
    </main>
  )
}
