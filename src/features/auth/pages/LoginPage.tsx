import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { homePathForRole } from '../../../services/authService'
import {
  AuthField,
  AuthShell,
  authInputClass,
  authPrimaryBtnClass,
} from '../components/AuthShell'

export function LoginPage() {
  const { login, user, loading, configured } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && user) {
    return <Navigate to={homePathForRole(user.role)} replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await login(email, password)
      if (!result.ok) {
        setError(result.error ?? 'Sign-in failed.')
        return
      }
      if (result.user) navigate(homePathForRole(result.user.role), { replace: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue shopping or manage your shop."
    >
      {!configured && (
        <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Add Supabase keys to <code>.env.local</code> to enable auth.
        </p>
      )}
      <form onSubmit={(e) => void onSubmit(e)}>
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
        <AuthField label="Password">
          <input
            className={authInputClass}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </AuthField>
        <div className="mb-3 text-right">
          <Link
            to="/auth/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Forgot password?
          </Link>
        </div>
        {error && (
          <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}
        <button className={authPrimaryBtnClass} type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-stone-500">
        New here?{' '}
        <Link to="/auth/signup" className="font-semibold text-indigo-600">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
