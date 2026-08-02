import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { listCategories } from '../../services/productService'

/** Category directory for customer browse. */
export function CategoriesPage() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
  })

  return (
    <main className="mx-auto max-w-[1400px] px-3 py-6 sm:px-4">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Categories
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Jump into a department and refine from there.
      </p>

      {isLoading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-stone-200" />
          ))}
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {(error as Error).message}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((cat) => {
          const slug = cat.slug || cat.name.toLowerCase()
          return (
            <Link
              key={cat.id}
              to={`/customer/categories/${slug}`}
              className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-[5/3] bg-gradient-to-br from-indigo-50 to-stone-100">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <h2 className="font-semibold">{cat.name}</h2>
                <p className="text-xs text-stone-500">Shop {cat.name.toLowerCase()}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
