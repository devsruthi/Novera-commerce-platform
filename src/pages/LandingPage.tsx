import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { homePathForRole } from '../services/authService'

/** Public marketing landing — routes users into auth or their role home. */
export function LandingPage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#eef2ff_0%,_#fafaf9_45%,_#f5f5f4_100%)] text-stone-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-[Syne] text-2xl font-extrabold text-indigo-700">
          Styla
        </span>
        <nav className="flex items-center gap-3 text-sm font-semibold">
          {!loading && user ? (
            <Link
              to={homePathForRole(user.role)}
              className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="rounded-full px-4 py-2 text-stone-700 hover:bg-white/70"
              >
                Sign in
              </Link>
              <Link
                to="/auth/signup"
                className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:pt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Marketplace + AI styling
        </p>
        <h1 className="mt-4 max-w-3xl font-[Syne] text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Shop from real stores.
          <span className="block text-indigo-700">Discover looks with AI.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-stone-600">
          Styla is a dual-role marketplace: customers browse curated inventory,
          shop owners manage products, and AI recommends from your Supabase
          catalog — no external product APIs.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/auth/signup"
            className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Create account
          </Link>
          <Link
            to="/customer/ai"
            className="rounded-full border border-stone-300 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-800 hover:bg-white"
          >
            Try AI discover
          </Link>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Customer space',
              body: 'Browse Supabase products, wishlist, cart, and AI outfit help.',
            },
            {
              title: 'Shop dashboard',
              body: 'Owners manage inventory, images, and shop settings.',
            },
            {
              title: 'Secure by design',
              body: 'Supabase Auth + RLS so each role only touches their data.',
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur"
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {card.body}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
