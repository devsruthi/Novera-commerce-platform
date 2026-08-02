import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { homePathForRole } from '../../../services/authService'
import {
  AuthField,
  AuthShell,
  authInputClass,
  authPrimaryBtnClass,
} from '../components/AuthShell'

export function ResetPasswordPage() {
  const { resetPassword, user } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    setError('')
    setNote('')
    try {
      const result = await resetPassword(password)
      if (!result.ok) {
        setError(result.error ?? 'Could not update password.')
        return
      }
      setNote(result.note ?? 'Password updated.')
      if (user) {
        navigate(homePathForRole(user.role), { replace: true })
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Open this page from the email link, then set your new password."
    >
      <form onSubmit={(e) => void onSubmit(e)}>
        <AuthField label="New password">
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
        <AuthField label="Confirm password">
          <input
            className={authInputClass}
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {busy ? 'Saving…' : 'Update password'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-stone-500">
        <Link to="/auth/login" className="font-semibold text-indigo-600">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  )
}
