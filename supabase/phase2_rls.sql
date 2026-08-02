-- Styla Phase 2 RLS for wishlist / carts / cart_lines

alter table public.wishlist enable row level security;
alter table public.carts enable row level security;
alter table public.cart_lines enable row level security;

drop policy if exists "wishlist_select_own" on public.wishlist;
drop policy if exists "wishlist_insert_own" on public.wishlist;
drop policy if exists "wishlist_delete_own" on public.wishlist;
drop policy if exists "carts_select_own" on public.carts;
drop policy if exists "carts_insert_own" on public.carts;
drop policy if exists "carts_update_own" on public.carts;
drop policy if exists "cart_lines_select_own" on public.cart_lines;
drop policy if exists "cart_lines_insert_own" on public.cart_lines;
drop policy if exists "cart_lines_update_own" on public.cart_lines;
drop policy if exists "cart_lines_delete_own" on public.cart_lines;

create policy "wishlist_select_own" on public.wishlist
  for select to authenticated
  using (customer_id = auth.uid());

create policy "wishlist_insert_own" on public.wishlist
  for insert to authenticated
  with check (customer_id = auth.uid());

create policy "wishlist_delete_own" on public.wishlist
  for delete to authenticated
  using (customer_id = auth.uid());

create policy "carts_select_own" on public.carts
  for select to authenticated
  using (customer_id = auth.uid());

create policy "carts_insert_own" on public.carts
  for insert to authenticated
  with check (customer_id = auth.uid());

create policy "carts_update_own" on public.carts
  for update to authenticated
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

create policy "cart_lines_select_own" on public.cart_lines
  for select to authenticated
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.customer_id = auth.uid()
    )
  );

create policy "cart_lines_insert_own" on public.cart_lines
  for insert to authenticated
  with check (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.customer_id = auth.uid()
    )
  );

create policy "cart_lines_update_own" on public.cart_lines
  for update to authenticated
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.customer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.customer_id = auth.uid()
    )
  );

create policy "cart_lines_delete_own" on public.cart_lines
  for delete to authenticated
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.customer_id = auth.uid()
    )
  );
