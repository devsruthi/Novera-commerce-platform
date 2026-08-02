import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import {
  AuthField,
  AuthShell,
  authInputClass,
  authPrimaryBtnClass,
} from '../components/AuthShell'

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setNote('')
    try {
      const result = await forgotPassword(email)
      if (!result.ok) {
        setError(result.error ?? 'Could not send reset email.')
        return
      }
      setNote(result.note ?? 'Check your inbox for a reset link.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle="We'll email you a secure link to choose a new password."
    >
      <form onSubmit={(e) => void onSubmit(e)}>
        <AuthField label="Email">
          <input
            className={authInputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {busy ? 'Sending…' : 'Send reset link'}
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
