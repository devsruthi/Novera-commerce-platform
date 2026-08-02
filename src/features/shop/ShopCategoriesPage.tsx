import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { listCategories } from '../../services/productService'
import { getMyShop, listMyProducts } from '../../services/shopService'
import {
  createCategory,
  updateCategory,
  uploadCategoryImage,
} from '../../services/shopProductService'
import { shop } from './shopUi'

/** Shop-owner category management — visual grid matching Novera reference. */
export function ShopCategoriesPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [createImage, setCreateImage] = useState<string | null>(null)
  const [createFile, setCreateFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editImage, setEditImage] = useState<string | null>(null)
  const [editFile, setEditFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

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
    mutationFn: async () => {
      const shopId = shopQuery.data?.id
      if (!shopId) throw new Error('Shop not found for this account.')

      const created = await createCategory({
        name,
        slug: slug || undefined,
        image: createImage,
      })

      if (createFile) {
        setUploading(true)
        try {
          const url = await uploadCategoryImage(shopId, created.id, createFile)
          return updateCategory(created.id, {
            name: created.name,
            image: url,
          })
        } finally {
          setUploading(false)
        }
      }

      return created
    },
    onSuccess: async () => {
      setName('')
      setSlug('')
      setCreateImage(null)
      setCreateFile(null)
      setError('')
      setShowForm(false)
      await qc.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const saveEdit = useMutation({
    mutationFn: async () => {
      const shopId = shopQuery.data?.id
      if (!shopId || !editingId) {
        throw new Error('Shop not found for this account.')
      }

      let imageUrl = editImage
      if (editFile) {
        setUploading(true)
        try {
          imageUrl = await uploadCategoryImage(shopId, editingId, editFile)
        } finally {
          setUploading(false)
        }
      }

      return updateCategory(editingId, {
        name: editName,
        image: imageUrl,
      })
    },
    onSuccess: async () => {
      setEditingId(null)
      setEditName('')
      setEditImage(null)
      setEditFile(null)
      setError('')
      await qc.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const onCreate = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    create.mutate()
  }

  const startEdit = (cat: { id: string; name: string; image: string | null }) => {
    setError('')
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditImage(cat.image)
    setEditFile(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditImage(null)
    setEditFile(null)
  }

  const categories = categoriesQuery.data ?? []
  const busy = create.isPending || saveEdit.isPending || uploading

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
          className={`${shop.card} grid gap-4 p-4 sm:grid-cols-[140px_1fr_1fr_auto] sm:items-end sm:p-5`}
        >
          <label className="block">
            <span className={shop.label}>Thumbnail</span>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
              {createImage ? (
                <img
                  src={createImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                  No image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setCreateFile(file)
                  setCreateImage(URL.createObjectURL(file))
                }}
              />
            </div>
          </label>
          <label className="block">
            <span className={shop.label}>Category name</span>
            <input
              className={shop.input}
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className={shop.label}>Slug (optional)</span>
            <input
              className={shop.input}
              placeholder="Slug (optional)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className={shop.btnPrimary}
          >
            {create.isPending || uploading ? 'Adding…' : 'Create'}
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
          const previewImage = editing ? editImage : cat.image
          return (
            <article
              key={cat.id}
              className={`${shop.card} group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-violet-100 via-slate-100 to-violet-50">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-xl font-bold text-violet-600 shadow-sm">
                      {(editing ? editName : cat.name)
                        .slice(0, 1)
                        .toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                {editing && (
                  <label className="absolute inset-x-3 bottom-3 cursor-pointer rounded-xl bg-white/95 px-3 py-2 text-center text-xs font-semibold text-violet-700 shadow-sm backdrop-blur transition hover:bg-violet-50">
                    {editImage ? 'Change image' : 'Upload image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={busy}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setEditFile(file)
                        setEditImage(URL.createObjectURL(file))
                      }}
                    />
                  </label>
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
                        placeholder="Category name"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={shop.btnPrimary}
                          disabled={busy || !editName.trim()}
                          onClick={() => saveEdit.mutate()}
                        >
                          {saveEdit.isPending || uploading ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          type="button"
                          className={shop.btnGhost}
                          disabled={busy}
                          onClick={cancelEdit}
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
                    title="Edit category"
                    onClick={() => startEdit(cat)}
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
