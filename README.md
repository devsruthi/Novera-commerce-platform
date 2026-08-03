# Novera — Shopping Assistant

Multi-role fashion/electronics marketplace: customers browse and buy; shop owners manage inventory. Catalog, auth, and storage run on **Supabase**; AI Discover uses a small Vite middleware + OpenAI.

## Quick start

```bash
cp .env.example .env.local
# Fill VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, OPENAI_API_KEY
npm install
npm run dev
```

App: `http://localhost:5173`

Apply Supabase SQL in order (see [Database](#database)): Phase 1 → 2 → 3, then optional seeds. Auth redirect URLs: `http://localhost:5173/**` (details in [`supabase/PHASE1.md`](supabase/PHASE1.md)).

---

## Architecture

### High-level

```
┌─────────────────────────────────────────────────────────────┐
│  React SPA (Vite + TypeScript + Tailwind)                   │
│  features/auth | customer | shop | ai                       │
│  services/* → Supabase JS client                            │
└───────────────┬──────────────────────────┬──────────────────┘
                │                          │
                ▼                          ▼
     ┌──────────────────┐       ┌─────────────────────┐
     │ Supabase         │       │ Vite middleware     │
     │ Auth · Postgres  │       │ /api/ai/* (OpenAI)  │
     │ Storage · RLS    │       │ Intent parse / chat │
     └──────────────────┘       └─────────────────────┘
```

- **Catalog path is Supabase-only** (no SerpAPI in the product browse path).
- **AI Discover** is isolated under `src/features/ai` and ranks products loaded from Supabase.

### Roles & routing

| Role | Home | Guard |
|---|---|---|
| `customer` | `/customer` | `ProtectedRoute` with `roles={['customer']}` |
| `shop_owner` | `/shop` | `ProtectedRoute` with `roles={['shop_owner']}` |

Signup stores `role` (and optional `shop_name`) in auth metadata. A DB trigger creates `profiles` and, for shop owners, an empty `shops` row.

**Customer routes:** home, shop browse/filters, categories, product detail, wishlist, cart, AI Discover (`/customer/ai`).

**Shop owner routes:** dashboard, products CRUD, categories, shop settings, profile.

### Frontend layers

| Layer | Path | Responsibility |
|---|---|---|
| Routes / guards | `src/app/` | Router, `ProtectedRoute`, providers |
| Features | `src/features/{auth,customer,shop,ai}/` | UI by domain |
| Context | `src/context/` | Auth, cart, wishlist session state |
| Services | `src/services/` | Supabase queries & mutations |
| Lib | `src/lib/` | AI helpers, ranking, Supabase client |
| Types | `src/types/` | Domain + DB row shapes |

**Services (data access):**

- `authService` — signup/login, role redirect
- `productService` — public catalog (featured, browse, filters, categories)
- `shopService` / `shopProductService` — owner shop + inventory
- `cartService` / `wishlistService` — customer cart & wishlist
- `storageService` — avatars, logos, product images

**Providers stack:** React Query → Auth → Wishlist → Cart → Router.

### AI Discover (isolated)

| Piece | Location |
|---|---|
| UI | `src/features/ai/AiDiscoverPage.tsx` |
| Client API | `src/lib/aiApi.ts` |
| Rule fallback parse | `src/lib/parseQuery.ts` |
| Ranking / outfits | `src/lib/rankProducts.ts`, `outfitBuilder.ts` |
| Server | `server/aiPlugin.ts` → `/api/ai/*` |

OpenAI key stays server-side (`OPENAI_API_KEY`). Without a key, parse falls back to rules.

### Request flow (examples)

**Browse products:** page → `productService` → Supabase `products` (+ joins) → React Query cache.

**Add to cart:** UI → `cartService` → `ensure_my_cart()` + `cart_lines` (RLS: customer owns cart).

**Shop inventory create:** form → `shopProductService` + Storage upload under `{shop_id}/…` → `products` insert (RLS: `is_shop_owner_of`).

**AI search:** query → `/api/ai/parse` → filters → `productService` / ranking → ranked results in UI.

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

`schema.sql` is the older legacy schema (jsonb cart/wishlist/orders). The app uses the Phase 1–3 relational model; legacy tables may remain unused.

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

### Tables

#### `profiles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `email` | text | |
| `name` | text | |
| `phone` | text? | |
| `avatar` | text? | Storage URL |
| `role` | `user_role` | `customer` \| `shop_owner` |
| `created_at` | timestamptz | |

#### `shops`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `owner_id` | uuid FK → profiles | Unique (one shop per owner) |
| `shop_name`, `description` | text | |
| `logo`, `address` | text? | |
| `rating` | numeric 0–5 | |
| `created_at` | timestamptz | |

#### `categories`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `name` | text unique | Seeded defaults (Dresses, Tops, …) |
| `slug` | text unique? | URL segment |
| `image` | text? | |

#### `products`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `shop_id` | uuid FK → shops | Cascade delete |
| `category_id` | uuid FK → categories? | Set null on delete |
| `title`, `description`, `brand` | text | |
| `price`, `discount_price` | numeric | ≥ 0 |
| `stock` | int ≥ 0 | |
| `images`, `colors`, `sizes`, `tags` | text[] | |
| `featured` | boolean | |
| `rating` | numeric 0–5 | |
| `created_at` | timestamptz | |

Indexes include shop/category/price, featured partial index, trigram on `title`, GIN on `tags`/`colors`.

#### `wishlist`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `customer_id` | uuid FK → profiles | |
| `product_id` | uuid FK → products | |
| `created_at` | timestamptz | Unique `(customer_id, product_id)` |

#### `carts` / `cart_lines`
| Table | Key columns |
|---|---|
| `carts` | `customer_id` unique → one cart per customer |
| `cart_lines` | `cart_id`, `product_id`, `quantity`, `size`; unique `(cart_id, product_id, size)` |

Helper: `ensure_my_cart()` returns/creates the authenticated user’s cart id.

### Auth trigger & helpers

- **`handle_new_user`** — on `auth.users` insert: upsert profile from metadata; create shop if `shop_owner`.
- **`current_role()`** — role of `auth.uid()`.
- **`is_shop_owner_of(shop_id)`** — ownership check for RLS and storage.

### Row Level Security (summary)

| Resource | Read | Write |
|---|---|---|
| `profiles` | Own row | Own row |
| `shops` | Anyone | Owner (role `shop_owner`) |
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
  features/      auth, customer, shop, ai
  services/      Supabase data layer
  context/       Client session state
  lib/           AI, ranking, supabase client
  types/         Shared TypeScript types
server/
  aiPlugin.ts    OpenAI middleware for Vite
supabase/        Schema, RLS, storage, seeds
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server (+ AI middleware) |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve production build |
| `npm run lint` | ESLint |

## Environment

See [`.env.example`](.env.example):

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — client Supabase
- `OPENAI_API_KEY` / `OPENAI_MODEL` — server-only AI (default model `gpt-4o-mini`)
