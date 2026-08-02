import { stockForSize } from './inferProduct'
import { cacheGet, cacheKeys, cacheSet } from './localCache'
import {
  markStockAlertNotified,
  upsertStockAlert,
} from './db/alerts'
import { isSupabaseConfigured } from './supabase'

const DEMO_RESTOCK_MS = 12_000

interface RestockOverride {
  productId: string
  size: string
  qty: number
  availableAt: number
}

function readRestocks(): RestockOverride[] {
  const cached = cacheGet<RestockOverride[]>(cacheKeys.restocks)
  return Array.isArray(cached) ? cached : []
}

function writeRestocks(restocks: RestockOverride[]) {
  cacheSet(cacheKeys.restocks, restocks)
}

/** Guest-only watching flags (signed-in alerts live in Supabase). */
function readLocalWatching(): string[] {
  const cached = cacheGet<string[]>(cacheKeys.stockAlerts)
  return Array.isArray(cached) ? cached : []
}

function writeLocalWatching(keys: string[]) {
  cacheSet(cacheKeys.stockAlerts, keys)
}

function alertKey(productId: string, size: string) {
  return `${productId}::${size}`
}

export function getEffectiveStock(
  productId: string,
  size: string,
  inStock: boolean,
  stockCount?: number,
): number {
  const restock = readRestocks().find(
    (r) => r.productId === productId && r.size === size,
  )
  if (restock && restock.availableAt <= Date.now()) {
    return Math.max(0, restock.qty)
  }
  return stockForSize(productId, size, inStock, stockCount)
}

export function hasStockAlert(productId: string, size: string): boolean {
  return readLocalWatching().includes(alertKey(productId, size))
}

function scheduleDemoRestock(input: {
  productId: string
  size: string
  productName: string
}) {
  window.setTimeout(() => {
    const restocks = readRestocks().filter(
      (r) => !(r.productId === input.productId && r.size === input.size),
    )
    writeRestocks([
      {
        productId: input.productId,
        size: input.size,
        qty: 4,
        availableAt: Date.now(),
      },
      ...restocks,
    ])
    window.dispatchEvent(
      new CustomEvent('styla:stock-available', {
        detail: {
          productId: input.productId,
          size: input.size,
          productName: input.productName,
        },
      }),
    )
  }, DEMO_RESTOCK_MS)
}

export function requestStockAlert(input: {
  productId: string
  size: string
  productName: string
  userId?: string
}): { ok: boolean; alreadyWatching: boolean } {
  const key = alertKey(input.productId, input.size)
  const watching = readLocalWatching()
  const alreadyWatching = watching.includes(key)

  if (!alreadyWatching) {
    writeLocalWatching([key, ...watching])
    scheduleDemoRestock(input)
  }

  if (input.userId && isSupabaseConfigured) {
    void upsertStockAlert(input.userId, {
      productId: input.productId,
      size: input.size,
      productName: input.productName,
    }).catch(() => {})
  }

  return { ok: true, alreadyWatching }
}

export async function markAlertNotified(
  productId: string,
  size: string,
  userId?: string,
) {
  const key = alertKey(productId, size)
  writeLocalWatching(readLocalWatching().filter((k) => k !== key))

  if (userId && isSupabaseConfigured) {
    await markStockAlertNotified(userId, productId, size).catch(() => {})
  }
}

export type StockAvailableDetail = {
  productId: string
  size: string
  productName: string
}
