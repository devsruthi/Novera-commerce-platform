import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrdersContext'
import { useShop } from '../context/ShopContext'
import { SignOutModal } from './SignOutModal'

export function Header() {
  const { user, openAuth } = useAuth()
  const {
    clear,
    goBack,
    hasSearched,
    wishlist,
    wishlistOpen,
    openWishlist,
    closeWishlist,
  } = useShop()
  const { itemCount, openCart, isOpen: cartOpen, closeCart } = useCart()
  const { orders, isOpen: ordersOpen, openOrders, closeOrders } = useOrders()
  const [signOutOpen, setSignOutOpen] = useState(false)

  const onOpenWishlist = () => {
    closeCart()
    closeOrders()
    if (!user) {
      openAuth('login')
      return
    }
    openWishlist()
  }

  const onOpenCart = () => {
    closeWishlist()
    closeOrders()
    openCart()
  }

  const onOpenOrders = () => {
    closeWishlist()
    closeCart()
    openOrders()
  }

  return (
    <>
      <header className="site-header">
        <div className="header-left">
          {(hasSearched || cartOpen || wishlistOpen || ordersOpen) && (
            <button
              type="button"
              className="back-btn"
              onClick={() => {
                if (cartOpen) {
                  closeCart()
                  return
                }
                if (wishlistOpen) {
                  closeWishlist()
                  return
                }
                if (ordersOpen) {
                  closeOrders()
                  return
                }
                goBack()
              }}
              aria-label="Back"
            >
              <span aria-hidden>←</span>
              Back
            </button>
          )}
          <a
            className="brand"
            href="/"
            onClick={(e) => {
              e.preventDefault()
              closeCart()
              closeWishlist()
              closeOrders()
              clear()
            }}
          >
            <img
              className="brand-mark-img"
              src="/novera-icon.png"
              alt=""
              width={25}
              height={25}
              aria-hidden
            />
            <span className="brand-name">Novera</span>
          </a>
        </div>

        <nav className="header-actions" aria-label="Account">
          {hasSearched && !cartOpen && !wishlistOpen && !ordersOpen && (
            <button type="button" className="ghost-btn new-search-btn" onClick={clear}>
              New search
            </button>
          )}
          <button
            type="button"
            className={`ghost-btn orders-nav-btn ${ordersOpen ? 'is-active' : ''}`}
            onClick={onOpenOrders}
            aria-current={ordersOpen ? 'page' : undefined}
          >
            Orders
            {orders.length > 0 && (
              <span className="orders-nav-count">{orders.length}</span>
            )}
          </button>
          <button
            type="button"
            className={`icon-btn ${wishlistOpen ? 'is-active' : ''}`}
            onClick={onOpenWishlist}
            aria-label={`Open wishlist, ${wishlist.length} items`}
            aria-current={wishlistOpen ? 'page' : undefined}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill={wishlist.length > 0 ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                d="M12.1 20.3 4.6 13a5.1 5.1 0 0 1 7.2-7.2l.3.3.3-.3a5.1 5.1 0 0 1 7.2 7.2l-7.5 7.3Z"
              />
            </svg>
            {wishlist.length > 0 && (
              <span className="cart-badge">{wishlist.length}</span>
            )}
          </button>
          <button
            type="button"
            className={`icon-btn ${cartOpen ? 'is-active' : ''}`}
            onClick={onOpenCart}
            aria-label={`Open cart, ${itemCount} items`}
            aria-current={cartOpen ? 'page' : undefined}
          >
            <svg
              className="cart-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.2 3h1.7l.4 2H20a1 1 0 0 1 .98 1.2l-1.5 7A2 2 0 0 1 17.52 15H8.3l-.4 2H19a1 1 0 1 1 0 2H6.7a1 1 0 0 1-.98-1.2L7.1 13.2 5.2 5H3.2a1 1 0 0 1 0-2Zm4.1 10h9.9l1.1-5H6.5l.8 5Z"
              />
            </svg>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>
          {user ? (
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setSignOutOpen(true)}
            >
              {user.username} · Sign out
            </button>
          ) : (
            <button type="button" className="solid-btn" onClick={() => openAuth('login')}>
              Sign in
            </button>
          )}
        </nav>
      </header>

      <SignOutModal open={signOutOpen} onClose={() => setSignOutOpen(false)} />
    </>
  )
}
