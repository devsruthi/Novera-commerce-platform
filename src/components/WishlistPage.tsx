import { useCart } from '../context/CartContext'
import { useShop } from '../context/ShopContext'
import { formatMoney } from '../lib/catalogApi'
import { resolveSizes } from '../lib/inferProduct'
import { getEffectiveStock } from '../lib/stockAlerts'

export function WishlistPage() {
  const { wishlist, closeWishlist, removeFromWishlist, openProduct } = useShop()
  const { addToCart, showSnackbar, openCart } = useCart()

  const moveToCart = (productId: string) => {
    const product = wishlist.find((item) => item.id === productId)
    if (!product) return

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

    removeFromWishlist(product.id)
    showSnackbar(`Moved to cart (size ${size})`)
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-page-inner">
        <header className="wishlist-page-header">
          <div>
            <button type="button" className="back-btn" onClick={closeWishlist}>
              <span aria-hidden>←</span>
              Back to shopping
            </button>
            <h1>Wishlist</h1>
            <p className="cart-subtitle">
              {wishlist.length === 0
                ? 'No saved looks yet'
                : `${wishlist.length} item${wishlist.length === 1 ? '' : 's'}`}
            </p>
          </div>
          {wishlist.length > 0 && (
            <button type="button" className="ghost-btn" onClick={openCart}>
              Go to cart
            </button>
          )}
        </header>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty-panel">
            <p>
              Tap the heart on any product to save it here. Then move items to your cart
              when you’re ready.
            </p>
            <button type="button" className="solid-btn" onClick={closeWishlist}>
              Browse products
            </button>
          </div>
        ) : (
          <ul className="wishlist-grid">
            {wishlist.map((product) => (
              <li key={product.id} className="wishlist-card">
                <button
                  type="button"
                  className="wishlist-card-media"
                  onClick={() => openProduct(product.id)}
                  aria-label={`View ${product.name}`}
                >
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="" />
                  ) : (
                    <div className="product-image-fallback" />
                  )}
                </button>
                <div className="wishlist-card-body">
                  <p className="cart-line-brand">{product.brand}</p>
                  <h2>{product.name}</h2>
                  <p className="wishlist-card-price">
                    {formatMoney(product.price, product.currency)}
                    <span className="rating">
                      {product.rating.toFixed(1)}★
                      {product.reviewCount > 0 ? ` · ${product.reviewCount}` : ''}
                    </span>
                  </p>
                  <div className="wishlist-card-actions">
                    <button
                      type="button"
                      className="solid-btn"
                      onClick={() => moveToCart(product.id)}
                    >
                      Move to cart
                    </button>
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
