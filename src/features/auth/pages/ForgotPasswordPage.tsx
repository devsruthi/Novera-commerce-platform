import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const inputClass =
  'w-full rounded-xl border border-violet-300 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100'

/** Forgot password — Novera-styled reset request with fashion visual. */
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
    <div className="relative min-h-dvh overflow-hidden text-slate-900">
      <div aria-hidden className="absolute inset-0 bg-[#faf8ff]" />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="resetWaveA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#ede9fe" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#faf8ff" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="resetWaveB" x1="100%" y1="20%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f5f3ff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          fill="url(#resetWaveA)"
          d="M0 0h880C760 160 700 260 660 420c-50 200 0 330 150 480H0V0z"
        />
        <path
          fill="url(#resetWaveB)"
          d="M1440 0v900H640c160-100 240-240 280-400 40-180 10-320-100-500h620z"
        />
      </svg>

      <div className="page-x relative z-10 mx-auto flex min-h-dvh max-w-5xl items-center py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:gap-14">
          {/* Visual panel */}
          <section className="relative mx-auto hidden w-full max-w-md lg:block">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-violet-400/25 via-fuchsia-300/15 to-transparent blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/70 p-6 shadow-[0_28px_70px_-22px_rgba(124,58,237,0.28)] backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
                Secure reset
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                Get back to{' '}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                  shopping
                </span>
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
                We’ll send a secure link to your inbox so you can choose a new
                password and jump back into Novera.
              </p>

              <div className="relative mt-8 h-56">
                <img
                  src="/auth/login-bag.jpg"
                  alt=""
                  className="auth-float absolute left-2 top-2 h-40 w-32 rounded-2xl object-cover shadow-xl ring-1 ring-violet-100"
                />
                <img
                  src="/auth/login-shades.jpg"
                  alt=""
                  className="auth-float-delay absolute right-4 top-8 h-36 w-36 rounded-2xl object-cover shadow-xl ring-1 ring-violet-100"
                />
                <div className="auth-float absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 shadow-lg shadow-violet-500/15">
                  <span className="grid size-8 place-items-center rounded-full bg-violet-100 text-violet-700">
                    <LockIcon />
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    Link sent to your email
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Form card */}
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

              <div className="mt-5 flex size-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <MailLockIcon />
              </div>

              <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
                Reset password
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                Enter your email and we&apos;ll send a secure link to choose a
                new password.
              </p>

              <form className="mt-5 space-y-3.5" onSubmit={(e) => void onSubmit(e)}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-600">
                    Email address
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
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                    <input
                      className={inputClass}
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                  <span>{busy ? 'Sending…' : 'Send reset link'}</span>
                  {!busy && (
                    <span className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        aria-hidden
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  )}
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

function LockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  )
}

function MailLockIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}
