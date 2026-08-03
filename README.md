# Novera — Shop & Sell

A dual-role fashion marketplace: **customers** browse, wishlist, cart, and order; **shop owners** manage inventory, categories, and storefront settings. Catalog, auth, cart/wishlist, orders, and media run on **Supabase**.

## Quick start

```bash
cp .env.example .env.local
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

App: `http://localhost:5173`

Apply Supabase SQL in order (see [Database](#database)): Phase 1 → 2 → 3, then optional seeds. Auth redirect URLs: `http://localhost:5173/**` (details in [`supabase/PHASE1.md`](supabase/PHASE1.md)).

---

## Features

### Customers (`/customer`)

| Area | What you get |
|---|---|
| Home | Brand hero, category strip, featured products |
| Shop | Browse with search, filters (price, rating, brand, size), sort, grid/list, load more |
| Categories | Category directory and slug-scoped listings |
| Product detail | Image gallery, sizes, quantity, add to cart, wishlist |
| Wishlist | Saved items synced to Supabase |
| Cart | Line items, shipping threshold, payment method picker, place order |
| Orders | Order history, status filters, timeline, cancel when allowed |

### Shop owners (`/shop`)

| Area | What you get |
|---|---|
| Dashboard | KPIs, sales chart, top products, recent activity |
| Products | Inventory list + create/edit (images, price, stock, brand, category, colors, sizes, tags, featured) |
| Categories | Create/edit categories and images |
| Store settings | Shop name, description, address, logo upload |
| Profile | Owner name, phone, avatar |

Coming soon in the owner nav: orders, customers, analytics, reviews, marketing, support.

### Auth

Login, signup (choose **customer** or **shop owner**), forgot/reset password. Signup stores `role` (and optional `shop_name`) in auth metadata; a DB trigger creates `profiles` and, for owners, a `shops` row.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│  React SPA (Vite + TypeScript + Tailwind)       │
│  features/auth · customer · shop                │
│  services/* → Supabase JS client                │
└──────────────────────┬──────────────────────────┘
                       ▼
            ┌──────────────────────┐
            │ Supabase             │
            │ Auth · Postgres      │
            │ Storage · RLS        │
            └──────────────────────┘
```

### Roles & routing

| Role | Home | Guard |
|---|---|---|
| `customer` | `/customer` | `ProtectedRoute` with `roles={['customer']}` |
| `shop_owner` | `/shop` | `ProtectedRoute` with `roles={['shop_owner']}` |

### Frontend layers

| Layer | Path | Responsibility |
|---|---|---|
| Routes / guards | `src/app/` | Router, `ProtectedRoute`, providers |
| Features | `src/features/{auth,customer,shop}/` | UI by domain |
| Context | `src/context/` | Auth, cart, wishlist, orders |
| Services | `src/services/` | Supabase queries & mutations |
| Lib | `src/lib/` | Helpers, Supabase client |
| Types | `src/types/` | Domain + DB row shapes |

**Services:** `authService`, `productService`, `shopService` / `shopProductService`, `cartService`, `wishlistService`, `storageService`, order helpers via orders context.

**Providers:** React Query → Auth → Wishlist → Cart → Router (OrdersProvider inside customer layout).

### Request flow (examples)

**Browse products:** page → `productService` → Supabase `products` → React Query cache.

**Add to cart:** UI → `cartService` → `ensure_my_cart()` + `cart_lines` (RLS: customer owns cart).

**Place order:** cart → orders context → `orders` / `order_items`.

**Shop inventory create:** form → `shopProductService` + Storage under `{shop_id}/…` → `products` insert (RLS: `is_shop_owner_of`).

---

## Tech stack

- React 19 · TypeScript · Vite
- React Router 7 · TanStack React Query 5
- Tailwind CSS 4
- Supabase (Auth, Postgres, Storage, RLS)
- Recharts (shop dashboard)

Brand: **Novera** · violet primary · Outfit font.

---

## Database

Postgres via Supabase. SQL lives in [`supabase/`](supabase/). Apply in the SQL Editor in this order:

| Order | File | What it adds |
|---|---|---|
| 1 | `phase1_schema.sql` | Roles, profiles, shops, categories, products, triggers |
| 2 | `phase1_rls.sql` | RLS for Phase 1 tables |
| 3 | `phase1_storage.sql` | Buckets: `avatars`, `shop-logos`, `product-images` |
| 4 | `phase2_schema.sql` | `wishlist`, `carts`, `cart_lines` |
| 5 | `phase2_rls.sql` | Customer-only RLS for cart/wishlist |
| 6 | `phase3_rls.sql` | Shop owners create/update categories |
| Optional | `phase1_seed_demo.sql`, `seed_catalog.sql` | Demo / catalog data |

Phase notes: [`PHASE1.md`](supabase/PHASE1.md) · [`PHASE2.md`](supabase/PHASE2.md) · [`PHASE3.md`](supabase/PHASE3.md).

`schema.sql` includes legacy / orders-related tables used by customer checkout. Prefer the Phase 1–3 relational model for catalog, cart, and wishlist.

### Entity relationship

```
auth.users
    │ 1:1
    ▼
profiles ─────────────┬──────────────────┐
  role: customer      │                  │
       │ shop_owner   │                  │
       │              │                  │
       │ 1:1          │ *                │ *
       ▼              ▼                  ▼
     shops         wishlist            carts
       │           (product_id)          │
       │ *                               │ *
       ▼                                 ▼
   products ◄──── categories         cart_lines
                 (category_id)       (product_id, qty, size)
```

### Tables (summary)

| Table | Purpose |
|---|---|
| `profiles` | User profile, role, avatar |
| `shops` | One storefront per shop owner |
| `categories` | Shared catalog categories |
| `products` | Shop inventory (price, stock, images, sizes, featured, …) |
| `wishlist` | Customer saved products |
| `carts` / `cart_lines` | One cart per customer; lines by product + size |
| `orders` / `order_items` | Customer checkout history |

Helpers: `handle_new_user`, `current_role()`, `is_shop_owner_of(shop_id)`, `ensure_my_cart()`.

### Row Level Security (summary)

| Resource | Read | Write |
|---|---|---|
| `profiles` | Own row | Own row |
| `shops` | Anyone | Owner |
| `categories` | Anyone | Shop owners (Phase 3) |
| `products` | Anyone | Owning shop only |
| `wishlist` / `carts` / `cart_lines` | Owning customer | Owning customer |

### Storage

| Bucket | Public read | Write path |
|---|---|---|
| `avatars` | Yes | `{user_id}/…` |
| `shop-logos` | Yes | `{shop_id}/…` (owner) |
| `product-images` | Yes | `{shop_id}/…` (owner) |

Mime: jpeg/png/webp/gif. Limits: 5 MB avatars/logos, 10 MB product images.

---

## Project layout

```
src/
  app/           Router, providers, route guards
  features/      auth, customer, shop
  services/      Supabase data layer
  context/       Auth, cart, wishlist, orders
  lib/           Shared helpers, Supabase client
  types/         Shared TypeScript types
supabase/        Schema, RLS, storage, seeds
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve production build |
| `npm run lint` | ESLint |

## Environment

See [`.env.example`](.env.example):

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key
