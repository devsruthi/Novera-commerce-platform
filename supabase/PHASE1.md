# Phase 1 setup

Run these SQL files in the Supabase SQL Editor, in order:

1. `phase1_schema.sql` — profiles (roles), shops, categories, products, triggers
2. `phase1_rls.sql` — Row Level Security policies
3. `phase1_storage.sql` — Storage buckets (`avatars`, `shop-logos`, `product-images`)

Then in **Authentication → URL configuration**:

- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/**`

Enable **Email** provider. For local testing you may disable “Confirm email”.

## Auth redirects

| Role | After login |
|---|---|
| `customer` | `/customer` |
| `shop_owner` | `/shop` |

AI Discover (isolated): `/customer/ai` — ranks products from Supabase.
