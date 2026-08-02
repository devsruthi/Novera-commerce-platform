import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-indigo-600 text-white'
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
  }`

/** Customer shell with catalog / wishlist / cart navigation. */
export function CustomerLayout() {
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
  const { items: wishlist } = useWishlist()

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            to="/customer"
            className="font-[Syne] text-xl font-extrabold text-indigo-700"
          >
            Styla
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/customer" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/customer/shop" className={linkClass}>
              Shop
            </NavLink>
            <NavLink to="/customer/categories" className={linkClass}>
              Categories
            </NavLink>
            <NavLink to="/customer/ai" className={linkClass}>
              AI
            </NavLink>
            <NavLink to="/customer/wishlist" className={linkClass}>
              Wishlist{wishlist.length ? ` (${wishlist.length})` : ''}
            </NavLink>
            <NavLink to="/customer/cart" className={linkClass}>
              Cart{itemCount ? ` (${itemCount})` : ''}
            </NavLink>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-stone-500 sm:inline">{user?.name}</span>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-full border border-stone-200 px-3 py-1.5 font-semibold hover:bg-stone-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
