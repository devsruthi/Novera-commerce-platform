import { useEffect, useRef, useState, type FormEvent } from 'react'
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
  const fileRef = useRef<HTMLInputElement>(null)
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

  const onPickLogo = (file: File) => {
    if (!shopQuery.data) return
    setUploading(true)
    setMessage('')
    void uploadShopLogo(shopQuery.data.id, file)
      .then((url) => {
        setLogo(url)
        setMessage('Logo uploaded — save to keep it.')
        qc.setQueryData(['my-shop', user?.id], (prev: typeof shopQuery.data) =>
          prev ? { ...prev, logo: url } : prev,
        )
      })
      .catch((err: Error) => setMessage(err.message))
      .finally(() => setUploading(false))
  }

  const canUpload = Boolean(shopQuery.data) && !uploading

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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-slate-50 shadow-sm">
              {logo ? (
                <img src={logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-violet-400">
                  <StoreIcon />
                  <span className="text-[10px] font-semibold uppercase tracking-wide">
                    No logo
                  </span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 grid place-items-center bg-white/75 text-xs font-semibold text-violet-700">
                  Uploading…
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <button
                type="button"
                disabled={!canUpload}
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 px-4 py-3 text-left transition hover:border-violet-300 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-md"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
                  <UploadIcon />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-800">
                    {logo ? 'Replace logo' : 'Upload logo'}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    PNG, JPG, or WebP · up to a few MB
                  </span>
                </span>
              </button>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!canUpload}
                  onClick={() => fileRef.current?.click()}
                  className="text-sm font-semibold text-violet-700 hover:text-violet-900 disabled:opacity-50"
                >
                  {logo ? 'Change image' : 'Browse files'}
                </button>
                {logo && (
                  <>
                    <span className="text-slate-300" aria-hidden>
                      ·
                    </span>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => {
                        setLogo(null)
                        setMessage('Logo cleared — save to keep it.')
                        if (fileRef.current) fileRef.current.value = ''
                        qc.setQueryData(
                          ['my-shop', user?.id],
                          (prev: typeof shopQuery.data) =>
                            prev ? { ...prev, logo: null } : prev,
                        )
                      }}
                      className="text-sm font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={!canUpload}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onPickLogo(file)
                  e.target.value = ''
                }}
              />
            </div>
          </div>
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

function UploadIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 16V5M8 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 9h16l-1.2 10.2A2 2 0 0 1 16.8 21H7.2a2 2 0 0 1-2-1.8L4 9z" />
      <path d="M8 9V7a4 4 0 0 1 8 0v2" />
    </svg>
  )
}
