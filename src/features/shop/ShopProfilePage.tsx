import { useEffect, useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { updateMyProfile, uploadAvatar } from '../../services/shopService'

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
    <main className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="font-[Syne] text-2xl font-extrabold">Your profile</h1>
      <p className="mt-1 text-sm text-stone-500">
        Personal account details for the shop owner.
      </p>

      <form className="mt-6 max-w-lg space-y-4" onSubmit={onSubmit}>
        <div>
          <p className="mb-2 text-sm font-medium">Avatar</p>
          <div className="mb-2 flex items-center gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-stone-100">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={!user || uploading}
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

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Name</span>
          <input
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Email</span>
          <input
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2"
            value={user?.email ?? ''}
            disabled
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Phone</span>
          <input
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={phone ?? ''}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        {message && <p className="text-sm text-stone-600">{message}</p>}

        <button
          type="submit"
          disabled={save.isPending || !user}
          className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {save.isPending ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </main>
  )
}
