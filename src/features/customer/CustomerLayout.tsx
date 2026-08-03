import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { OrdersProvider, useOrders } from '../../context/OrdersContext'
import { Snackbar } from '../../components/Snackbar'

const navIconClass = 'h-[18px] w-[18px] shrink-0'
const actionIconClass = 'h-[22px] w-[22px] shrink-0'

const icons = {
  home: (
    <svg className={navIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 0 1 3 20z" />
    </svg>
  ),
  shop: (
    <svg className={navIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 9h16l-1.2 10.2A2 2 0 0 1 16.8 21H7.2a2 2 0 0 1-2-1.8L4 9z" />
      <path d="M8 9V7a4 4 0 0 1 8 0v2" />
    </svg>
  ),
  categories: (
    <svg className={navIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  wishlist: (
    <svg className={actionIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12.1 20.3 4.6 13a5.1 5.1 0 0 1 7.2-7.2l.3.3.3-.3a5.1 5.1 0 0 1 7.2 7.2l-7.5 7.3Z" />
    </svg>
  ),
  cart: (
    <svg className={actionIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 4h2l1.6 10.2A2 2 0 0 0 8.6 16H18a2 2 0 0 0 2-1.6L21 8H6" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  ),
  orders: (
    <svg className={actionIconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  ),
  logout: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
}

function navClass({ isActive }: { isActive: boolean }) {
  return `inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-violet-600 !text-white shadow-sm shadow-violet-600/25'
      : 'text-slate-600 hover:bg-violet-50 hover:text-violet-800'
  }`
}

function actionClass({ isActive }: { isActive: boolean }) {
  return `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-violet-100 text-violet-800 ring-1 ring-violet-200'
      : 'text-slate-600 hover:bg-violet-50 hover:text-violet-800'
  }`
}

function ActionIcon({ icon, count }: { icon: ReactNode; count: number }) {
  return (
    <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center">
      {icon}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-violet-600 px-1 text-[9px] font-bold leading-none !text-white ring-2 ring-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </span>
  )
}

function userInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

function CustomerHeader() {
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
  const { items: wishlist } = useWishlist()
  const { orders } = useOrders()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const confirmLogout = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
      setLogoutOpen(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-violet-100/80 bg-white/90 backdrop-blur-md">
        <div className="page-shell page-x flex flex-wrap items-center justify-between gap-3 py-2.5">
          <Link to="/customer" className="inline-flex items-center gap-2">
            <img
              src="/novera-icon.png"
              alt=""
              className="h-8 w-8 rounded-[9px] object-cover shadow-sm shadow-violet-300/40"
            />
            <span className="text-lg font-extrabold tracking-tight text-violet-700">
              NOVERA
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-0.5" aria-label="Browse">
            <NavLink to="/customer" end className={navClass}>
              {icons.home}
              <span>Home</span>
            </NavLink>
            <NavLink to="/customer/shop" className={navClass}>
              {icons.shop}
              <span>Shop</span>
            </NavLink>
            <NavLink to="/customer/categories" className={navClass}>
              {icons.categories}
              <span>Categories</span>
            </NavLink>
          </nav>

          <div className="flex flex-wrap items-center gap-1.5">
            <nav className="flex items-center gap-0.5" aria-label="Account">
              <NavLink to="/customer/wishlist" className={actionClass}>
                <ActionIcon icon={icons.wishlist} count={wishlist.length} />
                <span className="hidden sm:inline">Wishlist</span>
              </NavLink>
              <NavLink to="/customer/cart" className={actionClass}>
                <ActionIcon icon={icons.cart} count={itemCount} />
                <span className="hidden sm:inline">Cart</span>
              </NavLink>
              <NavLink to="/customer/orders" className={actionClass}>
                <ActionIcon icon={icons.orders} count={orders.length} />
                <span className="hidden sm:inline">Orders</span>
              </NavLink>
            </nav>

            <div className="ml-1 hidden h-6 w-px bg-violet-100 sm:block" />

            <div className="flex items-center gap-3 pl-1">
              {user?.name && (
                <div className="hidden items-center gap-2 md:flex" title={user.name}>
                  <span
                    aria-hidden
                    className="grid h-8 w-8 place-items-center rounded-full bg-violet-100 text-[11px] font-bold uppercase tracking-wide text-violet-700"
                  >
                    {userInitials(user.name)}
                  </span>
                  <div className="min-w-0 leading-tight">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-500">
                      Signed in
                    </p>
                    <p className="max-w-[9rem] truncate text-sm font-semibold capitalize text-slate-800">
                      {user.name}
                    </p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-semibold !text-white shadow-sm shadow-violet-600/25 transition hover:bg-violet-700"
              >
                {icons.logout}
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {logoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => !signingOut && setLogoutOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-logout-title"
            className="w-full max-w-md rounded-2xl border border-violet-100 bg-white p-6 shadow-xl shadow-violet-900/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              {icons.logout}
            </div>
            <h2
              id="customer-logout-title"
              className="mt-4 text-center text-lg font-bold text-slate-900"
            >
              Sign out of Novera?
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500">
              You’re signed in as{' '}
              <span className="font-semibold text-slate-700">
                {user?.email || user?.name}
              </span>
              . You’ll need to sign in again to continue shopping.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={signingOut}
                onClick={() => setLogoutOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={signingOut}
                onClick={() => void confirmLogout()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold !text-white shadow-md shadow-violet-600/25 transition hover:bg-violet-700 disabled:opacity-60"
              >
                {icons.logout}
                {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/** Customer shell with catalog / wishlist / cart / orders navigation. */
export function CustomerLayout() {
  return (
    <OrdersProvider>
      <div className="min-h-screen bg-[#faf8ff] text-slate-900">
        <CustomerHeader />
        <Outlet />
        <Snackbar />
      </div>
    </OrdersProvider>
  )
}
