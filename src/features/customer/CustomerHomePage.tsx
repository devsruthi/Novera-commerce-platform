import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { listCategories, listFeaturedProducts } from '../../services/productService'
import { CatalogProductCard } from './components/CatalogProductCard'

/** Customer home — Novera hero, categories, featured products. */
export function CustomerHomePage() {
  const featured = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => listFeaturedProducts(8),
  })
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
  })

  return (
    <main className="relative overflow-hidden text-slate-900">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(92vh,720px)]"
        style={{
          background:
            'linear-gradient(135deg, #efe8ff 0%, #f7f3ff 38%, #ffffff 68%, #f3eeff 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-[360px] w-[360px] rounded-full bg-violet-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[10%] top-[280px] h-[220px] w-[320px] rounded-full bg-fuchsia-200/20 blur-3xl"
      />

      {/* Hero — brand, headline, one line, CTAs, full-bleed visual */}
      <section className="relative mx-auto grid min-h-[min(78vh,640px)] max-w-[1400px] items-center gap-8 px-3 pb-10 pt-8 sm:px-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6 lg:pb-14 lg:pt-6">
        <div className="relative z-10 max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2.5">
            <img
              src="/novera-icon.png"
              alt=""
              className="h-10 w-10 rounded-[12px] object-cover shadow-md shadow-violet-400/30"
            />
            <span className="text-2xl font-extrabold tracking-tight text-violet-700">
              NOVERA
            </span>
          </div>

          <h1 className="text-[2.35rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            <span className="login-headline-line block text-slate-900">
              Shop what you love.
            </span>
            <span className="login-headline-accent mt-1 block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
              Find it faster.
            </span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-500">
            Browse curated fashion, save favorites, and check out in a few taps.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/customer/shop"
              className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold !text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700"
            >
              Shop all
            </Link>
            <Link
              to="/customer/categories"
              className="inline-flex items-center justify-center rounded-xl border border-violet-200 bg-white/80 px-6 py-3 text-sm font-semibold text-violet-700 shadow-sm backdrop-blur transition hover:border-violet-300 hover:bg-white"
            >
              Browse categories
            </Link>
          </div>
        </div>

        <div className="relative z-0 mx-auto w-full max-w-[480px] lg:max-w-none">
          <div
            aria-hidden
            className="absolute inset-x-8 bottom-4 h-24 rounded-full bg-violet-400/30 blur-3xl"
          />
          <img
            src="/auth/login-hero.jpg"
            alt=""
            className="home-hero-image relative mx-auto h-[min(58vh,520px)] w-auto max-w-full object-cover object-top lg:h-[min(64vh,560px)]"
            style={{
              maskImage: [
                'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                'linear-gradient(to bottom, transparent 0%, black 8%, black 72%, transparent 100%)',
              ].join(', '),
              WebkitMaskImage: [
                'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                'linear-gradient(to bottom, transparent 0%, black 8%, black 72%, transparent 100%)',
              ].join(', '),
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          />
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1400px] px-3 pb-14 sm:px-4">
        {/* Categories */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Categories
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Jump into a collection that matches your style.
              </p>
            </div>
            <Link
              to="/customer/categories"
              className="shrink-0 text-sm font-semibold text-violet-600 hover:text-violet-800"
            >
              View all
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {(categories.data ?? []).slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={`/customer/categories/${cat.slug || cat.name.toLowerCase()}`}
                className="shrink-0 rounded-xl border border-violet-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm shadow-violet-100/60 transition hover:border-violet-300 hover:text-violet-700 hover:shadow-md hover:shadow-violet-200/50"
              >
                {cat.name}
              </Link>
            ))}
            {!categories.isLoading && (categories.data?.length ?? 0) === 0 && (
              <p className="text-sm text-slate-500">No categories yet.</p>
            )}
          </div>
        </section>

        {/* Featured */}
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Featured
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Picks worth opening first.
              </p>
            </div>
            <Link
              to="/customer/shop"
              className="shrink-0 text-sm font-semibold text-violet-600 hover:text-violet-800"
            >
              Browse shop
            </Link>
          </div>

          {featured.isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl bg-violet-100/70"
                />
              ))}
            </div>
          )}

          {featured.error && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {(featured.error as Error).message}. Run Phase 1 + 2 SQL, then add
              products as a shop owner.
            </p>
          )}

          {!featured.isLoading &&
            !featured.error &&
            (featured.data?.length ?? 0) === 0 && (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-white/80 px-6 py-14 text-center">
                <p className="font-semibold text-slate-800">No featured products yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Mark products as featured, or{' '}
                  <Link
                    to="/customer/shop"
                    className="font-semibold text-violet-600 hover:text-violet-800"
                  >
                    browse the full shop
                  </Link>
                  .
                </p>
              </div>
            )}

          {(featured.data?.length ?? 0) > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.data!.map((p) => (
                <CatalogProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
