/**
 * Isolated AI shopping assistant (legacy Styla discover experience).
 * Catalog fetches now go through Supabase via productService — not SerpAPI.
 */
import { useCart } from '../../context/CartContext'
import { OrdersProvider, useOrders } from '../../context/OrdersContext'
import { ShopProvider, useShop } from '../../context/ShopContext'
import { Header } from '../../components/Header'
import { SearchBar } from '../../components/SearchBar'
import { FilterChips } from '../../components/FilterChips'
import { ProductGrid } from '../../components/ProductGrid'
import { AuthModal } from '../../components/AuthModal'
import { HeroShowcase } from '../../components/HeroShowcase'
import { LandingSections } from '../../components/LandingSections'
import { FeaturePanels } from '../../components/FeaturePanels'
import { ProductDetail } from '../../components/ProductDetail'
import { CartPage } from '../../components/CartPage'
import { WishlistPage } from '../../components/WishlistPage'
import { OrdersPage } from '../../components/OrdersPage'
import { Snackbar } from '../../components/Snackbar'
import '../../App.css'

function AiShoppingAssistant() {
  const { hasSearched, status, wishlistOpen, mode } = useShop()
  const { isOpen: cartOpen } = useCart()
  const { isOpen: ordersOpen } = useOrders()
  const showHero =
    !hasSearched && status === 'idle' && !cartOpen && !wishlistOpen && !ordersOpen
  const isOutfitMode = mode === 'outfit'

  return (
    <div
      className={`app ${
        cartOpen
          ? 'is-cart'
          : ordersOpen
            ? 'is-orders'
            : wishlistOpen
              ? 'is-wishlist'
              : showHero
                ? 'is-hero'
                : 'is-results'
      }`}
    >
      <Header />

      {cartOpen ? (
        <CartPage />
      ) : ordersOpen ? (
        <OrdersPage />
      ) : wishlistOpen ? (
        <WishlistPage />
      ) : showHero ? (
        <main id="top">
          <section className="hero">
            <HeroShowcase />
            <div className="hero-blend" aria-hidden />
            <div className="hero-shell">
              <div className="hero-content">
                <p className="hero-eyebrow">✦ AI-Powered Fashion Discovery</p>
                <h1>
                  Find your perfect outfit <span className="hero-ai">with AI</span>
                </h1>
                <p className="hero-sub">
                  Describe the look in plain language. Novera parses intent, searches
                  your Supabase catalog, ranks matches, and explains every pick.
                </p>
                <SearchBar />
              </div>
              <div className="hero-visual-spacer" aria-hidden />
            </div>
          </section>

          <LandingSections />
        </main>
      ) : (
        <main className={`results-layout ${isOutfitMode ? 'is-outfit-only' : ''}`}>
          {!isOutfitMode && (
            <div className="results-search">
              <SearchBar compact />
              <FilterChips />
            </div>
          )}
          <FeaturePanels />
          {!isOutfitMode && <ProductGrid />}
        </main>
      )}

      {!cartOpen && !ordersOpen && <ProductDetail />}
      <Snackbar />
      <AuthModal />
    </div>
  )
}

export function AiDiscoverPage() {
  return (
    <OrdersProvider>
      <ShopProvider>
        <AiShoppingAssistant />
      </ShopProvider>
    </OrdersProvider>
  )
}
