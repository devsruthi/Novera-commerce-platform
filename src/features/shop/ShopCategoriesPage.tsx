import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listCategories } from '../../services/productService'
import {
  createCategory,
  updateCategory,
} from '../../services/shopProductService'

/** Shop-owner category management (create / rename). */
export function ShopCategoriesPage() {
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
  })

  const create = useMutation({
    mutationFn: () => createCategory({ name, slug: slug || undefined }),
    onSuccess: async () => {
      setName('')
      setSlug('')
      setError('')
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

  return (
    <main className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="font-[Syne] text-2xl font-extrabold">Categories</h1>
      <p className="mt-1 text-sm text-stone-500">
        Create or rename categories used when publishing products.
      </p>

      <form
        onSubmit={onCreate}
        className="mt-6 grid gap-3 rounded-2xl bg-stone-50 p-4 sm:grid-cols-[1fr_1fr_auto]"
      >
        <input
          className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
          placeholder="Slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {create.isPending ? 'Adding…' : 'Add'}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <ul className="mt-6 divide-y divide-stone-100">
        {(categoriesQuery.data ?? []).map((cat) => (
          <li key={cat.id} className="flex flex-wrap items-center gap-3 py-3">
            {editingId === cat.id ? (
              <>
                <input
                  className="min-w-0 flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button
                  type="button"
                  className="rounded-full bg-stone-900 px-3 py-1.5 text-sm font-semibold text-white"
                  onClick={() => saveEdit.mutate()}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-stone-500"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-xs text-stone-500">{cat.slug}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-stone-200 px-3 py-1.5 text-sm font-semibold"
                  onClick={() => {
                    setEditingId(cat.id)
                    setEditName(cat.name)
                  }}
                >
                  Rename
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
