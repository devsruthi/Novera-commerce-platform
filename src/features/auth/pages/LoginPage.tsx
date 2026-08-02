import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
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

const GOLDEN_ORBS = [
  { className: '-left-3 top-[6%] h-2 w-2 bg-amber-300', delay: '0s', duration: '2.4s' },
  { className: 'left-[38%] top-[-1%] h-1.5 w-1.5 bg-yellow-200', delay: '0.4s', duration: '1.8s' },
  { className: 'right-[6%] top-[14%] h-2.5 w-2.5 bg-amber-200', delay: '0.9s', duration: '2.8s' },
  { className: 'left-[14%] top-[42%] h-1 w-1 bg-amber-400', delay: '1.3s', duration: '1.6s' },
  { className: 'right-[20%] bottom-[24%] h-1.5 w-1.5 bg-yellow-300', delay: '0.2s', duration: '2.1s' },
  { className: 'left-[4%] bottom-[10%] h-2 w-2 bg-amber-300', delay: '1.7s', duration: '3s' },
  { className: 'left-[62%] top-[22%] h-1 w-1 bg-yellow-300', delay: '0.6s', duration: '1.5s' },
  { className: 'left-[72%] top-[58%] h-2 w-2 bg-amber-200', delay: '1.1s', duration: '2.6s' },
  { className: 'left-[48%] top-[68%] h-1 w-1 bg-amber-400', delay: '2s', duration: '1.9s' },
  { className: 'right-[2%] bottom-[40%] h-1.5 w-1.5 bg-yellow-200', delay: '0.8s', duration: '2.3s' },
  { className: 'left-[30%] bottom-[30%] h-[3px] w-[3px] bg-amber-300', delay: '1.5s', duration: '1.4s' },
  { className: 'left-[88%] top-[8%] h-1 w-1 bg-amber-300', delay: '0.3s', duration: '2s' },
  { className: 'left-[-1%] top-[58%] h-1.5 w-1.5 bg-yellow-300', delay: '1.9s', duration: '2.5s' },
  { className: 'left-[55%] top-[36%] h-[3px] w-[3px] bg-amber-200', delay: '0.1s', duration: '1.7s' },
  { className: 'right-[30%] top-[4%] h-2 w-2 bg-amber-300', delay: '1.4s', duration: '2.9s' },
  { className: 'left-[22%] bottom-[2%] h-1 w-1 bg-yellow-200', delay: '2.2s', duration: '1.6s' },
]

const GOLDEN_STARS = [
  { className: 'left-[26%] top-[5%] h-3 w-3 text-amber-400', delay: '0.2s', duration: '2.2s' },
  { className: 'right-[3%] top-[36%] h-2.5 w-2.5 text-yellow-400', delay: '0.7s', duration: '1.9s' },
  { className: 'left-[1%] top-[30%] h-2 w-2 text-amber-300', delay: '1.1s', duration: '2.6s' },
  { className: 'right-[16%] bottom-[7%] h-3.5 w-3.5 text-amber-400', delay: '0.4s', duration: '3.1s' },
  { className: 'left-[52%] bottom-[3%] h-2 w-2 text-yellow-300', delay: '1.6s', duration: '1.7s' },
  { className: 'left-[70%] top-[12%] h-[9px] w-[9px] text-amber-300', delay: '0.1s', duration: '2s' },
  { className: 'left-[8%] top-[72%] h-2.5 w-2.5 text-yellow-400', delay: '1.3s', duration: '2.4s' },
  { className: 'left-[44%] top-[28%] h-[7px] w-[7px] text-amber-400', delay: '0.9s', duration: '1.5s' },
  { className: 'right-[8%] top-[62%] h-3 w-3 text-amber-300', delay: '1.8s', duration: '2.7s' },
  { className: 'left-[34%] bottom-[18%] h-2 w-2 text-yellow-300', delay: '0.5s', duration: '2.1s' },
  { className: 'left-[80%] bottom-[34%] h-[8px] w-[8px] text-amber-400', delay: '1.2s', duration: '1.8s' },
  { className: 'left-[16%] top-[16%] h-[6px] w-[6px] text-yellow-200', delay: '2.1s', duration: '2.3s' },
  { className: 'right-[28%] top-[48%] h-2 w-2 text-amber-300', delay: '0.6s', duration: '1.6s' },
  { className: 'left-[60%] bottom-[16%] h-[10px] w-[10px] text-yellow-400', delay: '1.5s', duration: '2.8s' },
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
          {/* Golden glitter on sweater */}
          <svg
            aria-hidden
            className="login-glitter absolute left-[18%] top-[42%] z-10 h-3.5 w-3.5 text-amber-400"
            style={{ animationDelay: '0.3s', animationDuration: '2.1s' }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L13.8 10.2L24 12L13.8 13.8L12 24L10.2 13.8L0 12L10.2 10.2L12 0Z" />
          </svg>
          <svg
            aria-hidden
            className="login-glitter absolute left-[34%] top-[56%] z-10 h-2.5 w-2.5 text-yellow-300"
            style={{ animationDelay: '1.1s', animationDuration: '1.8s' }}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L13.8 10.2L24 12L13.8 13.8L12 24L10.2 13.8L0 12L10.2 10.2L12 0Z" />
          </svg>
        </div>
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-[1280px] items-center px-5 sm:px-8 lg:px-12">
        <div className="grid h-full w-full items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,400px)] lg:gap-16 xl:gap-24">
          {/* Left marketing panel */}
          <section className="relative z-20 flex max-w-xl flex-col justify-center gap-4 py-4 lg:py-0">
            {/* Golden star & spark accents */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 overflow-visible"
            >
              {GOLDEN_ORBS.map((orb, i) => (
                <span
                  key={`orb-${i}`}
                  className={`login-glitter-orb absolute rounded-full ${orb.className}`}
                  style={{
                    animationDelay: orb.delay,
                    animationDuration: orb.duration,
                  }}
                />
              ))}
              {GOLDEN_STARS.map((star, i) => (
                <svg
                  key={`star-${i}`}
                  className={`login-glitter absolute ${star.className}`}
                  style={{
                    animationDelay: star.delay,
                    animationDuration: star.duration,
                  }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L13.8 10.2L24 12L13.8 13.8L12 24L10.2 13.8L0 12L10.2 10.2L12 0Z" />
                </svg>
              ))}
            </div>

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
                <span className="login-headline-accent block bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
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
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
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
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
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
                  className="relative flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold !text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700 disabled:opacity-60"
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

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium text-slate-400">
                  or continue with
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <SocialButton label="Google">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 11.7S6.9 21 12 21c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.5H12z"
                    />
                    <path fill="#34A853" d="M3.9 7.5l3.2 2.4C8 8 9.9 6.7 12 6.7c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.4 12 2.4 8.5 2.4 5.5 4.4 3.9 7.5z" />
                    <path fill="#FBBC05" d="M12 21c2.5 0 4.6-.8 6.1-2.3l-3-2.4c-.8.6-1.9 1-3.1 1-2.4 0-4.4-1.6-5.1-3.8l-3.2 2.5C5.4 18.7 8.4 21 12 21z" />
                    <path fill="#4285F4" d="M20.6 12.3c0-.6-.1-1-.2-1.5H12v3.9h5.5c-.3 1.3-1.1 2.3-2.2 3l3 2.4c1.8-1.7 2.3-4.2 2.3-7.8z" />
                  </svg>
                </SocialButton>
                <SocialButton label="Apple">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8s-1.6-.8-2.7-.7c-1.4.1-2.6.8-3.3 2.1-1.4 2.5-.4 6.1 1 8.1.7 1 1.5 2 2.6 2 .1 0 .6-.2 1.2-.2s.9.2 1.2.2c1 0 1.8-1 2.5-1.9.8-1.1 1.1-2.2 1.1-2.2s-2.1-.8-1.9-3.4zM14.7 6.5c.5-.7.9-1.6.8-2.5-.8 0-1.7.5-2.3 1.2-.5.6-.9 1.5-.8 2.4 1 0 1.7-.5 2.3-1.1z" />
                  </svg>
                </SocialButton>
                <SocialButton label="Facebook">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-1c0-.6.4-1 1-1z" />
                  </svg>
                </SocialButton>
              </div>

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

function SocialButton({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={`${label} sign-in coming soon`}
      className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-violet-200 hover:bg-violet-50/50"
    >
      {children}
    </button>
  )
}
