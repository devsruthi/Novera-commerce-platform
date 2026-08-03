import { useState, type FormEvent } from 'react'
import type { DbCategory, DbProduct } from '../../../types/database'
import type { ProductInput } from '../../../services/shopProductService'
import { shop } from '../shopUi'

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export interface ProductFormValues {
  title: string
  description: string
  price: string
  discount_price: string
  stock: string
  brand: string
  category_id: string
  colors: string
  sizes: string
  tags: string
  featured: boolean
  images: string[]
}

export function valuesFromProduct(product?: DbProduct | null): ProductFormValues {
  return {
    title: product?.title ?? '',
    description: product?.description ?? '',
    price: product ? String(product.price) : '',
    discount_price:
      product?.discount_price != null ? String(product.discount_price) : '',
    stock: product ? String(product.stock) : '0',
    brand: product?.brand ?? '',
    category_id: product?.category_id ?? '',
    colors: (product?.colors ?? []).join(', '),
    sizes: (product?.sizes ?? []).join(', '),
    tags: (product?.tags ?? []).join(', '),
    featured: product?.featured ?? false,
    images: product?.images ?? [],
  }
}

export function toProductInput(
  shopId: string,
  values: ProductFormValues,
): ProductInput {
  const price = Number(values.price)
  const discount = values.discount_price.trim()
    ? Number(values.discount_price)
    : null
  return {
    shop_id: shopId,
    category_id: values.category_id || null,
    title: values.title.trim(),
    description: values.description.trim(),
    price,
    discount_price: discount != null && !Number.isNaN(discount) ? discount : null,
    stock: Math.max(0, Math.floor(Number(values.stock) || 0)),
    brand: values.brand.trim(),
    images: values.images,
    colors: splitList(values.colors).map((c) => c.toLowerCase()),
    sizes: splitList(values.sizes),
    tags: splitList(values.tags).map((t) => t.toLowerCase()),
    featured: values.featured,
  }
}

/** Shared add/edit form for shop products — two-column Novera layout. */
export function ProductForm({
  initial,
  categories,
  busy,
  error,
  submitLabel = 'Publish',
  onSubmit,
  onUploadFiles,
}: {
  initial: ProductFormValues
  categories: DbCategory[]
  busy: boolean
  error?: string
  submitLabel?: string
  onSubmit: (values: ProductFormValues) => void
  onUploadFiles: (files: FileList) => Promise<string[]>
}) {
  const [values, setValues] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const set = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  const upload = async (files: FileList) => {
    if (!files.length) return
    setUploading(true)
    try {
      const urls = await onUploadFiles(files)
      setValues((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
    } finally {
      setUploading(false)
    }
  }

  return (
    <form id="product-form" className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-6">
          <section className={`${shop.card} p-5 sm:p-6`}>
            <h2 className={shop.sectionTitle}>Basic Information</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className={shop.label}>Product Name</span>
                <input
                  className={shop.input}
                  value={values.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. Classic Leather Sneakers"
                  required
                />
              </label>
              <label className="block">
                <span className={shop.label}>Description</span>
                <textarea
                  className={`${shop.input} min-h-32 resize-y`}
                  value={values.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe materials, fit, and key details…"
                />
              </label>
              <label className="block">
                <span className={shop.label}>Category</span>
                <select
                  className={shop.input}
                  value={values.category_id}
                  onChange={(e) => set('category_id', e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className={`${shop.card} p-5 sm:p-6`}>
            <h2 className={shop.sectionTitle}>Pricing & Stock</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={shop.label}>Price (€)</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={shop.input}
                  value={values.price}
                  onChange={(e) => set('price', e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className={shop.label}>Discount Price (€)</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={shop.input}
                  value={values.discount_price}
                  onChange={(e) => set('discount_price', e.target.value)}
                />
              </label>
              <label className="block">
                <span className={shop.label}>Stock</span>
                <input
                  type="number"
                  min={0}
                  className={shop.input}
                  value={values.stock}
                  onChange={(e) => set('stock', e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className={shop.label}>Brand / SKU</span>
                <input
                  className={shop.input}
                  value={values.brand}
                  onChange={(e) => set('brand', e.target.value)}
                  placeholder="Brand or SKU code"
                />
              </label>
            </div>
          </section>

          <section className={`${shop.card} p-5 sm:p-6`}>
            <h2 className={shop.sectionTitle}>Variants & Visibility</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className={shop.label}>Colors (comma-separated)</span>
                <input
                  className={shop.input}
                  value={values.colors}
                  onChange={(e) => set('colors', e.target.value)}
                  placeholder="black, beige, navy"
                />
              </label>
              <label className="block">
                <span className={shop.label}>Sizes (comma-separated)</span>
                <input
                  className={shop.input}
                  value={values.sizes}
                  onChange={(e) => set('sizes', e.target.value)}
                  placeholder="XS, S, M, L"
                />
              </label>
              <label className="block">
                <span className={shop.label}>Tags (comma-separated)</span>
                <input
                  className={shop.input}
                  value={values.tags}
                  onChange={(e) => set('tags', e.target.value)}
                  placeholder="casual, travel, knit"
                />
              </label>
              <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  checked={values.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                />
                Featured on customer home
              </label>
            </div>
          </section>
        </div>

        <section className={`${shop.card} h-fit p-5 sm:p-6`}>
          <h2 className={shop.sectionTitle}>Product Images</h2>
          <p className="mt-1 text-sm text-slate-500">
            Drag and drop or browse to upload product photos.
          </p>

          <label
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
              dragOver
                ? 'border-violet-400 bg-violet-50'
                : 'border-slate-200 bg-slate-50/60 hover:border-violet-300 hover:bg-violet-50/40'
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              if (e.dataTransfer.files?.length) {
                void upload(e.dataTransfer.files)
              }
            }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 16V6M8 10l4-4 4 4" />
                <path d="M4 18h16" />
              </svg>
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Drop images here
            </p>
            <p className="mt-1 text-xs text-slate-500">PNG, JPG up to 5MB</p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={uploading || busy}
              onChange={(e) => {
                if (e.target.files?.length) void upload(e.target.files)
              }}
            />
          </label>

          {uploading && (
            <p className="mt-3 text-xs font-medium text-violet-600">
              Uploading images…
            </p>
          )}

          {values.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {values.images.map((url) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-xs text-white transition hover:bg-rose-600"
                    onClick={() =>
                      set(
                        'images',
                        values.images.filter((img) => img !== url),
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 xl:hidden">
        <button
          type="submit"
          disabled={busy || uploading}
          className={shop.btnPrimary}
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
