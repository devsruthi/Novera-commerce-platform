import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import {
  getMyShop,
  updateMyShop,
  uploadShopLogo,
} from '../../services/shopService'

/** Shop settings including logo upload to Storage. */
export function ShopSettingsPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const shopQuery = useQuery({
    queryKey: ['my-shop', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => getMyShop(user!.id),
  })

  const [shopName, setShopName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [logo, setLogo] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!shopQuery.data) return
    setShopName(shopQuery.data.shop_name)
    setDescription(shopQuery.data.description)
    setAddress(shopQuery.data.address ?? '')
    setLogo(shopQuery.data.logo)
  }, [shopQuery.data])

  const save = useMutation({
    mutationFn: () =>
      updateMyShop(user!.id, {
        shop_name: shopName.trim(),
        description: description.trim(),
        address: address.trim() || null,
        logo,
      }),
    onSuccess: () => {
      setMessage('Shop updated.')
      void qc.invalidateQueries({ queryKey: ['my-shop', user?.id] })
    },
    onError: (err: Error) => setMessage(err.message),
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    save.mutate()
  }

  return (
    <main className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="font-[Syne] text-2xl font-extrabold">Shop settings</h1>
      <p className="mt-1 text-sm text-stone-500">
        Update the public details for your storefront.
      </p>

      <form className="mt-6 max-w-lg space-y-4" onSubmit={onSubmit}>
        <div>
          <p className="mb-2 text-sm font-medium">Logo</p>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-stone-100">
              {logo ? (
                <img src={logo} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={!shopQuery.data || uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file || !shopQuery.data) return
                setUploading(true)
                setMessage('')
                void uploadShopLogo(shopQuery.data.id, file)
                  .then((url) => {
                    setLogo(url)
                    setMessage('Logo uploaded — save to keep it.')
                  })
                  .catch((err: Error) => setMessage(err.message))
                  .finally(() => setUploading(false))
              }}
            />
          </div>
          {uploading && (
            <p className="text-xs text-stone-500">Uploading logo…</p>
          )}
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Shop name</span>
          <input
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Description</span>
          <textarea
            className="min-h-28 w-full rounded-xl border border-stone-200 px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Address</span>
          <input
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        {message && <p className="text-sm text-stone-600">{message}</p>}
        <button
          type="submit"
          disabled={save.isPending || !user}
          className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {save.isPending ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </main>
  )
}
