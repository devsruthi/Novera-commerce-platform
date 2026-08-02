-- Styla Phase 1: Storage buckets + policies
-- Run in SQL Editor (requires storage schema privileges).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'avatars',
    'avatars',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'shop-logos',
    'shop-logos',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'product-images',
    'product-images',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Avatars: users manage files under {user_id}/...
drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_insert_own" on storage.objects;
drop policy if exists "avatars_update_own" on storage.objects;
drop policy if exists "avatars_delete_own" on storage.objects;

create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Shop logos: owners under {shop_id}/...
drop policy if exists "shop_logos_public_read" on storage.objects;
drop policy if exists "shop_logos_insert_owner" on storage.objects;
drop policy if exists "shop_logos_update_owner" on storage.objects;
drop policy if exists "shop_logos_delete_owner" on storage.objects;

create policy "shop_logos_public_read" on storage.objects
  for select using (bucket_id = 'shop-logos');

create policy "shop_logos_insert_owner" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'shop-logos'
    and public.is_shop_owner_of(((storage.foldername(name))[1])::uuid)
  );

create policy "shop_logos_update_owner" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'shop-logos'
    and public.is_shop_owner_of(((storage.foldername(name))[1])::uuid)
  );

create policy "shop_logos_delete_owner" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'shop-logos'
    and public.is_shop_owner_of(((storage.foldername(name))[1])::uuid)
  );

-- Product images: owners under {shop_id}/...
drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_insert_owner" on storage.objects;
drop policy if exists "product_images_update_owner" on storage.objects;
drop policy if exists "product_images_delete_owner" on storage.objects;

create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "product_images_insert_owner" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and public.is_shop_owner_of(((storage.foldername(name))[1])::uuid)
  );

create policy "product_images_update_owner" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'product-images'
    and public.is_shop_owner_of(((storage.foldername(name))[1])::uuid)
  );

create policy "product_images_delete_owner" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'product-images'
    and public.is_shop_owner_of(((storage.foldername(name))[1])::uuid)
  );
