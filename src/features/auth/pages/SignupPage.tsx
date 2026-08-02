import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { homePathForRole } from '../../../services/authService'
import type { UserRole } from '../../../types'
import {
  AuthField,
  AuthShell,
  authInputClass,
  authPrimaryBtnClass,
} from '../components/AuthShell'

export function SignupPage() {
  const { register, user, loading, configured } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('customer')
  const [shopName, setShopName] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && user) {
    return <Navigate to={homePathForRole(user.role)} replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setNote('')
    try {
      const result = await register({
        name,
        email,
        phone,
        password,
        role,
        shopName,
      })
      if (!result.ok) {
        setError(result.error ?? 'Could not create account.')
        return
      }
      if (result.note) {
        setNote(result.note)
        return
      }
      if (result.user) navigate(homePathForRole(result.user.role), { replace: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join as a customer or open a shop on Styla."
    >
      {!configured && (
        <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Add Supabase keys to <code>.env.local</code> to enable auth.
        </p>
      )}
      <form onSubmit={(e) => void onSubmit(e)}>
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1">
          {(
            [
              ['customer', 'Customer'],
              ['shop_owner', 'Shop owner'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                role === value
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              onClick={() => setRole(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <AuthField label="Full name">
          <input
            className={authInputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </AuthField>
        <AuthField label="Email">
          <input
            className={authInputClass}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </AuthField>
        <AuthField label="Phone (optional)">
          <input
            className={authInputClass}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </AuthField>
        {role === 'shop_owner' && (
          <AuthField label="Shop name">
            <input
              className={authInputClass}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />
          </AuthField>
        )}
        <AuthField label="Password">
          <input
            className={authInputClass}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </AuthField>

        {error && (
          <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}
        {note && (
          <p className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {note}
          </p>
        )}
        <button className={authPrimaryBtnClass} type="submit" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-stone-500">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-semibold text-indigo-600">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
