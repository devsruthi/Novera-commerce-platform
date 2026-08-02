# Phase 2 setup

After Phase 1 SQL, run:

1. `phase2_schema.sql` — `wishlist`, `carts`, `cart_lines`
2. `phase2_rls.sql` — customer-only RLS

## Customer routes

| Path | Feature |
|---|---|
| `/customer` | Home / featured |
| `/customer/shop` | Product listing + filters |
| `/customer/categories` | Category grid |
| `/customer/categories/:slug` | Filtered listing |
| `/customer/product/:id` | Product detail |
| `/customer/wishlist` | Wishlist |
| `/customer/cart` | Cart |
| `/customer/ai` | AI Discover (isolated) |
