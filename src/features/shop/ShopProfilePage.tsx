import { useEffect, useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { updateMyProfile, uploadAvatar } from '../../services/shopService'
import { shop } from './shopUi'

/** Shop owner personal profile (name, phone, avatar). */
export function ShopProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [avatar, setAvatar] = useState(user?.avatar ?? null)
  const [message, setMessage] = useState('')
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
    onSuccess: () =>
      setMessage('Profile saved. Refresh or sign in again to update the header.'),
    onError: (err: Error) => setMessage(err.message),
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!user) return
    setMessage('')
    save.mutate()
  }

  return (
    <div className={shop.page}>
      <header>
        <h1 className={shop.title}>Profile</h1>
        <p className={shop.subtitle}>
          Personal account details for the shop owner.
        </p>
      </header>

      <form
        className={`${shop.card} max-w-2xl space-y-5 p-5 sm:p-6`}
        onSubmit={onSubmit}
      >
        <div>
          <p className={shop.label}>Avatar</p>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-violet-100">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-violet-700">
                  {(name?.[0] || 'O').toUpperCase()}
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={!user || uploading}
              className="text-sm text-slate-600"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file || !user) return
                setUploading(true)
                void uploadAvatar(user.id, file)
                  .then((url) => {
                    setAvatar(url)
                    setMessage('Avatar uploaded — save to keep it.')
                  })
                  .catch((err: Error) => setMessage(err.message))
                  .finally(() => setUploading(false))
              }}
            />
          </div>
        </div>

        <label className="block">
          <span className={shop.label}>Name</span>
          <input
            className={shop.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className={shop.label}>Email</span>
          <input
            className={`${shop.input} bg-slate-50`}
            value={user?.email ?? ''}
            disabled
          />
        </label>
        <label className="block">
          <span className={shop.label}>Phone</span>
          <input
            className={shop.input}
            value={phone ?? ''}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        {message && <p className="text-sm text-slate-600">{message}</p>}

        <button
          type="submit"
          disabled={save.isPending || !user}
          className={shop.btnPrimary}
        >
          {save.isPending ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}
