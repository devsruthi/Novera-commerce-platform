-- Styla Phase 2: customer wishlist + cart with FKs to products
-- Run after phase1_schema.sql + phase1_rls.sql
-- Legacy jsonb cart_items / wishlist_items remain unused by the new app code.

-- ---------------------------------------------------------------------------
-- Wishlist (customer ↔ product)
-- ---------------------------------------------------------------------------
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

create index if not exists wishlist_customer_idx on public.wishlist (customer_id);
create index if not exists wishlist_product_idx on public.wishlist (product_id);

-- ---------------------------------------------------------------------------
-- Cart (1 per customer) + line items
-- ---------------------------------------------------------------------------
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id)
);

create table if not exists public.cart_lines (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity int not null check (quantity > 0),
  size text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id, size)
);

create index if not exists cart_lines_cart_idx on public.cart_lines (cart_id);
create index if not exists cart_lines_product_idx on public.cart_lines (product_id);

-- Ensure a cart row exists for the current user
create or replace function public.ensure_my_cart()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select id into cid from public.carts where customer_id = auth.uid();
  if cid is null then
    insert into public.carts (customer_id)
    values (auth.uid())
    returning id into cid;
  end if;
  return cid;
end;
$$;

grant execute on function public.ensure_my_cart() to authenticated;
