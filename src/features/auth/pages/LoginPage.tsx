import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { homePathForRole } from '../../../services/authService'

const AUDIENCES = [
  {
    id: 'customer',
    label: 'For Customers',
    hint: 'Browse · wishlist · checkout',
    image: '/auth/login-shop.jpg',
  },
  {
    id: 'owner',
    label: 'For Shop Owners',
    hint: 'Products · orders · analytics',
    image: '/auth/login-sell.jpg',
  },
] as const

const FEATURES = [
  {
    audience: 'customer' as const,
    title: 'Shop Collections',
    text: 'Browse curated fashion, save favorites to your wishlist, and check out in a few taps — all from one clean shopping experience.',
    image: '/auth/login-shop.jpg',
    badge: 'Shop',
  },
  {
    audience: 'owner' as const,
    title: 'Manage Your Shop',
    text: 'Add products, organize categories, and keep stock and store settings up to date so every order is ready to fulfill.',
    image: '/auth/login-sell.jpg',
    badge: 'Sell',
  },
  {
    audience: 'owner' as const,
    title: 'Grow Sales',
    text: 'See sales trends, top products, and order activity in one dashboard so you know what to restock and promote next.',
    image: '/auth/login-grow.jpg',
    badge: 'Grow',
  },
]

/** Single-viewport Novera login — gradient backdrop + overlapping hero. */
export function LoginPage() {
  const { login, user, loading, configured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [slide, setSlide] = useState(0)
  const [sliderPaused, setSliderPaused] = useState(false)
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]['id']>(
    'customer',
  )

  const goToSlide = (index: number) => {
    const next = (index + FEATURES.length) % FEATURES.length
    setSlide(next)
    setAudience(FEATURES[next].audience)
  }

  useEffect(() => {
    if (sliderPaused) return
    const id = window.setInterval(() => {
      setSlide((i) => {
        const next = (i + 1) % FEATURES.length
        setAudience(FEATURES[next].audience)
        return next
      })
    }, 3800)
    return () => window.clearInterval(id)
  }, [sliderPaused])

  if (!loading && user) {
    return <Navigate to={homePathForRole(user.role)} replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await login(email, password)
      if (!result.ok) {
        setError(result.error ?? 'Sign-in failed.')
        return
      }
      if (result.user) navigate(homePathForRole(result.user.role), { replace: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative h-dvh overflow-hidden text-slate-900">
      {/* Soft lavender base + wave gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #efe8ff 0%, #f7f3ff 38%, #ffffff 68%, #f3eeff 100%)',
        }}
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="loginWave" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8c8ff" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#e9deff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          fill="url(#loginWave)"
          d="M0 0h980C820 180 760 260 700 420c-70 180-40 300 80 480H0V0z"
        />
        <path
          fill="#cbb6ff"
          fillOpacity="0.22"
          d="M0 0c420 40 620 160 720 340S820 760 980 900H0V0z"
        />
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-10 h-[420px] w-[420px] rounded-full bg-violet-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-80px] left-[20%] h-[280px] w-[380px] rounded-full bg-fuchsia-200/20 blur-3xl"
      />

      {/* Center hero — soft-edged, sits between copy and login card */}
      <div className="pointer-events-none absolute inset-y-0 left-[52%] z-10 hidden w-[min(46vw,460px)] -translate-x-1/2 lg:block xl:left-[54%]">
        <div className="relative mx-auto h-full w-full max-w-[440px]">
          <div
            aria-hidden
            className="absolute inset-x-4 bottom-[10%] h-32 rounded-full bg-violet-400/25 blur-3xl"
          />
          <img
            src="/auth/login-hero.jpg"
            alt=""
            className="absolute bottom-[-2vh] left-1/2 h-[min(88vh,760px)] w-auto max-w-none -translate-x-1/2 scale-110 object-cover object-top"
            style={{
              maskImage: [
                'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
                'linear-gradient(to bottom, transparent 0%, black 6%, black 48%, transparent 92%)',
              ].join(', '),
              WebkitMaskImage: [
                'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
                'linear-gradient(to bottom, transparent 0%, black 6%, black 48%, transparent 92%)',
              ].join(', '),
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          />
        </div>
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-[1280px] items-center px-5 sm:px-8 lg:px-12">
        <div className="grid h-full w-full items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,400px)] lg:gap-16 xl:gap-24">
          {/* Left marketing panel */}
          <section className="relative z-20 flex max-w-xl flex-col justify-center gap-4 py-4 lg:py-0">
            <Link to="/" className="relative z-10 inline-flex w-fit items-center gap-2.5">
              <img
                src="/novera-icon.png"
                alt=""
                className="h-10 w-10 rounded-xl object-cover shadow-md shadow-violet-400/30 sm:h-10 sm:w-10 sm:rounded-[14px]"
              />
              <span className="text-2xl font-extrabold tracking-tight text-violet-700 sm:text-[1.445rem]">
                NOVERA
              </span>
            </Link>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-100/90 px-3.5 py-1.5 text-sm font-semibold text-violet-700">
              <span aria-hidden>✨</span>
              Welcome to Novera
            </span>

            <div>
              <h1 className="text-[2rem] font-extrabold leading-[1.12] tracking-tight sm:text-4xl xl:text-[2.75rem]">
                <span className="login-headline-line block text-slate-900">
                  Shop. Sell. Grow.
                </span>
                <span className="login-headline-accent block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                  All in one place.
                </span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                One account for two journeys — shop curated collections, or manage inventory and store performance.
              </p>
            </div>

            {/* Audience switcher */}
            <div className="grid grid-cols-2 gap-2.5">
              {AUDIENCES.map((item) => {
                const active = audience === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAudience(item.id)
                      const match = FEATURES.findIndex((f) => f.audience === item.id)
                      if (match >= 0) setSlide(match)
                    }}
                    className={`group relative overflow-hidden rounded-2xl border text-left transition duration-300 ${
                      active
                        ? 'border-violet-400 shadow-lg shadow-violet-300/40 ring-2 ring-violet-200'
                        : 'border-white/70 bg-white/60 hover:border-violet-200 hover:shadow-md'
                    }`}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={item.image}
                        alt=""
                        className={`h-full w-full object-cover transition duration-500 ${
                          active ? 'scale-105 opacity-100' : 'opacity-80'
                        }`}
                      />
                      <div
                        className={`absolute inset-0 ${
                          active
                            ? 'bg-gradient-to-r from-violet-700/90 via-violet-600/80 to-violet-500/55'
                            : 'bg-gradient-to-r from-slate-900/55 via-slate-900/35 to-violet-900/20'
                        }`}
                      />
                    </div>
                    <div className="relative px-3.5 py-3.5">
                      <p className="text-sm font-bold !text-white">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-violet-100">
                        {item.hint}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Feature slider */}
            <div
              className="relative"
              onMouseEnter={() => setSliderPaused(true)}
              onMouseLeave={() => setSliderPaused(false)}
            >
              <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-md shadow-violet-200/40">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${slide * 100}%)` }}
                >
                  {FEATURES.map((item) => (
                    <article
                      key={item.title}
                      className="w-full shrink-0"
                    >
                      <div className="relative h-[140px] overflow-hidden sm:h-[158px]">
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />
                        <span
                          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide !text-white shadow-sm ${
                            item.badge === 'Shop'
                              ? 'bg-sky-500'
                              : item.badge === 'Sell'
                                ? 'bg-violet-600'
                                : 'bg-fuchsia-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                        <p className="text-base font-semibold text-slate-800">
                          {item.title}
                        </p>
                        <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-slate-500 sm:text-sm">
                          {item.text}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {FEATURES.map((item, index) => (
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
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() => goToSlide(slide + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-100 bg-white text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Login card */}
          <section className="relative z-30 flex items-center justify-center py-3 lg:justify-end lg:py-0">
            <div className="relative w-full max-w-[400px] rounded-[1.75rem] border border-white/90 bg-white p-6 shadow-[0_24px_60px_-20px_rgba(91,56,190,0.28)] sm:p-7">
              <div className="flex items-center gap-2.5">
                <img
                  src="/novera-icon.png"
                  alt=""
                  className="h-9 w-9 rounded-[10px] object-cover shadow-sm shadow-violet-300/40"
                />
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  NOVERA
                </span>
              </div>

              <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Sign in to continue shopping or manage your shop.
              </p>

              {!configured && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Add Supabase keys to <code>.env.local</code> to enable auth.
                </p>
              )}

              <form className="mt-5 space-y-3.5" onSubmit={(e) => void onSubmit(e)}>
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
                      className="w-full rounded-xl border border-violet-300 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
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
                      className="w-full rounded-xl border border-violet-300 bg-white py-2.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-violet-600"
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

                <div className="text-right">
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-semibold text-violet-600 hover:text-violet-800"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold !text-white shadow-lg shadow-violet-600/30 transition hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-60"
                >
                  <span>{busy ? 'Signing in…' : 'Sign In'}</span>
                  {!busy && (
                    <span className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                New here?{' '}
                <Link
                  to="/auth/signup"
                  className="font-semibold text-violet-600 hover:text-violet-800"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
