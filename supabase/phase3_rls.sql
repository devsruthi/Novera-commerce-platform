-- Styla Phase 3: allow shop owners to manage categories (assign + create)
-- Run after phase1_rls.sql

drop policy if exists "categories_insert_owners" on public.categories;
drop policy if exists "categories_update_owners" on public.categories;

create policy "categories_insert_owners" on public.categories
  for insert to authenticated
  with check (public.current_role() = 'shop_owner');

create policy "categories_update_owners" on public.categories
  for update to authenticated
  using (public.current_role() = 'shop_owner')
  with check (public.current_role() = 'shop_owner');
