import { getSupabase } from '../supabase'

export interface RemoteStockAlert {
  productId: string
  size: string
  productName: string
  notified: boolean
}

interface AlertRow {
  product_id: string
  size: string
  product_name: string
  notified: boolean
}

export async function fetchStockAlerts(
  userId: string,
): Promise<RemoteStockAlert[]> {
  const { data, error } = await getSupabase()
    .from('stock_alerts')
    .select('product_id, size, product_name, notified')
    .eq('user_id', userId)

  if (error) throw error
  return (
    (data as AlertRow[] | null)?.map((row) => ({
      productId: row.product_id,
      size: row.size,
      productName: row.product_name,
      notified: row.notified,
    })) ?? []
  )
}

export async function upsertStockAlert(
  userId: string,
  input: { productId: string; size: string; productName: string },
): Promise<void> {
  const { error } = await getSupabase().from('stock_alerts').upsert(
    {
      user_id: userId,
      product_id: input.productId,
      size: input.size,
      product_name: input.productName,
      notified: false,
    },
    { onConflict: 'user_id,product_id,size' },
  )
  if (error) throw error
}

export async function markStockAlertNotified(
  userId: string,
  productId: string,
  size: string,
): Promise<void> {
  const { error } = await getSupabase()
    .from('stock_alerts')
    .update({ notified: true })
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('size', size)
  if (error) throw error
}
