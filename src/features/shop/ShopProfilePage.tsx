import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { updateMyProfile, uploadAvatar } from '../../services/shopService'
import { shop } from './shopUi'

/** Shop owner personal profile (name, phone, avatar). */
export function ShopProfilePage() {
  const { user } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [avatar, setAvatar] = useState(user?.avatar ?? null)
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState<'ok' | 'err'>('ok')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    setName(user?.name ?? '')
    setPhone(user?.phone ?? '')
    setAvatar(user?.avatar ?? null)
  }, [user])

  const save = useMutation({
    mutationFn: () =>
      updateMyProfile(user!.id, {
        name: name.trim(),
        phone: phone.trim() || null,
        avatar,
      }),
    onSuccess: () => {
      setMessageTone('ok')
      setMessage('Profile saved successfully.')
    },
    onError: (err: Error) => {
      setMessageTone('err')
      setMessage(err.message)
    },
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setMessage('')
    save.mutate()
  }

  const onPickAvatar = (file: File) => {
    if (!user) return
    setUploading(true)
    setMessage('')
    void uploadAvatar(user.id, file)
      .then((url) => {
        setAvatar(url)
        setMessageTone('ok')
        setMessage('Avatar uploaded — click Save to keep it.')
      })
      .catch((err: Error) => {
        setMessageTone('err')
        setMessage(err.message)
      })
      .finally(() => setUploading(false))
  }

  const initials = (name?.trim()?.[0] || user?.email?.[0] || 'O').toUpperCase()

  return (
    <div className={shop.page}>
      <header>
        <h1 className={shop.title}>Profile</h1>
        <p className={shop.subtitle}>
          Personal account details for the shop owner.
        </p>
      </header>

      <form
        className={`${shop.card} max-w-3xl overflow-hidden`}
        onSubmit={onSubmit}
      >
        <div className="border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-slate-50 px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-violet-100 ring-4 ring-white shadow-md shadow-violet-200/50">
                {avatar ? (
                  <img
                    src={avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-violet-700">
                    {initials}
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={!user || uploading}
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 !text-white shadow-md shadow-violet-600/30 transition hover:bg-violet-700 disabled:opacity-60"
                title="Change avatar"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={!user || uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onPickAvatar(file)
                  e.target.value = ''
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-xl font-bold text-slate-900">
                  {name.trim() || 'Your name'}
                </h2>
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                  Shop Owner
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-slate-500">
                {user?.email || '—'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!user || uploading}
                  onClick={() => fileRef.current?.click()}
                  className={shop.btnSecondary}
                >
                  {uploading ? 'Uploading…' : 'Upload photo'}
                </button>
                {avatar && (
                  <button
                    type="button"
                    disabled={uploading}
                    className={shop.btnGhost}
                    onClick={() => {
                      setAvatar(null)
                      setMessageTone('ok')
                      setMessage('Avatar removed — click Save to keep changes.')
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                PNG or JPG, up to 5MB.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={shop.label}>Full name</span>
              <input
                className={shop.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </label>

            <label className="block sm:col-span-2">
              <span className={shop.label}>Email</span>
              <input
                className={`${shop.input} cursor-not-allowed bg-slate-50 text-slate-500`}
                value={user?.email ?? ''}
                disabled
              />
              <span className="mt-1.5 block text-xs text-slate-400">
                Email is managed by your account and can’t be changed here.
              </span>
            </label>

            <label className="block sm:col-span-2">
              <span className={shop.label}>Phone</span>
              <input
                className={shop.input}
                value={phone ?? ''}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                inputMode="tel"
              />
            </label>
          </div>

          {message && (
            <p
              className={`rounded-xl px-3.5 py-2.5 text-sm font-medium ${
                messageTone === 'err'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={save.isPending || !user || uploading}
              className={shop.btnPrimary}
            >
              {save.isPending ? 'Saving…' : 'Save profile'}
            </button>
            <p className="text-xs text-slate-400">
              Changes apply after you save.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
