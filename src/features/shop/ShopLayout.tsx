import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-stone-900 text-white'
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
  }`

/** Shop-owner shell with inventory / categories / settings nav. */
export function ShopLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
          <Link
            to="/shop"
            className="font-[Syne] text-xl font-extrabold text-stone-900"
          >
            Styla Shop
          </Link>
          <p className="mt-1 text-xs text-stone-500">{user?.name}</p>
          <nav className="mt-6 flex flex-col gap-1">
            <NavLink to="/shop" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/shop/products" className={linkClass}>
              Products
            </NavLink>
            <NavLink to="/shop/categories" className={linkClass}>
              Categories
            </NavLink>
            <NavLink to="/shop/settings" className={linkClass}>
              Shop settings
            </NavLink>
            <NavLink to="/shop/profile" className={linkClass}>
              Profile
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-6 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold hover:bg-stone-50"
          >
            Sign out
          </button>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
