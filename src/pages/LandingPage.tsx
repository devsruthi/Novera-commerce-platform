import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { homePathForRole } from '../services/authService'

const TRUST = [
  {
    title: 'Secure & Reliable',
    tone: 'bg-violet-100 text-violet-700',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
        <path
          d="M12 3l7 3v5.5c0 4.4-2.8 7.4-7 9.1-4.2-1.7-7-4.7-7-9.1V6l7-3z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 12.2l1.8 1.8 3.5-3.8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Real Stores',
    tone: 'bg-fuchsia-100 text-fuchsia-700',
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
  {
    title: 'All in One',
    tone: 'bg-sky-100 text-sky-700',
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
        <path
          d="M13 2L4 14h7l-1 8 10-14h-7l1-6z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const

const WHY = [
  {
    title: 'Curated & Trusted',
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
        <path
          d="M12 3l7 3v5.5c0 4.4-2.8 7.4-7 9.1-4.2-1.7-7-4.7-7-9.1V6l7-3z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    title: 'Easy Shopping',
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
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
    ),
  },
  {
    title: 'Secure Platform',
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
] as const

/** Public splash — guests only; signed-in users redirect by role. */
export function LandingPage() {
  const { user, loading } = useAuth()

  if (!loading && user) {
    return <Navigate to={homePathForRole(user.role)} replace />
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#faf8ff] text-sm text-slate-500">
        Loading…
      </div>
    )
  }

  return (
    <div className="landing relative min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[linear-gradient(155deg,#f5f3ff_0%,#faf8ff_38%,#ffffff_68%,#fce7f3_100%)]" />
        <div className="absolute inset-0 opacity-[0.4] [background-image:radial-gradient(rgba(124,58,237,0.14)_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -left-28 -top-24 size-[30rem] rounded-full bg-violet-400/20 blur-3xl landing-orb" />
        <div className="absolute -right-24 top-24 size-[26rem] rounded-full bg-fuchsia-300/25 blur-3xl landing-orb landing-orb-delay" />
      </div>

      <div className="page-x relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col pb-6 pt-5">
        <header className="flex items-center justify-between gap-3">
          <Link to="/" className="group inline-flex items-center gap-2.5">
            <img
              src="/novera-icon.png"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-[12px] object-cover shadow-md shadow-violet-400/35 transition group-hover:scale-[1.03]"
            />
            <span className="brand-wordmark brand-wordmark-lg">Novera</span>
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:py-5">
          {/* Left hero */}
          <section className="landing-fade-up relative z-10 max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-200/90 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700 shadow-sm backdrop-blur">
              <span aria-hidden>✦</span>
              Dual-role marketplace
            </p>

            <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Shop real stores.
              <span className="mt-1 block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                All in one place.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
              Novera is a dual-role marketplace where customers discover curated
              products and shop owners grow their business.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/auth/signup"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold !text-white shadow-xl shadow-violet-600/30 transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                  <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Create account
                <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-md shadow-violet-200/40 transition hover:-translate-y-0.5 hover:border-violet-100 hover:bg-violet-50"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                  <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Sign in
              </Link>
            </div>

            <ul className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
              {TRUST.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-white/80 bg-white/75 p-3 shadow-sm backdrop-blur"
                >
                  <span className={`mb-2 inline-flex size-9 items-center justify-center rounded-xl ${item.tone}`}>
                    {item.icon}
                  </span>
                  <p className="text-xs font-semibold leading-snug text-slate-700 sm:text-[13px]">
                    {item.title}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Right preview — no Browse/Sell action buttons */}
          <section className="landing-fade-up landing-fade-up-delay relative mx-auto w-full max-w-lg lg:max-w-none">
            <div
              className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-violet-400/25 via-fuchsia-300/20 to-transparent blur-2xl"
              aria-hidden
            />

            <div className="landing-float relative overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/95 p-4 shadow-[0_30px_80px_-28px_rgba(91,33,182,0.4)] backdrop-blur-xl sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                    Welcome back, Novera <span aria-hidden>👋</span>
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    Choose how you want to continue
                  </p>
                </div>
                <div className="flex items-center gap-2" aria-hidden>
                  <span className="relative grid size-9 place-items-center rounded-full border border-violet-100 bg-violet-50 text-violet-600">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none">
                      <path
                        d="M15 17H9m9-4V10a6 6 0 10-12 0v3l-1.4 2.1A1 1 0 005.4 17h13.2a1 1 0 00.8-1.9L18 13z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-rose-500" />
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-violet-600 text-xs font-bold !text-white shadow-md shadow-violet-600/30">
                    N
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <article className="overflow-hidden rounded-[1.35rem] border border-violet-100 bg-gradient-to-b from-violet-50 to-white shadow-sm">
                  <div className="relative h-36 overflow-hidden bg-gradient-to-b from-violet-200/50 to-violet-50">
                    <span className="absolute left-3 top-3 z-10 grid size-8 place-items-center rounded-xl bg-white/90 text-violet-600 shadow-sm">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                        <path d="M4 7h16l-1.2 11.2a2 2 0 01-2 1.8H7.2a2 2 0 01-2-1.8L4 7z" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M9 7V5.5A3 3 0 0112 2.5v0a3 3 0 013 3V7" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                    </span>
                    <img
                      src="/auth/login-bag.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-base font-bold text-slate-900">
                      I&apos;m a Customer
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      Discover amazing products from real stores.
                    </p>
                  </div>
                </article>

                <article className="overflow-hidden rounded-[1.35rem] border border-fuchsia-100 bg-gradient-to-b from-fuchsia-50 to-white shadow-sm">
                  <div className="relative h-36 overflow-hidden bg-gradient-to-b from-fuchsia-200/40 to-rose-50">
                    <span className="absolute left-3 top-3 z-10 grid size-8 place-items-center rounded-xl bg-white/90 text-fuchsia-600 shadow-sm">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
                        <path d="M4 10h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9z" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M3 10l2.2-5.2A2 2 0 017 3.5h10a2 2 0 011.8 1.3L21 10" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                    </span>
                    <img
                      src="/auth/login-shop.jpg"
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-base font-bold text-slate-900">
                      I&apos;m a Shop owner
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      Manage your store and grow your business.
                    </p>
                  </div>
                </article>
              </div>

              <div className="mt-5 rounded-[1.25rem] border border-violet-100/80 bg-gradient-to-r from-violet-50/90 via-white to-fuchsia-50/60 px-4 py-3.5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Why Novera?
                </p>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {WHY.map((item) => (
                    <div key={item.title} className="flex min-w-0 flex-col items-start gap-1.5">
                      <span className="inline-flex size-8 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
                        {item.icon}
                      </span>
                      <p className="text-[11px] font-bold leading-snug text-slate-800">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="landing-fade-up relative z-10 mt-2">
          <div className="flex flex-col items-start gap-3 overflow-hidden rounded-[1.35rem] border border-violet-100/80 bg-white/85 px-4 py-3.5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="inline-flex items-center gap-2 text-sm text-slate-600">
              <span className="text-violet-500" aria-hidden>
                ✦
              </span>
              <span>
                Your marketplace. Your way.{' '}
                <span className="font-semibold text-slate-800">
                  Built for customers and shop owners to succeed together.
                </span>
              </span>
            </p>
            <div className="flex shrink-0 items-end gap-2" aria-hidden>
              <img
                src="/auth/login-bag.jpg"
                alt=""
                className="h-12 w-12 rounded-xl object-cover shadow-sm ring-1 ring-violet-100"
              />
              <img
                src="/auth/login-shop.jpg"
                alt=""
                className="h-12 w-12 rounded-xl object-cover shadow-sm ring-1 ring-violet-100"
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
