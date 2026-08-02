import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { getMyShop } from '../../services/shopService'
import { shop } from './shopUi'

type NavItem = {
  to: string
  label: string
  end?: boolean
  icon: ReactNode
}

const iconClass = 'h-[18px] w-[18px] shrink-0'

const icons = {
  overview: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  products: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.3 7 12 12l8.7-5M12 22V12" />
    </svg>
  ),
  categories: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  orders: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  ),
  customers: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  analytics: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3v18h18" />
      <path d="M7 14v4M12 9v9M17 5v13" />
    </svg>
  ),
  reviews: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12 3 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18l.9-5.4L4.2 8.7l5.4-.8L12 3z" />
    </svg>
  ),
  marketing: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6A8 8 0 0 1 21 12a8 8 0 0 1-2.5 6" />
    </svg>
  ),
  settings: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  profile: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  ),
  support: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4M12 17h.01" />
    </svg>
  ),
}

const primaryNav: NavItem[] = [
  { to: '/shop', label: 'Overview', end: true, icon: icons.overview },
  { to: '/shop/products', label: 'Products', icon: icons.products },
  { to: '/shop/categories', label: 'Categories', icon: icons.categories },
  { to: '/shop/orders', label: 'Orders', icon: icons.orders },
  { to: '/shop/customers', label: 'Customers', icon: icons.customers },
  { to: '/shop/analytics', label: 'Analytics', icon: icons.analytics },
  { to: '/shop/reviews', label: 'Reviews', icon: icons.reviews },
  { to: '/shop/marketing', label: 'Marketing', icon: icons.marketing },
]

const secondaryNav: NavItem[] = [
  { to: '/shop/settings', label: 'Store Settings', icon: icons.settings },
  { to: '/shop/profile', label: 'Profile', icon: icons.profile },
  { to: '/shop/support', label: 'Support', icon: icons.support },
]

function navClass({ isActive }: { isActive: boolean }) {
  return `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-violet-50 text-violet-700 before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-violet-600'
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
  }`
}

function isProductsListPath(pathname: string) {
  return (
    pathname === '/shop/products' ||
    pathname === '/shop/products/'
  )
}

/** Shop-owner shell — Novera sidebar + top bar. */
export function ShopLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [navOpen, setNavOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const shopQuery = useQuery({
    queryKey: ['my-shop', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => getMyShop(user!.id),
  })

  const shopName = shopQuery.data?.shop_name || 'Your shop'
  const onProductsList = isProductsListPath(location.pathname)
  const searchValue = onProductsList ? (searchParams.get('q') ?? '') : ''

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!logoutOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLogoutOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [logoutOpen])

  const confirmLogout = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
      setLogoutOpen(false)
    }
  }

  const handleSearchChange = (value: string) => {
    if (onProductsList) {
      const next = new URLSearchParams(searchParams)
      if (value.trim()) next.set('q', value)
      else next.delete('q')
      setSearchParams(next, { replace: true })
      return
    }

    const params = new URLSearchParams()
    if (value.trim()) params.set('q', value)
    navigate({
      pathname: '/shop/products',
      search: params.toString() ? `?${params}` : '',
    })
  }

  return (
    <div className="min-h-screen bg-[#F4F5F9] text-slate-900">
      <div className="flex min-h-screen">
        {navOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[248px] shrink-0 flex-col border-r border-slate-200/80 bg-white transition-transform lg:sticky lg:translate-x-0 ${
            navOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="px-4 py-5">
            <Link to="/shop" className="inline-flex items-center gap-3">
              <img
                src="/novera-icon.png"
                alt="Novera"
                className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-md shadow-violet-400/35 sm:h-16 sm:w-16"
              />
              <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                NOVERA
              </span>
            </Link>
          </div>

          <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Shop Owner
          </p>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
            {primaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navClass}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            <div className="my-3 border-t border-slate-100" />
            {secondaryNav.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-100 p-3">
            <div className="rounded-2xl bg-slate-50/80 p-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-violet-100 ring-2 ring-white">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold text-violet-700">
                      {(user?.name?.[0] || 'O').toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {shopName}
                  </p>
                  <p className="text-xs text-slate-500">Owner</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-sm font-semibold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {logoutOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]"
            role="presentation"
            onClick={() => !signingOut && setLogoutOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="shop-logout-title"
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
              </div>
              <h2
                id="shop-logout-title"
                className="mt-4 text-center text-lg font-bold text-slate-900"
              >
                Log out of Novera?
              </h2>
              <p className="mt-2 text-center text-sm text-slate-500">
                You’re signed in as{' '}
                <span className="font-semibold text-slate-700">
                  {user?.email || shopName}
                </span>
                . You’ll need to sign in again to manage your shop.
              </p>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className={shop.btnSecondary}
                  disabled={signingOut}
                  onClick={() => setLogoutOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={signingOut}
                  onClick={() => void confirmLogout()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold !text-white shadow-md shadow-rose-600/25 transition hover:bg-rose-700 disabled:opacity-60"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  {signingOut ? 'Logging out…' : 'Logout'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:gap-4 sm:px-6">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
              aria-label="Open menu"
              onClick={() => setNavOpen(true)}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div className="relative max-w-xl flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={searchRef}
                type="search"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products, SKU, categories…"
                className="w-full rounded-xl border border-violet-300 bg-violet-50 py-2.5 pl-10 pr-14 text-sm text-slate-800 shadow-sm shadow-violet-200/50 outline-none transition placeholder:text-violet-400/80 focus:border-violet-500 focus:bg-violet-50/80 focus:ring-2 focus:ring-violet-200"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-violet-200 bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-violet-500 sm:inline">
                ⌘K
              </kbd>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                aria-label="Notifications"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.7 1.7 0 0 0 3.4 0" />
                </svg>
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  5
                </span>
              </button>
              <Link to="/shop/products/new" className={shop.btnPrimary}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Product
              </Link>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
