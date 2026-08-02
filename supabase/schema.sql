-- Styla: run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null default '',
  username text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cart lines (product snapshot as jsonb)
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  size text not null default '',
  quantity int not null check (quantity > 0),
  product jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id, size)
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'placed',
  payment_method text not null default 'card',
  subtotal numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  currency text not null default 'EUR',
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null,
  name text not null,
  brand text not null default '',
  image_url text not null default '',
  size text not null default '',
  quantity int not null check (quantity > 0),
  unit_price numeric(12, 2) not null,
  currency text not null default 'EUR'
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  product jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.stock_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  size text not null default '',
  product_name text not null default '',
  notified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, product_id, size)
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, username)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'user'), '@', 1)),
    nullif(new.raw_user_meta_data->>'username', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.stock_alerts enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "cart_all_own" on public.cart_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "orders_all_own" on public.orders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "order_items_select_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );
create policy "order_items_insert_own" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );
create policy "order_items_update_own" on public.order_items
  for update using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "wishlist_all_own" on public.wishlist_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "alerts_all_own" on public.stock_alerts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists cart_items_user_idx on public.cart_items (user_id);
create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists wishlist_user_idx on public.wishlist_items (user_id);
create index if not exists stock_alerts_user_idx on public.stock_alerts (user_id);
