import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  homePathForRole,
  login as loginService,
  mapAuthUser,
  register as registerService,
  requestPasswordReset,
  signOut as signOutService,
  updatePassword,
  type AuthResult,
} from '../services/authService'
import { isSupabaseConfigured, trySupabase } from '../lib/supabase'
import type { User, UserRole } from '../types'

export type AuthMode = 'login' | 'register'

interface OpenAuthOptions {
  mode?: AuthMode
  saveProductId?: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  isOpen: boolean
  authMode: AuthMode
  pendingSaveProductId: string | null
  configured: boolean
  openAuth: (options?: AuthMode | OpenAuthOptions) => void
  closeAuth: () => void
  setAuthMode: (mode: AuthMode) => void
  clearPendingSave: () => void
  login: (email: string, password: string) => Promise<AuthResult>
  register: (input: {
    name: string
    email: string
    password: string
    phone?: string
    role: UserRole
    shopName?: string
  }) => Promise<AuthResult>
  /** @deprecated Use register({...}) — kept for AuthModal compatibility */
  registerLegacy: (
    name: string,
    email: string,
    username: string,
    password: string,
  ) => Promise<AuthResult>
  forgotPassword: (email: string) => Promise<AuthResult>
  resetPassword: (password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  homePath: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

function resolveOpenOptions(
  options?: AuthMode | OpenAuthOptions,
): OpenAuthOptions {
  if (!options) return { mode: 'login' }
  if (typeof options === 'string') return { mode: options }
  return { mode: options.mode ?? 'login', saveProductId: options.saveProductId }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [isOpen, setIsOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [pendingSaveProductId, setPendingSaveProductId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const supabase = trySupabase()
    if (!supabase) {
      setLoading(false)
      return
    }

    let cancelled = false

    void supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return
      if (data.session?.user) {
        setUser(await mapAuthUser(data.session.user))
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        if (session?.user) setUser(await mapAuthUser(session.user))
        else setUser(null)
      })()
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginService(email, password)
    if (result.ok && result.user) {
      setUser(result.user)
      setIsOpen(false)
    }
    return result
  }, [])

  const register = useCallback(
    async (input: {
      name: string
      email: string
      password: string
      phone?: string
      role: UserRole
      shopName?: string
    }) => {
      const result = await registerService(input)
      if (result.ok && result.user) {
        setUser(result.user)
        setIsOpen(false)
      }
      return result
    },
    [],
  )

  const registerLegacy = useCallback(
    async (name: string, email: string, _username: string, password: string) => {
      return register({ name, email, password, role: 'customer' })
    },
    [register],
  )

  const forgotPassword = useCallback(async (email: string) => {
    return requestPasswordReset(email)
  }, [])

  const resetPassword = useCallback(async (password: string) => {
    return updatePassword(password)
  }, [])

  const signOut = useCallback(async () => {
    setPendingSaveProductId(null)
    setUser(null)
    await signOutService()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isOpen,
      authMode,
      pendingSaveProductId,
      configured: isSupabaseConfigured,
      openAuth: (options) => {
        const resolved = resolveOpenOptions(options)
        setAuthMode(resolved.mode ?? 'login')
        setPendingSaveProductId(resolved.saveProductId ?? null)
        setIsOpen(true)
      },
      closeAuth: () => {
        setPendingSaveProductId(null)
        setIsOpen(false)
      },
      setAuthMode,
      clearPendingSave: () => setPendingSaveProductId(null),
      login,
      register,
      registerLegacy,
      forgotPassword,
      resetPassword,
      signOut,
      homePath: user ? homePathForRole(user.role) : '/',
    }),
    [
      user,
      loading,
      isOpen,
      authMode,
      pendingSaveProductId,
      login,
      register,
      registerLegacy,
      forgotPassword,
      resetPassword,
      signOut,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
