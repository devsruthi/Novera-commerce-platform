import type { User as SupabaseUser } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured, trySupabase } from '../lib/supabase'
import type { Profile, User, UserRole } from '../types'
import type { DbProfile } from '../types/database'

export type AuthResult = {
  ok: boolean
  error?: string
  note?: string
  user?: User
}

function toUser(profile: DbProfile | Profile, fallbackEmail = ''): User {
  return {
    id: profile.id,
    name: profile.name || fallbackEmail.split('@')[0] || 'User',
    email: profile.email || fallbackEmail,
    username: profile.email?.split('@')[0] || 'user',
    phone: profile.phone,
    avatar: profile.avatar,
    role: profile.role ?? 'customer',
  }
}

export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  const supabase = trySupabase()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, phone, avatar, role, created_at')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return null
  return data as DbProfile
}

export async function mapAuthUser(sbUser: SupabaseUser): Promise<User> {
  const profile = await fetchProfile(sbUser.id)
  if (profile) return toUser(profile, sbUser.email ?? '')

  const metaRole = sbUser.user_metadata?.role as UserRole | undefined
  return {
    id: sbUser.id,
    email: sbUser.email ?? '',
    name:
      (sbUser.user_metadata?.name as string | undefined) ||
      (sbUser.user_metadata?.display_name as string | undefined) ||
      sbUser.email?.split('@')[0] ||
      'User',
    username: sbUser.email?.split('@')[0] || 'user',
    phone: (sbUser.user_metadata?.phone as string | undefined) ?? null,
    avatar: null,
    role: metaRole === 'shop_owner' ? 'shop_owner' : 'customer',
  }
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error:
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local',
    }
  }
  if (!email.trim() || !password) {
    return { ok: false, error: 'Email and password are required.' }
  }

  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })
  if (error) return { ok: false, error: error.message }
  if (!data.user) return { ok: false, error: 'Sign-in failed.' }
  return { ok: true, user: await mapAuthUser(data.user) }
}

export async function register(input: {
  name: string
  email: string
  password: string
  phone?: string
  role: UserRole
  shopName?: string
}): Promise<AuthResult> {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error:
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local',
    }
  }

  const name = input.name.trim()
  const email = input.email.trim()
  if (!name || !email || !input.password) {
    return { ok: false, error: 'Name, email, and password are required.' }
  }
  if (input.password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' }
  }
  if (input.role === 'shop_owner' && !input.shopName?.trim()) {
    return { ok: false, error: 'Shop name is required for shop owners.' }
  }

  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/login`,
      data: {
        name,
        phone: input.phone?.trim() || '',
        role: input.role,
        shop_name: input.shopName?.trim() || '',
      },
    },
  })
  if (error) return { ok: false, error: error.message }

  if (data.session?.user) {
    await supabase
      .from('profiles')
      .update({
        name,
        email,
        phone: input.phone?.trim() || null,
        role: input.role,
      })
      .eq('id', data.user!.id)

    if (input.role === 'shop_owner') {
      await supabase.from('shops').upsert(
        {
          owner_id: data.user!.id,
          shop_name: input.shopName!.trim(),
        },
        { onConflict: 'owner_id' },
      )
    }

    return { ok: true, user: await mapAuthUser(data.session.user) }
  }

  return {
    ok: true,
    note: 'Check your email to verify your account, then sign in.',
  }
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase is not configured.' }
  }
  if (!email.trim()) return { ok: false, error: 'Email is required.' }

  const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  if (error) return { ok: false, error: error.message }
  return {
    ok: true,
    note: 'If an account exists for that email, a reset link has been sent.',
  }
}

export async function updatePassword(password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase is not configured.' }
  }
  if (password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' }
  }
  const { error } = await getSupabase().auth.updateUser({ password })
  if (error) return { ok: false, error: error.message }
  return { ok: true, note: 'Password updated. You can continue signed in.' }
}

export async function signOut(): Promise<void> {
  const supabase = trySupabase()
  if (supabase) await supabase.auth.signOut()
}

export function homePathForRole(role: UserRole): string {
  return role === 'shop_owner' ? '/shop' : '/customer'
}
