import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { listCategories } from '../../services/productService'
import { getMyShop, listMyProducts } from '../../services/shopService'
import {
  createCategory,
  updateCategory,
} from '../../services/shopProductService'
import { shop } from './shopUi'

/** Shop-owner category management — visual grid matching Novera reference. */
export function ShopCategoriesPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const shopQuery = useQuery({
    queryKey: ['my-shop', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => getMyShop(user!.id),
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
  })

  const productsQuery = useQuery({
    queryKey: ['my-products', shopQuery.data?.id],
    enabled: Boolean(shopQuery.data?.id),
    queryFn: () => listMyProducts(shopQuery.data!.id),
  })

  const productCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of productsQuery.data ?? []) {
      if (!p.category_id) continue
      map.set(p.category_id, (map.get(p.category_id) ?? 0) + 1)
    }
    return map
  }, [productsQuery.data])

  const create = useMutation({
    mutationFn: () => createCategory({ name, slug: slug || undefined }),
    onSuccess: async () => {
      setName('')
      setSlug('')
      setError('')
      setShowForm(false)
      await qc.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const saveEdit = useMutation({
    mutationFn: () => updateCategory(editingId!, { name: editName }),
    onSuccess: async () => {
      setEditingId(null)
      await qc.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const onCreate = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    create.mutate()
  }

  const categories = categoriesQuery.data ?? []

  return (
    <div className={shop.page}>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={shop.title}>Categories</h1>
          <p className={shop.subtitle}>
            Organize products into shoppable groups.
          </p>
        </div>
        <button
          type="button"
          className={shop.btnPrimary}
          onClick={() => setShowForm((v) => !v)}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Category
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={onCreate}
          className={`${shop.card} grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:p-5`}
        >
          <input
            className={shop.input}
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className={shop.input}
            placeholder="Slug (optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <button
            type="submit"
            disabled={create.isPending}
            className={shop.btnPrimary}
          >
            {create.isPending ? 'Adding…' : 'Create'}
          </button>
        </form>
      )}

      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      {categoriesQuery.isLoading && (
        <p className="text-sm text-slate-500">Loading categories…</p>
      )}

      {!categoriesQuery.isLoading && categories.length === 0 && (
        <div className={`${shop.card} px-5 py-14 text-center text-sm text-slate-500`}>
          No categories yet. Add your first category to organize products.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((cat) => {
          const count = productCounts.get(cat.id) ?? 0
          const editing = editingId === cat.id
          return (
            <article
              key={cat.id}
              className={`${shop.card} group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-violet-100 via-slate-100 to-violet-50">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-xl font-bold text-violet-600 shadow-sm">
                      {cat.name.slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between gap-2 p-4">
                <div className="min-w-0 flex-1">
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        className={shop.input}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={shop.btnPrimary}
                          onClick={() => saveEdit.mutate()}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className={shop.btnGhost}
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="truncate font-semibold text-slate-900">
                        {cat.name}
                      </h2>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {count} {count === 1 ? 'product' : 'products'}
                      </p>
                    </>
                  )}
                </div>
                {!editing && (
                  <button
                    type="button"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-700"
                    title="Rename"
                    onClick={() => {
                      setEditingId(cat.id)
                      setEditName(cat.name)
                    }}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
