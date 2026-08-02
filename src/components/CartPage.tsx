import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrdersContext'
import { CART_EMPTY_VISUALS, CART_SUCCESS_VISUAL } from '../data/cartVisuals'
import { formatMoney } from '../lib/catalogApi'
import { getEffectiveStock } from '../lib/stockAlerts'
import type { PaymentMethod } from '../types'

type CartPageProps = {
  /** When set, continue/browse actions navigate here instead of closing the AI cart overlay. */
  continuePath?: string
  /** When set, “View order” navigates here instead of opening the AI orders overlay. */
  ordersPath?: string
}

const PAYMENT_OPTIONS: Array<{
  id: PaymentMethod
  label: string
  hint: string
  mark: string
}> = [
  { id: 'card', label: 'Card', hint: 'Visa, Mastercard, Amex', mark: 'Card' },
  { id: 'paypal', label: 'PayPal', hint: 'Pay with PayPal balance', mark: 'Pay' },
  { id: 'applepay', label: 'Apple Pay', hint: 'Touch ID / Face ID', mark: '' },
  { id: 'klarna', label: 'Klarna', hint: 'Pay in 3 interest-free', mark: 'Klarna' },
]

export function CartPage({ continuePath, ordersPath }: CartPageProps = {}) {
  const navigate = useNavigate()
  const {
    closeCart,
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
  const { user, openAuth } = useAuth()
  const { createOrder, openOrders } = useOrders()
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const freeShipAt = 75
  const shipping = items.length === 0 || subtotal >= freeShipAt ? 0 : 4.99
  const total = subtotal + shipping
  const shipProgress = Math.min(100, (subtotal / freeShipAt) * 100)
  const remainingForFree = Math.max(0, freeShipAt - subtotal)

  const continueShopping = () => {
    if (continuePath) {
      navigate(continuePath)
      return
    }
    closeCart()
  }

  const onCheckout = () => {
    if (!user) {
      if (continuePath) {
        navigate('/auth/login')
      } else {
        openAuth('login')
      }
      setError('Sign in to place an order.')
      return
    }
    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }
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
        setError('')
        setOrderId(order.id)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Checkout failed.')
      }
    })()
  }

  const viewOrder = () => {
    if (ordersPath) {
      navigate(ordersPath)
      return
    }
    closeCart()
    openOrders()
  }

  return (
    <main className="cart-page">
      <div className="cart-atmosphere" aria-hidden>
        <span className="cart-blob cart-blob-a" />
        <span className="cart-blob cart-blob-b" />
        <span className="cart-grid-fade" />
      </div>

      <div className="cart-page-inner">
        <header className="cart-hero">
          <div className="cart-hero-copy">
            <button type="button" className="back-btn cart-back" onClick={continueShopping}>
              <span aria-hidden>←</span>
              Continue shopping
            </button>
            <p className="cart-kicker">Checkout</p>
            <h1>
              Your <em>cart</em>
            </h1>
            <p className="cart-subtitle">
              {itemCount === 0
                ? 'Nothing here yet — find a look you love.'
                : `${itemCount} item${itemCount === 1 ? '' : 's'} ready to check out`}
            </p>
          </div>

          {items.length > 0 && !orderId && (
            <div className="cart-hero-side">
              <div className="cart-hero-total">
                <span>Estimated total</span>
                <strong>{formatMoney(total, currency)}</strong>
              </div>
              <button type="button" className="text-btn" onClick={clearCart}>
                Clear all
              </button>
            </div>
          )}
        </header>

        {orderId ? (
          <section className="cart-media-stage is-success">
            <div className="cart-media-visual">
              <img
                src={CART_SUCCESS_VISUAL.src}
                alt={CART_SUCCESS_VISUAL.alt}
                className="cart-media-cover"
              />
              <div className="cart-media-veil" aria-hidden />
            </div>
            <div className="cart-media-copy">
              <div className="cart-state-mark" aria-hidden>
                ✓
              </div>
              <p className="cart-kicker">You’re all set</p>
              <h2 className="cart-success-title">Order placed</h2>
              <p>
                Order <strong>{orderId.slice(0, 8)}</strong>… is saved to your
                account. Track it under Orders.
              </p>
              <div className="cart-success-actions">
                <button type="button" className="solid-btn" onClick={viewOrder}>
                  View order
                </button>
                <button type="button" className="ghost-btn" onClick={continueShopping}>
                  Keep exploring
                </button>
              </div>
            </div>
          </section>
        ) : items.length === 0 ? (
          <section className="cart-media-stage is-empty">
            <div className="cart-media-visual">
              <video
                className="cart-media-video"
                autoPlay
                muted
                loop
                playsInline
                poster={CART_EMPTY_VISUALS.poster}
              >
                <source src={CART_EMPTY_VISUALS.video} type="video/mp4" />
              </video>
              <div className="cart-media-collage" aria-hidden>
                {CART_EMPTY_VISUALS.collage.map((shot, i) => (
                  <img
                    key={shot.src}
                    src={shot.src}
                    alt=""
                    className={`cart-collage-shot is-${i + 1}`}
                  />
                ))}
              </div>
              <div className="cart-media-veil" aria-hidden />
            </div>

            <div className="cart-media-copy">
              <p className="cart-kicker">Start styling</p>
              <h2 className="cart-success-title">Your cart is waiting</h2>
              <p>
                Discover a look, choose your size, then add it here. We’ll hold
                everything ready for a smooth checkout.
              </p>
              <button type="button" className="solid-btn" onClick={continueShopping}>
                Browse products
              </button>

              <div className="cart-look-strip" aria-label="Inspiration looks">
                <p className="cart-look-strip-label">Inspiration</p>
                <div className="cart-look-strip-track">
                  {[...CART_EMPTY_VISUALS.strip, ...CART_EMPTY_VISUALS.strip].map(
                    (shot, i) => (
                      <figure key={`${shot.src}-${i}`} className="cart-look-card">
                        <img src={shot.src} alt={shot.alt} loading="lazy" />
                      </figure>
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="cart-page-grid">
            <section className="cart-page-items" aria-label="Cart items">
              <div className="cart-ship-banner">
                <div className="cart-ship-banner-top">
                  <span>
                    {shipping === 0
                      ? 'You’ve unlocked free shipping'
                      : `${formatMoney(remainingForFree, currency)} away from free shipping`}
                  </span>
                  <span>{Math.round(shipProgress)}%</span>
                </div>
                <div className="cart-ship-track" aria-hidden>
                  <span style={{ width: `${shipProgress}%` }} />
                </div>
              </div>

              <ul className="cart-list">
                {items.map((item, index) => {
                  const max = getEffectiveStock(
                    item.product.id,
                    item.size,
                    item.product.inStock,
                    item.product.stockCount,
                  )
                  return (
                    <li
                      key={item.key}
                      className="cart-line"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="cart-line-media">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt="" />
                        ) : (
                          <div className="product-image-fallback" />
                        )}
                      </div>
                      <div className="cart-line-body">
                        <p className="cart-line-brand">{item.product.brand}</p>
                        <h2>{item.product.name}</h2>
                        <div className="cart-line-tags">
                          <span>Size {item.size}</span>
                          {max <= 3 && <span className="is-low">Only {max} left</span>}
                        </div>
                        <div className="cart-line-actions">
                          <div className="qty-counter">
                            <button
                              type="button"
                              className="qty-btn"
                              aria-label="Decrease quantity"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                setItemQuantity(item.key, item.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              aria-label="Increase quantity"
                              disabled={item.quantity >= max}
                              onClick={() =>
                                setItemQuantity(item.key, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="text-btn"
                            onClick={() => removeItem(item.key)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="cart-line-price-col">
                        <p className="cart-line-price">
                          {formatMoney(
                            item.product.price * item.quantity,
                            item.product.currency,
                          )}
                        </p>
                        {item.quantity > 1 && (
                          <span className="cart-line-unit">
                            {formatMoney(item.product.price, item.product.currency)} each
                          </span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>

            <aside className="cart-page-aside">
              <section className="cart-checkout-card" aria-label="Order summary">
                <div className="cart-checkout-head">
                  <h2>Order summary</h2>
                  <p>Secure demo checkout</p>
                </div>

                <div className="cart-summary-rows">
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>{formatMoney(subtotal, currency)}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'is-free' : ''}>
                      {shipping === 0 ? 'Free' : formatMoney(shipping, currency)}
                    </span>
                  </div>
                  <div className="cart-summary-row is-total">
                    <span>Total</span>
                    <span>{formatMoney(total, currency)}</span>
                  </div>
                </div>

                <div className="cart-payment-block" aria-label="Payment method">
                  <h3>Payment</h3>
                  <div className="payment-options">
                    {PAYMENT_OPTIONS.map((option) => (
                      <label
                        key={option.id}
                        className={`payment-option ${paymentMethod === option.id ? 'is-selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={option.id}
                          checked={paymentMethod === option.id}
                          onChange={() => setPaymentMethod(option.id)}
                        />
                        <span className="payment-mark" aria-hidden>
                          {option.id === 'applepay' ? (
                            <svg viewBox="0 0 24 24" width="16" height="16">
                              <path
                                fill="currentColor"
                                d="M16.4 12.6c0-1.7 1.4-2.5 1.5-2.6-0.8-1.2-2.1-1.4-2.5-1.4-1.1-.1-2 .6-2.6.6-.6 0-1.4-.6-2.3-.6-1.2 0-2.3.7-2.9 1.8-1.2 2.2-.3 5.4.9 7.1.6.9 1.3 1.8 2.2 1.8.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6c1 0 1.6-.8 2.2-1.7.7-1 .9-1.9.9-2 0-.1-1.7-.6-1.7-3zm-1.6-4.7c.5-.6.8-1.4.7-2.2-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.4-.8 2.2.8.1 1.6-.4 2.2-1.1z"
                              />
                            </svg>
                          ) : (
                            option.mark
                          )}
                        </span>
                        <span>
                          <strong>{option.label}</strong>
                          <small>{option.hint}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="cart-demo-note">Demo only — no real payment is charged.</p>
                </div>

                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  className="solid-btn full cart-checkout-btn"
                  onClick={onCheckout}
                >
                  Pay {formatMoney(total, currency)}
                </button>
                <p className="cart-trust-note">Free returns within 30 days · Encrypted checkout</p>
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
