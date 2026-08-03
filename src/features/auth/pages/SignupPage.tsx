import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { homePathForRole } from '../../../services/authService'
import type { UserRole } from '../../../types'

const ROLES = [
  { id: 'customer' as const, label: 'Customer' },
  { id: 'shop_owner' as const, label: 'Shop owner' },
]

const HIGHLIGHTS = [
  {
    title: 'Curated fashion',
    text: 'Discover collections chosen for style — not noise. Save favorites and check out in a few taps.',
    image: '/auth/login-shop.jpg',
    badge: 'Shop',
  },
  {
    title: 'Your own storefront',
    text: 'List products, organize categories, and keep inventory ready so every order ships smoothly.',
    image: '/auth/login-sell.jpg',
    badge: 'Sell',
  },
  {
    title: 'Insights that scale',
    text: 'Track sales trends and top products so you know what to restock and promote next.',
    image: '/auth/login-grow.jpg',
    badge: 'Grow',
  },
]

const inputClass =
  'w-full rounded-xl border border-violet-300 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100'

const inputToggleClass =
  'w-full rounded-xl border border-violet-300 bg-white py-2.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100'

/** Single-viewport Novera signup — marketing slides + wide register form. */
export function SignupPage() {
  const { register, user, loading, configured } = useAuth()
  const navigate = useNavigate()
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
    return <Navigate to={homePathForRole(user.role)} replace />
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

  return (
    <div className="relative h-dvh overflow-hidden text-slate-900">
      <div aria-hidden className="absolute inset-0 bg-[#faf8ff]" />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="signupWaveA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ede9fe" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#faf8ff" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="signupWaveB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#e9d5ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#f5f3ff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          fill="url(#signupWaveA)"
          d="M0 0h920C780 140 720 240 680 400c-55 210-10 340 140 500H0V0z"
        />
        <path
          fill="url(#signupWaveB)"
          d="M1440 900H520c140-120 210-240 250-400 45-180 20-320-90-500h760v900z"
        />
        <path
          fill="#a78bfa"
          fillOpacity="0.12"
          d="M0 620c180-40 320-20 480 40s300 80 420 40c140-45 280-30 420 20v180H0V620z"
        />
        <path
          fill="#8b5cf6"
          fillOpacity="0.08"
          d="M0 720c200-50 360-30 520 30s310 70 460 20c130-40 280-20 460 40v90H0V720z"
        />
      </svg>

      <div className="page-shell page-x relative z-20 flex h-full items-center">
        <div className="grid h-full w-full items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(400px,460px)] lg:gap-10 xl:gap-14">
          {/* Left marketing */}
          <section className="relative z-20 flex max-w-xl flex-col justify-center gap-4 py-4 lg:py-0">
            <Link to="/" className="relative z-10 inline-flex w-fit items-center gap-2.5">
              <img
                src="/novera-icon.png"
                alt=""
                className="h-10 w-10 rounded-xl object-cover shadow-md shadow-violet-400/30 sm:rounded-[14px]"
              />
              <span className="text-2xl font-extrabold tracking-tight text-violet-700 sm:text-[1.445rem]">
                NOVERA
              </span>
            </Link>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-fuchsia-100/90 px-3.5 py-1.5 text-sm font-semibold text-fuchsia-700">
              <span aria-hidden>✦</span>
              Free to join · Ready in minutes
            </span>

            <div>
              <h1 className="text-[2rem] font-extrabold leading-[1.12] tracking-tight sm:text-4xl xl:text-[2.75rem]">
                <span className="login-headline-line block text-slate-900">
                  Start your journey.
                </span>
                <span className="login-headline-accent block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                  Shop or sell today.
                </span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                Create one account for browsing curated collections — or open your shop and grow sales from the same place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Wishlist & checkout', 'Shop dashboard', 'Sales insights'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 bg-white/70 px-3 py-1 text-xs font-semibold text-violet-700 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  {item}
                </span>
              ))}
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
                  {HIGHLIGHTS.map((item) => (
                    <article key={item.title} className="w-full shrink-0">
                      <div className="relative h-[148px] overflow-hidden sm:h-[168px]">
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/25" />
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

          {/* Signup card */}
          <section className="relative z-30 flex items-center justify-center py-3 lg:justify-end lg:py-0">
            <div className="signup-card relative w-full max-w-[460px] max-h-[min(92dvh,900px)] overflow-y-auto rounded-[1.75rem] border border-white/90 bg-white p-5 shadow-[0_28px_70px_-22px_rgba(124,58,237,0.32)] sm:p-6">
              <div
                aria-hidden
                className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-violet-600"
              />

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

              <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Create your account
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose how you’ll use Novera, then fill in a few details.
              </p>

              {!configured && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Add Supabase keys to <code>.env.local</code> to enable auth.
                </p>
              )}

              <form className="mt-4 space-y-3" onSubmit={(e) => void onSubmit(e)}>
                <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-violet-200 bg-violet-50/80 p-1.5 shadow-inner shadow-violet-100/80">
                  {ROLES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setRole(item.id)
                        const match = HIGHLIGHTS.findIndex(
                          (h) =>
                            (item.id === 'customer' && h.badge === 'Shop') ||
                            (item.id === 'shop_owner' && h.badge === 'Sell'),
                        )
                        if (match >= 0) setSlide(match)
                      }}
                      className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                        role === item.id
                          ? 'border border-violet-200 bg-white text-violet-700 shadow-md shadow-violet-200/60'
                          : 'border border-transparent text-slate-500 hover:bg-white/50 hover:text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
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
                  className="relative flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold !text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700 disabled:opacity-60"
                >
                  <span>{busy ? 'Creating…' : 'Create account'}</span>
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
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="font-semibold !text-[var(--primary)] hover:!text-[var(--primary-deep)]"
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
