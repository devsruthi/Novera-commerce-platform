-- Styla Phase 1: roles, shops, categories, products
-- Run in Supabase SQL Editor after backing up if you have production data.
-- Extends the existing Styla schema; does not drop legacy cart/wishlist/orders.

create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('customer', 'shop_owner');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Profiles (create or migrate from legacy display_name / username shape)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null default '',
  phone text,
  avatar text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists name text not null default '';
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists avatar text;
alter table public.profiles add column if not exists role public.user_role not null default 'customer';

-- Backfill name from legacy columns when present
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'display_name'
  ) then
    update public.profiles
    set name = coalesce(nullif(name, ''), nullif(display_name, ''), split_part(email, '@', 1))
    where name = '' or name is null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Shops / categories / products
-- ---------------------------------------------------------------------------
create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  shop_name text not null,
  description text not null default '',
  logo text,
  address text,
  rating numeric(3, 2) not null default 0
    check (rating >= 0 and rating <= 5),
  created_at timestamptz not null default now(),
  unique (owner_id)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  image text,
  slug text unique
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  title text not null,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  discount_price numeric(12, 2)
    check (discount_price is null or discount_price >= 0),
  stock int not null default 0 check (stock >= 0),
  brand text not null default '',
  images text[] not null default '{}',
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  rating numeric(3, 2) not null default 0
    check (rating >= 0 and rating <= 5),
  created_at timestamptz not null default now()
);

create index if not exists shops_owner_idx on public.shops (owner_id);
create index if not exists products_shop_id_idx on public.products (shop_id);
create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_price_idx on public.products (price);
create index if not exists products_featured_idx on public.products (featured)
  where featured = true;
create index if not exists products_title_trgm on public.products
  using gin (title gin_trgm_ops);
create index if not exists products_tags_gin on public.products using gin (tags);
create index if not exists products_colors_gin on public.products using gin (colors);

-- Seed default categories (idempotent)
insert into public.categories (name, slug)
values
  ('Dresses', 'dresses'),
  ('Tops', 'tops'),
  ('Bottoms', 'bottoms'),
  ('Outerwear', 'outerwear'),
  ('Shoes', 'shoes'),
  ('Accessories', 'accessories'),
  ('Electronics', 'electronics'),
  ('Other', 'other')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- Auth trigger: create profile with role from signup metadata
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role text;
  resolved_role public.user_role;
  resolved_name text;
begin
  meta_role := coalesce(new.raw_user_meta_data->>'role', 'customer');
  if meta_role = 'shop_owner' then
    resolved_role := 'shop_owner';
  else
    resolved_role := 'customer';
  end if;

  resolved_name := coalesce(
    nullif(new.raw_user_meta_data->>'name', ''),
    nullif(new.raw_user_meta_data->>'display_name', ''),
    split_part(coalesce(new.email, 'user'), '@', 1)
  );

  insert into public.profiles (id, email, name, phone, role)
  values (
    new.id,
    coalesce(new.email, ''),
    resolved_name,
    nullif(new.raw_user_meta_data->>'phone', ''),
    resolved_role
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(nullif(public.profiles.name, ''), excluded.name),
    role = public.profiles.role;

  -- Auto-create empty shop for shop owners
  if resolved_role = 'shop_owner' then
    insert into public.shops (owner_id, shop_name, description)
    values (
      new.id,
      coalesce(nullif(new.raw_user_meta_data->>'shop_name', ''), resolved_name || '''s Shop'),
      ''
    )
    on conflict (owner_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helpers
create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_shop_owner_of(p_shop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.shops s
    where s.id = p_shop_id and s.owner_id = auth.uid()
  )
$$;
