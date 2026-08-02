# Phase 3 setup

After Phase 1 + 2 SQL, run:

1. `phase3_rls.sql` — shop owners can create/update categories

## Shop owner routes

| Path | Feature |
|---|---|
| `/shop` | Dashboard stats |
| `/shop/products` | Inventory list |
| `/shop/products/new` | Add product + images |
| `/shop/products/:id/edit` | Edit / stock / images |
| `/shop/categories` | Category management |
| `/shop/settings` | Shop settings + logo |
| `/shop/profile` | Owner profile + avatar |

Product images upload to Storage bucket `product-images` under `{shop_id}/…`.
