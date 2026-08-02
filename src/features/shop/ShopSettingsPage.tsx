import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import {
  getMyShop,
  updateMyShop,
  uploadShopLogo,
} from '../../services/shopService'
import { shop } from './shopUi'

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
    <div className={shop.page}>
      <header>
        <h1 className={shop.title}>Store Settings</h1>
        <p className={shop.subtitle}>
          Update the public details for your storefront.
        </p>
      </header>

      <form
        className={`${shop.card} max-w-2xl space-y-5 p-5 sm:p-6`}
        onSubmit={onSubmit}
      >
        <div>
          <p className={shop.label}>Logo</p>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
              {logo ? (
                <img src={logo} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={!shopQuery.data || uploading}
              className="text-sm text-slate-600"
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
            <p className="mt-2 text-xs text-violet-600">Uploading logo…</p>
          )}
        </div>

        <label className="block">
          <span className={shop.label}>Shop name</span>
          <input
            className={shop.input}
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className={shop.label}>Description</span>
          <textarea
            className={`${shop.input} min-h-28 resize-y`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="block">
          <span className={shop.label}>Address</span>
          <input
            className={shop.input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        {message && <p className="text-sm text-slate-600">{message}</p>}
        <button
          type="submit"
          disabled={save.isPending || !user}
          className={shop.btnPrimary}
        >
          {save.isPending ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
