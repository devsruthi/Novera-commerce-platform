import { Link } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
import { CatalogProductCard } from './components/CatalogProductCard'

/** Customer wishlist backed by Supabase `wishlist` table. */
export function CustomerWishlistPage() {
  const { items, loading } = useWishlist()

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-[Syne] text-3xl font-extrabold tracking-tight">
        Wishlist
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Saved pieces from Styla shops.
      </p>

      {loading && (
        <p className="mt-8 text-sm text-stone-500">Loading wishlist…</p>
      )}

      {!loading && items.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <p className="font-semibold">Your wishlist is empty</p>
          <Link
            to="/customer/shop"
            className="mt-3 inline-block text-sm font-semibold text-indigo-600"
          >
            Browse the shop
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <CatalogProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  )
}
