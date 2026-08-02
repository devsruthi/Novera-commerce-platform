import { useState, type FormEvent } from 'react'
import type { DbCategory, DbProduct } from '../../../types/database'
import type { ProductInput } from '../../../services/shopProductService'

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

/** Shared add/edit form for shop products. */
export function ProductForm({
  initial,
  categories,
  busy,
  error,
  onSubmit,
  onUploadFiles,
}: {
  initial: ProductFormValues
  categories: DbCategory[]
  busy: boolean
  error?: string
  onSubmit: (values: ProductFormValues) => void
  onUploadFiles: (files: FileList) => Promise<string[]>
}) {
  const [values, setValues] = useState(initial)
  const [uploading, setUploading] = useState(false)

  const set = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Title</span>
        <input
          className="w-full rounded-xl border border-stone-200 px-3 py-2"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          required
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Description</span>
        <textarea
          className="min-h-28 w-full rounded-xl border border-stone-200 px-3 py-2"
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Price (€)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={values.price}
            onChange={(e) => set('price', e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Discount price</span>
          <input
            type="number"
            min={0}
            step="0.01"
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={values.discount_price}
            onChange={(e) => set('discount_price', e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Stock</span>
          <input
            type="number"
            min={0}
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={values.stock}
            onChange={(e) => set('stock', e.target.value)}
            required
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Brand</span>
          <input
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={values.brand}
            onChange={(e) => set('brand', e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Category</span>
          <select
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={values.category_id}
            onChange={(e) => set('category_id', e.target.value)}
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Colors (comma-separated)</span>
        <input
          className="w-full rounded-xl border border-stone-200 px-3 py-2"
          value={values.colors}
          onChange={(e) => set('colors', e.target.value)}
          placeholder="black, beige, navy"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Sizes (comma-separated)</span>
        <input
          className="w-full rounded-xl border border-stone-200 px-3 py-2"
          value={values.sizes}
          onChange={(e) => set('sizes', e.target.value)}
          placeholder="XS, S, M, L"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Tags (comma-separated)</span>
        <input
          className="w-full rounded-xl border border-stone-200 px-3 py-2"
          value={values.tags}
          onChange={(e) => set('tags', e.target.value)}
          placeholder="casual, travel, knit"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(e) => set('featured', e.target.checked)}
        />
        Featured on customer home
      </label>

      <div>
        <p className="mb-2 text-sm font-medium">Images</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {values.images.map((url) => (
            <div key={url} className="relative h-20 w-16 overflow-hidden rounded-lg bg-stone-100">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute right-0.5 top-0.5 rounded bg-black/60 px-1 text-[10px] text-white"
                onClick={() =>
                  set(
                    'images',
                    values.images.filter((img) => img !== url),
                  )
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading || busy}
          onChange={(e) => {
            const files = e.target.files
            if (!files?.length) return
            setUploading(true)
            void onUploadFiles(files)
              .then((urls) => set('images', [...values.images, ...urls]))
              .finally(() => setUploading(false))
          }}
        />
        {uploading && (
          <p className="mt-1 text-xs text-stone-500">Uploading images…</p>
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || uploading}
        className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? 'Saving…' : 'Save product'}
      </button>
    </form>
  )
}
