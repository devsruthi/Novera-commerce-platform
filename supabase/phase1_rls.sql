-- Styla Phase 1: Row Level Security for profiles, shops, categories, products
-- Run after phase1_schema.sql

alter table public.profiles enable row level security;
alter table public.shops enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Drop Phase-1 policies if re-running
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_select_authenticated" on public.profiles;
drop policy if exists "shops_select_all" on public.shops;
drop policy if exists "shops_insert_own" on public.shops;
drop policy if exists "shops_update_own" on public.shops;
drop policy if exists "categories_select_all" on public.categories;
drop policy if exists "products_select_all" on public.products;
drop policy if exists "products_insert_owner" on public.products;
drop policy if exists "products_update_owner" on public.products;
drop policy if exists "products_delete_owner" on public.products;

-- Profiles: users can read/update their own row
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Shops: public read; owners manage their shop
create policy "shops_select_all" on public.shops
  for select
  using (true);

create policy "shops_insert_own" on public.shops
  for insert to authenticated
  with check (
    owner_id = auth.uid()
    and public.current_role() = 'shop_owner'
  );

create policy "shops_update_own" on public.shops
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Categories: readable by everyone (seeded; writes via SQL/service role for now)
create policy "categories_select_all" on public.categories
  for select
  using (true);

-- Products: catalog is public; CRUD only for owning shop
create policy "products_select_all" on public.products
  for select
  using (true);

create policy "products_insert_owner" on public.products
  for insert to authenticated
  with check (public.is_shop_owner_of(shop_id));

create policy "products_update_owner" on public.products
  for update to authenticated
  using (public.is_shop_owner_of(shop_id))
  with check (public.is_shop_owner_of(shop_id));

create policy "products_delete_owner" on public.products
  for delete to authenticated
  using (public.is_shop_owner_of(shop_id));
