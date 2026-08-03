import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { homePathForRole } from '../../../services/authService'

const inputClass =
  'w-full rounded-xl border border-violet-300 bg-white py-2.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100'

/** Set a new password after opening the email reset link. */
export function ResetPasswordPage() {
  const { resetPassword, user } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="relative min-h-dvh overflow-hidden text-slate-900">
      <div aria-hidden className="absolute inset-0 bg-[#faf8ff]" />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="newPassWaveA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#ede9fe" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#faf8ff" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="newPassWaveB" x1="100%" y1="20%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f5f3ff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          fill="url(#newPassWaveA)"
          d="M0 0h880C760 160 700 260 660 420c-50 200 0 330 150 480H0V0z"
        />
        <path
          fill="url(#newPassWaveB)"
          d="M1440 0v900H640c160-100 240-240 280-400 40-180 10-320-100-500h620z"
        />
      </svg>

      <div className="page-x relative z-10 mx-auto flex min-h-dvh max-w-5xl items-center py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:gap-14">
          <section className="relative mx-auto hidden w-full max-w-md lg:block">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-violet-400/25 via-fuchsia-300/15 to-transparent blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/70 p-6 shadow-[0_28px_70px_-22px_rgba(124,58,237,0.28)] backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
                Almost there
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                Choose a{' '}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                  new password
                </span>
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
                Opened from your email link? Set a strong password and you&apos;re
                back into Novera.
              </p>
              <div className="relative mt-8 h-52">
                <img
                  src="/auth/login-hero.jpg"
                  alt=""
                  className="auth-float absolute inset-x-6 top-0 h-44 rounded-2xl object-cover object-top shadow-xl ring-1 ring-violet-100"
                />
              </div>
            </div>
          </section>

          <section className="relative mx-auto w-full max-w-[420px]">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/90 bg-white p-6 shadow-[0_28px_70px_-22px_rgba(124,58,237,0.32)] sm:p-7">
              <div
                aria-hidden
                className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-violet-600"
              />

              <Link to="/" className="inline-flex items-center gap-2.5">
                <img
                  src="/novera-icon.png"
                  alt=""
                  className="h-9 w-9 rounded-[10px] object-cover shadow-sm shadow-violet-300/40"
                />
                <span className="brand-wordmark brand-wordmark-md">Novera</span>
              </Link>

              <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
                Choose a new password
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                Use at least 6 characters. Keep it something only you know.
              </p>

              <form className="mt-5 space-y-3.5" onSubmit={(e) => void onSubmit(e)}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-600">
                    New password
                  </span>
                  <span className="relative block">
                    <svg
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden
                    >
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V8a4 4 0 018 0v3" />
                    </svg>
                    <input
                      className={inputClass}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-violet-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-600">
                    Confirm password
                  </span>
                  <span className="relative block">
                    <svg
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden
                    >
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V8a4 4 0 018 0v3" />
                    </svg>
                    <input
                      className="w-full rounded-xl border border-violet-300 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      minLength={6}
                      required
                    />
                  </span>
                </label>

                {error && (
                  <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </p>
                )}
                {note && (
                  <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    {note}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="relative flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold !text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700 disabled:opacity-60"
                >
                  {busy ? 'Saving…' : 'Update password'}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                <Link
                  to="/auth/login"
                  className="font-semibold text-violet-700 hover:text-violet-900"
                >
                  ← Back to sign in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.8 2.8M9.4 5.1A9.8 9.8 0 0 1 12 4.5c5 0 9.3 3.6 10.5 7.5a11.4 11.4 0 0 1-4.2 5.1M6.2 6.2A11.3 11.3 0 0 0 1.5 12C2.7 15.9 7 19.5 12 19.5c1.5 0 2.9-.3 4.2-.8" />
      </svg>
    )
  }
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
