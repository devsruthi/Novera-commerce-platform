import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { homePathForRole } from '../../../services/authService'
import type { UserRole } from '../../../types'

const ROLES: {
  id: UserRole
  label: string
  hint: string
  icon: ReactNode
}[] = [
  {
    id: 'customer',
    label: 'Customer',
    hint: 'Shop & discover',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
        <path
          d="M20 21a8 8 0 0 0-16 0"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    id: 'shop_owner',
    label: 'Seller',
    hint: 'Sell & manage',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
        <path
          d="M4 10h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M3 10l2.2-5.2A2 2 0 017 3.5h10a2 2 0 011.8 1.3L21 10"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

const HIGHLIGHTS = [
  {
    title: 'Your own storefront',
    text: 'List products, organize categories, and keep inventory ready so every order ships smoothly.',
    image: '/auth/login-sell.jpg',
    badge: 'Sell',
  },
  {
    title: 'Curated fashion',
    text: 'Discover collections chosen for style — not noise. Save favorites and check out in a few taps.',
    image: '/auth/login-shop.jpg',
    badge: 'Shop',
  },
  {
    title: 'Insights that scale',
    text: 'Track sales trends and top products so you know what to restock and promote next.',
    image: '/auth/login-grow.jpg',
    badge: 'Grow',
  },
]

const FEATURES = [
  {
    label: 'Wishlist & Checkout',
    icon: (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" aria-hidden>
        <path
          d="M12.1 20.3 4.6 13a5.1 5.1 0 0 1 7.2-7.2l.3.3.3-.3a5.1 5.1 0 0 1 7.2 7.2l-7.5 7.3Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    label: 'Shop Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" aria-hidden>
        <path
          d="M4 10h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M3 10l2.2-5.2A2 2 0 017 3.5h10a2 2 0 011.8 1.3L21 10"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    label: 'Sales Insights',
    icon: (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" aria-hidden>
        <path
          d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

const inputClass =
  'w-full rounded-xl border border-violet-300 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100'

const inputToggleClass =
  'w-full rounded-xl border border-violet-300 bg-white py-2.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100'

/** Signup — reference layout with role cards + marketing panel. */
export function SignupPage() {
  const { register, user, loading, configured } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const roleParam = searchParams.get('role')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<UserRole>('customer')
  const [shopName, setShopName] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [slide, setSlide] = useState(0)
  const [sliderPaused, setSliderPaused] = useState(false)

  useEffect(() => {
    setRole(roleParam === 'shop_owner' ? 'shop_owner' : 'customer')
  }, [roleParam])

  const goToSlide = (index: number) => {
    setSlide((index + HIGHLIGHTS.length) % HIGHLIGHTS.length)
  }

  useEffect(() => {
    if (sliderPaused) return
    const id = window.setInterval(() => {
      setSlide((i) => (i + 1) % HIGHLIGHTS.length)
    }, 3800)
    return () => window.clearInterval(id)
  }, [sliderPaused])

  if (!loading && user) {
    if (roleParam === 'shop_owner' && user.role === 'shop_owner') {
      return <Navigate to="/shop" replace />
    }
    if (roleParam === 'customer' && user.role === 'customer') {
      return <Navigate to="/customer/shop" replace />
    }
    if (!roleParam) {
      return <Navigate to={homePathForRole(user.role)} replace />
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setNote('')
    try {
      const result = await register({
        name,
        email,
        phone,
        password,
        role,
        shopName,
      })
      if (!result.ok) {
        setError(result.error ?? 'Could not create account.')
        return
      }
      if (result.note) {
        setNote(result.note)
        return
      }
      if (result.user) navigate(homePathForRole(result.user.role), { replace: true })
    } finally {
      setBusy(false)
    }
  }

  const activeHighlight = HIGHLIGHTS[slide]

  return (
    <div className="relative min-h-dvh overflow-hidden text-slate-900">
      <div aria-hidden className="absolute inset-0 bg-[#f5f3ff]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(124,58,237,0.12)_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 size-[28rem] rounded-full bg-violet-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 size-[26rem] rounded-full bg-fuchsia-200/20 blur-3xl"
      />

      <div className="page-shell page-x relative z-20 flex min-h-dvh items-center py-6">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,460px)] lg:gap-12 xl:gap-16">
          {/* Left marketing */}
          <section className="relative z-20 flex max-w-xl flex-col justify-center gap-5">
            <Link to="/" className="inline-flex w-fit items-center gap-2.5">
              <img
                src="/novera-icon.png"
                alt=""
                className="h-10 w-10 rounded-xl object-cover shadow-md shadow-violet-400/30"
              />
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                NOVERA
              </span>
            </Link>

            <span className="inline-flex w-fit items-center rounded-full bg-violet-100 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-violet-700">
              Free to join · Ready in minutes
            </span>

            <div>
              <h1 className="text-[2.1rem] font-extrabold leading-[1.1] tracking-tight sm:text-4xl xl:text-[2.85rem]">
                <span className="block text-slate-900">Start your journey.</span>
                <span className="mt-1 block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                  Shop or sell today.
                </span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                Create one account for browsing curated collections — or open
                your shop and grow sales from the same place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {FEATURES.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur"
                >
                  {item.icon}
                  {item.label}
                </span>
              ))}
            </div>

            <div
              className="relative mt-1"
              onMouseEnter={() => setSliderPaused(true)}
              onMouseLeave={() => setSliderPaused(false)}
            >
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-xl shadow-violet-200/40">
                <div className="relative h-[200px] sm:h-[230px]">
                  {HIGHLIGHTS.map((item, index) => (
                    <img
                      key={item.title}
                      src={item.image}
                      alt=""
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                        index === slide ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                </div>

                {/* Overlapping info card */}
                <div className="absolute bottom-4 left-4 right-4 flex items-start gap-3 rounded-2xl border border-white/80 bg-white/95 p-3.5 shadow-lg backdrop-blur sm:right-auto sm:max-w-[260px]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                      <path
                        d="M4 7h16l-1.2 11.2a2 2 0 01-2 1.8H7.2a2 2 0 01-2-1.8L4 7z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <path
                        d="M9 7V5.5A3 3 0 0112 2.5v0a3 3 0 013 3V7"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">
                      {activeHighlight.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">
                      {activeHighlight.text}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {HIGHLIGHTS.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      aria-label={`Show ${item.title}`}
                      onClick={() => goToSlide(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        slide === index
                          ? 'w-6 bg-violet-600'
                          : 'w-1.5 bg-violet-200 hover:bg-violet-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={() => goToSlide(slide - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-700 shadow-sm transition hover:bg-violet-50"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() => goToSlide(slide + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-700 shadow-sm transition hover:bg-violet-50"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Signup card */}
          <section className="relative z-30 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] max-h-[min(92dvh,920px)] overflow-y-auto rounded-[1.75rem] border border-white/90 bg-white p-5 shadow-[0_28px_70px_-22px_rgba(124,58,237,0.32)] sm:p-6">
              {/* Decorative fashion visuals */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-2 hidden h-28 w-36 sm:block"
              >
                <img
                  src="/auth/login-bag.jpg"
                  alt=""
                  className="absolute right-6 top-4 h-20 w-16 rotate-6 rounded-xl object-cover shadow-lg ring-2 ring-white"
                />
                <img
                  src="/auth/login-shop.jpg"
                  alt=""
                  className="absolute right-0 top-10 h-16 w-20 -rotate-6 rounded-xl object-cover shadow-md ring-2 ring-white"
                />
              </div>

              <h2 className="pr-24 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Create your account
              </h2>
              <p className="mt-1 max-w-[280px] text-sm text-slate-500">
                Choose how you want to continue, then fill in a few details.
              </p>

              {!configured && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Add Supabase keys to <code>.env.local</code> to enable auth.
                </p>
              )}

              <form className="mt-5 space-y-3.5" onSubmit={(e) => void onSubmit(e)}>
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold text-slate-800">
                    I want to continue as
                  </legend>
                  <div
                    role="tablist"
                    aria-label="Account type"
                    className="grid grid-cols-2 gap-2.5"
                  >
                    {ROLES.map((item) => {
                      const active = role === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => {
                            setRole(item.id)
                            const match = HIGHLIGHTS.findIndex(
                              (h) =>
                                (item.id === 'customer' && h.badge === 'Shop') ||
                                (item.id === 'shop_owner' && h.badge === 'Sell'),
                            )
                            if (match >= 0) setSlide(match)
                          }}
                          className={`relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${
                            active
                              ? 'bg-violet-600 !text-white shadow-md shadow-violet-600/30'
                              : 'border border-violet-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50/60'
                          }`}
                        >
                          {active && (
                            <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-white/20">
                              <svg viewBox="0 0 24 24" className="size-2.5" fill="none" aria-hidden>
                                <path
                                  d="M5 12l5 5L20 7"
                                  stroke="currentColor"
                                  strokeWidth="2.6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                          <span
                            className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                              active
                                ? 'bg-white/15 !text-white'
                                : 'bg-violet-50 text-violet-600'
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="min-w-0 pr-3">
                            <span className="block text-base font-bold leading-tight">
                              {item.label}
                            </span>
                            <span
                              className={`mt-0.5 block text-[11px] leading-tight ${
                                active ? 'text-violet-100' : 'text-slate-400'
                              }`}
                            >
                              {item.hint}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-slate-600">
                      Full name
                    </span>
                    <span className="relative block">
                      <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M20 21a8 8 0 0 0-16 0" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        className={inputClass}
                        autoComplete="name"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-600">
                      Email address
                    </span>
                    <span className="relative block">
                      <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                      <input
                        className={inputClass}
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </span>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-600">
                      Phone{' '}
                      <span className="font-normal text-slate-400">(optional)</span>
                    </span>
                    <span className="relative block">
                      <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6.5 6.5l1.1-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9z" />
                      </svg>
                      <input
                        className={inputClass}
                        type="tel"
                        autoComplete="tel"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </span>
                  </label>

                  {role === 'shop_owner' && (
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-medium text-slate-600">
                        Shop name
                      </span>
                      <span className="relative block">
                        <svg
                          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <path d="M9 22V12h6v10" />
                        </svg>
                        <input
                          className={inputClass}
                          placeholder="Your shop name"
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          required
                        />
                      </span>
                    </label>
                  )}

                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-slate-600">
                      Password
                    </span>
                    <span className="relative block">
                      <svg
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                      <input
                        className={inputToggleClass}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-violet-500 transition hover:text-violet-700"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.8 2.8M9.4 5.1A9.8 9.8 0 0 1 12 4.5c5 0 9.3 3.6 10.5 7.5a11.4 11.4 0 0 1-4.2 5.1M6.2 6.2A11.3 11.3 0 0 0 1.5 12C2.7 15.9 7 19.5 12 19.5c1.5 0 2.9-.3 4.2-.8" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </span>
                  </label>
                </div>

                {error && (
                  <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </p>
                )}
                {note && (
                  <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    {note}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-semibold !text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700 disabled:opacity-60"
                >
                  <span>{busy ? 'Creating…' : 'Create account'}</span>
                  {!busy && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="font-semibold text-violet-700 hover:text-violet-900"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
