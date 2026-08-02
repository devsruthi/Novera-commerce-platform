import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { listCategories } from '../../services/productService'
import { getMyShop } from '../../services/shopService'
import {
  createProduct,
  getMyProduct,
  updateProduct,
  uploadProductImages,
} from '../../services/shopProductService'
import {
  ProductForm,
  toProductInput,
  valuesFromProduct,
  type ProductFormValues,
} from './components/ProductForm'

/** Add or edit a shop product with Storage image uploads. */
export function ShopProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { user } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [error, setError] = useState('')

  const shopQuery = useQuery({
    queryKey: ['my-shop', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => getMyShop(user!.id),
  })

  const productQuery = useQuery({
    queryKey: ['my-product', shopQuery.data?.id, id],
    enabled: Boolean(isEdit && shopQuery.data?.id && id),
    queryFn: () => getMyProduct(shopQuery.data!.id, id!),
  })

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: listCategories,
  })

  const initial = useMemo(
    () => valuesFromProduct(productQuery.data),
    [productQuery.data],
  )

  const save = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const shopId = shopQuery.data?.id
      if (!shopId) throw new Error('Shop not found for this account.')
      const input = toProductInput(shopId, values)
      if (!input.title || Number.isNaN(input.price)) {
        throw new Error('Title and a valid price are required.')
      }
      if (isEdit && id) {
        return updateProduct(id, input)
      }
      return createProduct(input)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['my-products'] })
      await qc.invalidateQueries({ queryKey: ['shop-stats'] })
      navigate('/shop/products')
    },
    onError: (err: Error) => setError(err.message),
  })

  if (shopQuery.isLoading || (isEdit && productQuery.isLoading)) {
    return (
      <main className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-stone-500">Loading…</p>
      </main>
    )
  }

  if (!shopQuery.data) {
    return (
      <main className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        No shop found. Sign up as a shop owner or create a shop row in Supabase.
      </main>
    )
  }

  if (isEdit && !productQuery.data) {
    return (
      <main className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="font-semibold">Product not found</p>
        <Link to="/shop/products" className="mt-2 inline-block text-indigo-600">
          Back to products
        </Link>
      </main>
    )
  }

  return (
    <main className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-[Syne] text-2xl font-extrabold">
            {isEdit ? 'Edit product' : 'Add product'}
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Images upload to Supabase Storage (`product-images`).
          </p>
        </div>
        <Link
          to="/shop/products"
          className="text-sm font-semibold text-stone-500 hover:text-stone-800"
        >
          Cancel
        </Link>
      </div>

      <ProductForm
        key={productQuery.data?.id ?? 'new'}
        initial={initial}
        categories={categoriesQuery.data ?? []}
        busy={save.isPending}
        error={error}
        onSubmit={(values) => {
          setError('')
          save.mutate(values)
        }}
        onUploadFiles={async (files) => {
          const key = id ?? `draft-${crypto.randomUUID()}`
          return uploadProductImages(shopQuery.data!.id, key, [...files])
        }}
      />
    </main>
  )
}
