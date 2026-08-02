# AI feature (isolated)

Phase 1 keeps the existing AI parse / rank / outfit UI here.

- Intent parsing: `src/lib/parseQuery.ts`, `src/lib/aiApi.ts`, `server/aiPlugin.ts`
- Ranking: `src/lib/rankProducts.ts`
- Catalog source: **Supabase** via `src/services/productService.ts` (SerpAPI removed from the catalog path)

Route: `/customer/ai`
