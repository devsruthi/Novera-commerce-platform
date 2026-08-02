import { getSupabase } from '../lib/supabase'

export type StorageBucket = 'avatars' | 'shop-logos' | 'product-images'

export async function uploadPublicImage(opts: {
  bucket: StorageBucket
  path: string
  file: File
}): Promise<string> {
  const supabase = getSupabase()
  const { error } = await supabase.storage
    .from(opts.bucket)
    .upload(opts.path, opts.file, { upsert: true, contentType: opts.file.type })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(opts.bucket).getPublicUrl(opts.path)
  return data.publicUrl
}
