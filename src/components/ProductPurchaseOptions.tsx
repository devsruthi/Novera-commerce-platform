import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import type { Product } from '../types'
import { resolveSizes } from '../lib/inferProduct'
import {
  getEffectiveStock,
  hasStockAlert,
  requestStockAlert,
} from '../lib/stockAlerts'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useShop } from '../context/ShopContext'

interface ProductPurchaseOptionsProps {
  product: Product
  compact?: boolean
}

export function ProductPurchaseOptions({
  product,
  compact = false,
}: ProductPurchaseOptionsProps) {
  const {
    addToCart,
    showSnackbar,
    items,
    setItemQuantity,
    removeItem,
  } = useCart()
  const { user, openAuth } = useAuth()
  const { openProduct, closeProduct } = useShop()
  const sizes = useMemo(() => resolveSizes(product), [product])
  const [size, setSize] = useState(sizes[0] ?? '')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [watching, setWatching] = useState(false)
  const [stockTick, setStockTick] = useState(0)

  const available = getEffectiveStock(
    product.id,
    size,
    product.inStock,
    product.stockCount,
  )
  const soldOut = available <= 0

  const cartItem = items.find(
    (item) => item.product.id === product.id && item.size === size,
  )
  const cartKey = cartItem?.key

  useEffect(() => {
    const next = resolveSizes(product)
    const firstAvailable =
      next.find(
        (s) =>
          getEffectiveStock(product.id, s, product.inStock, product.stockCount) >
          0,
      ) ??
      next[0] ??
      ''
    setSize(firstAvailable)
    setError('')
    setWatching(hasStockAlert(product.id, firstAvailable))
  }, [
    product.id,
    product.inStock,
    product.stockCount,
    product.sizes,
    product.category,
    stockTick,
  ])

  useEffect(() => {
    setWatching(hasStockAlert(product.id, size))
  }, [product.id, size, stockTick])

  useEffect(() => {
    if (compact) return
    const max = Math.max(available, 0)
    if (max <= 0) {
      setQty(0)
      return
    }
    setQty(cartItem ? Math.min(cartItem.quantity, max) : 1)
  }, [compact, size, available, cartItem?.quantity, product.id])

  useEffect(() => {
    const onAvailable = () => setStockTick((n) => n + 1)
    window.addEventListener('styla:stock-available', onAvailable)
    return () => window.removeEventListener('styla:stock-available', onAvailable)
  }, [])

  const stop = (e: MouseEvent) => e.stopPropagation()

  const updateQty = (next: number) => {
    const max = Math.max(available, 0)
    if (max <= 0) {
      setQty(0)
      return
    }
    const clamped = Math.min(max, Math.max(1, next))
    setQty(clamped)
    if (cartKey) {
      setItemQuantity(cartKey, clamped)
    }
  }

  const onDelete = () => {
    if (cartKey) {
      removeItem(cartKey)
      setQty(available > 0 ? 1 : 0)
      setError('')
      showSnackbar('Removed from your cart')
      return
    }
    setQty(available > 0 ? 1 : 0)
    setError('')
  }

  const onNotify = () => {
    if (!user) {
      openAuth('login')
      setError('Sign in to get a restock alert.')
      return
    }
    const result = requestStockAlert({
      productId: product.id,
      size,
      productName: product.name,
      userId: user.id,
    })
    setWatching(true)
    setError('')
    showSnackbar(
      result.alreadyWatching
        ? `Already watching — we'll message you when ${product.name} is back.`
        : `Got it — we'll message you when ${product.name} is available.`,
    )
  }

  const onAdd = () => {
    if (soldOut) return

    if (compact) {
      openProduct(product.id)
      return
    }

    if (!user) {
      openAuth('login')
      setError('Sign in to save your cart.')
      return
    }

    if (qty <= 0) {
      setError('This size is sold out.')
      return
    }

    if (cartKey) {
      setItemQuantity(cartKey, qty)
      setError('')
      closeProduct()
      showSnackbar('Cart updated')
      return
    }

    const result = addToCart(product, size, qty)
    if (!result.ok) {
      setError(result.error ?? 'Could not add to cart.')
      return
    }
    setError('')
    closeProduct()
    showSnackbar('Added to cart')
  }

  return (
    <div
      className={`purchase-options ${compact ? 'is-compact' : ''} ${soldOut ? 'is-sold-out' : ''}`}
      onClick={stop}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="purchase-row">
        <span className="purchase-label">Size</span>
        <div className="size-pills" role="group" aria-label="Select size">
          {sizes.map((s) => {
            const stock = getEffectiveStock(
              product.id,
              s,
              product.inStock,
              product.stockCount,
            )
            const sizeSoldOut = stock <= 0
            return (
              <button
                key={s}
                type="button"
                className={`size-pill ${size === s ? 'is-selected' : ''} ${sizeSoldOut ? 'is-sold-out' : ''}`}
                disabled={sizeSoldOut && !compact}
                aria-pressed={size === s}
                title={sizeSoldOut ? 'Sold out' : `${stock} available`}
                onClick={() => {
                  if (compact) {
                    openProduct(product.id)
                    return
                  }
                  setSize(s)
                  setError('')
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {compact ? (
        <div className="purchase-row purchase-cart-row">
          {soldOut ? (
            <button
              type="button"
              className="notify-btn"
              onClick={onNotify}
              disabled={watching}
            >
              {watching ? 'Watching for restock' : 'Notify me'}
            </button>
          ) : (
            <button
              type="button"
              className="solid-btn add-cart-btn"
              onClick={onAdd}
            >
              Add to cart
            </button>
          )}
          <span
            className={`stock-hint ${soldOut ? 'is-oos' : available <= 3 ? 'is-low' : ''}`}
          >
            {soldOut
              ? 'Sold out'
              : available <= 3
                ? `Only ${available} left`
                : `${available} in stock`}
          </span>
        </div>
      ) : (
        <div className="purchase-actions">
          {!soldOut && (
            <div className="purchase-toolbar">
              <div className="purchase-qty-group">
                <span className="purchase-label">Qty</span>
                <div className="qty-counter">
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                    onClick={() => updateQty(qty - 1)}
                  >
                    −
                  </button>
                  <span className="qty-value" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="Increase quantity"
                    disabled={qty >= available}
                    onClick={() => updateQty(qty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="text-btn purchase-delete-btn"
                onClick={onDelete}
                disabled={!cartKey && qty <= 1}
                aria-label={cartKey ? 'Remove from cart' : 'Reset quantity'}
              >
                {cartKey ? 'Remove' : 'Reset'}
              </button>
            </div>
          )}

          <div className="purchase-cta-block">
            {soldOut ? (
              <button
                type="button"
                className="notify-btn"
                onClick={onNotify}
                disabled={watching}
              >
                {watching ? 'Watching for restock' : 'Notify me'}
              </button>
            ) : (
              <button
                type="button"
                className="solid-btn add-cart-btn"
                onClick={onAdd}
              >
                {cartKey ? 'Update cart' : 'Add to cart'}
              </button>
            )}
            <p
              className={`stock-hint ${soldOut ? 'is-oos' : available <= 3 ? 'is-low' : ''}`}
            >
              {soldOut
                ? 'Sold out'
                : available <= 3
                  ? `Only ${available} left`
                  : `${available} in stock`}
            </p>
          </div>
        </div>
      )}
      {error && (
        <p className="cart-inline-msg is-err" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
