import { useEffect, useState, type FormEvent } from 'react'
import { useAuth, type AuthMode } from '../context/AuthContext'

export function AuthModal() {
  const {
    isOpen,
    closeAuth,
    login,
    registerLegacy,
    authMode,
    setAuthMode,
    configured,
  } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setError('')
    setNote('')
    setPassword('')
  }, [isOpen, authMode])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuth()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeAuth])

  if (!isOpen) return null

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode)
    setError('')
    setNote('')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setNote('')
    try {
      const result =
        authMode === 'login'
          ? await login(email, password)
          : await registerLegacy(name, email, username, password)

      if (!result.ok) {
        setError(result.error ?? 'Something went wrong.')
        return
      }

      if (result.note) {
        setNote(result.note)
        setAuthMode('login')
        return
      }

      setName('')
      setEmail('')
      setUsername('')
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  const isLogin = authMode === 'login'

  return (
    <div
      className="modal-backdrop auth-backdrop"
      role="presentation"
      onClick={closeAuth}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={closeAuth} aria-label="Close">
          ×
        </button>

        <div className="auth-tabs" role="tablist" aria-label="Account">
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={isLogin ? 'is-active' : ''}
            onClick={() => switchMode('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={!isLogin ? 'is-active' : ''}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <h2 id="auth-title">{isLogin ? 'Sign in' : 'Create account'}</h2>
        <p className="modal-copy">
          {configured
            ? isLogin
              ? 'Sign in with your Supabase account.'
              : 'Create an account stored in Supabase Auth.'
            : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart Vite.'}
        </p>

        <form onSubmit={(e) => void onSubmit(e)} className="auth-form">
          {!isLogin && (
            <>
              <label>
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                Username
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johnd"
                  autoComplete="username"
                />
              </label>
            </>
          )}
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={isLogin ? 1 : 6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? 'Your password' : 'At least 6 characters'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          {note && (
            <p className="auth-note" role="status">
              {note}
            </p>
          )}

          <button
            type="submit"
            className="solid-btn full"
            disabled={busy || !configured}
          >
            {busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? (
            <>
              New here?{' '}
              <button type="button" onClick={() => switchMode('register')}>
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
