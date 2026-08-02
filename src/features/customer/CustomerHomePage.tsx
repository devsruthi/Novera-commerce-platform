import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { listCategories, listFeaturedProducts } from '../../services/productService'
import { CatalogProductCard } from './components/CatalogProductCard'

/** Customer home — featured products + category shortcuts. */
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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-10 text-white shadow-lg shadow-indigo-900/20">
        <h1 className="font-[Syne] text-3xl font-extrabold tracking-tight md:text-4xl">
          Your shopping home
        </h1>
        <p className="mt-2 max-w-xl text-indigo-100">
          Browse shop inventory, save favorites, and fill your cart — all from
          Supabase. AI Discover ranks the same catalog.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/customer/shop"
            className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            Shop all
          </Link>
          <Link
            to="/customer/ai"
            className="inline-flex rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            AI Discover
          </Link>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Categories</h2>
          <Link
            to="/customer/categories"
            className="text-sm font-semibold text-indigo-600"
          >
            View all
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(categories.data ?? []).slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/customer/categories/${cat.slug || cat.name.toLowerCase()}`}
              className="shrink-0 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold hover:border-indigo-300"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Featured</h2>
          <p className="text-sm text-stone-500">From Supabase products</p>
        </div>

        {featured.isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-stone-200/80"
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

        {!featured.isLoading && !featured.error && (featured.data?.length ?? 0) === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
            <p className="font-semibold">No featured products yet</p>
            <p className="mt-1 text-sm text-stone-500">
              Mark products as featured, or{' '}
              <Link to="/customer/shop" className="font-semibold text-indigo-600">
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
    </main>
  )
}
