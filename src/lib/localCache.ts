/** Typed localStorage helpers for Styla session data. */

const PREFIX = 'styla:'

export const cacheKeys = {
  cart: (userId: string) => `${PREFIX}cart:${userId}`,
  stockAlerts: `${PREFIX}stock-alerts`,
  restocks: `${PREFIX}restocks`,
  guestId: 'guest',
} as const

export function cacheGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (raw == null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function cacheSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode — ignore */
  }
}

export function cacheRemove(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
