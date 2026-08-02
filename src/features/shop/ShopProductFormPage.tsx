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
import { shop } from './shopUi'

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
      <div className={shop.cardPad}>
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    )
  }

  if (!shopQuery.data) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        No shop found. Sign up as a shop owner or create a shop row in Supabase.
      </div>
    )
  }

  if (isEdit && !productQuery.data) {
    return (
      <div className={shop.cardPad}>
        <p className="font-semibold text-slate-900">Product not found</p>
        <Link
          to="/shop/products"
          className="mt-2 inline-block text-sm font-semibold text-violet-600"
        >
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className={shop.page}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className={shop.title}>
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className={shop.subtitle}>
            Fill in details and publish to your storefront.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/shop/products" className={shop.btnSecondary}>
            Cancel
          </Link>
          <button
            type="submit"
            form="product-form"
            disabled={save.isPending}
            className={shop.btnPrimary}
          >
            {save.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish'}
          </button>
        </div>
      </header>

      <ProductForm
        key={productQuery.data?.id ?? 'new'}
        initial={initial}
        categories={categoriesQuery.data ?? []}
        busy={save.isPending}
        error={error}
        submitLabel={isEdit ? 'Save Changes' : 'Publish'}
        onSubmit={(values) => {
          setError('')
          save.mutate(values)
        }}
        onUploadFiles={async (files) => {
          const key = id ?? `draft-${crypto.randomUUID()}`
          return uploadProductImages(shopQuery.data!.id, key, [...files])
        }}
      />
    </div>
  )
}
