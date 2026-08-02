import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { SignupPage } from '../features/auth/pages/SignupPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage'
import { CustomerLayout } from '../features/customer/CustomerLayout'
import { CustomerHomePage } from '../features/customer/CustomerHomePage'
import { ShopPage } from '../features/customer/ShopPage'
import { CategoriesPage } from '../features/customer/CategoriesPage'
import { ProductDetailPage } from '../features/customer/ProductDetailPage'
import { CustomerWishlistPage } from '../features/customer/CustomerWishlistPage'
import { CustomerCartPage } from '../features/customer/CustomerCartPage'
import { AiDiscoverPage } from '../features/ai/AiDiscoverPage'
import { ShopLayout } from '../features/shop/ShopLayout'
import { ShopDashboardPage } from '../features/shop/ShopDashboardPage'
import { ShopProductsPage } from '../features/shop/ShopProductsPage'
import { ShopProductFormPage } from '../features/shop/ShopProductFormPage'
import { ShopCategoriesPage } from '../features/shop/ShopCategoriesPage'
import { ShopSettingsPage } from '../features/shop/ShopSettingsPage'
import { ShopProfilePage } from '../features/shop/ShopProfilePage'

function CategorySlugShopPage() {
  const { slug } = useParams()
  return <ShopPage categorySlug={slug} />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute roles={['customer']} />}>
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerHomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:slug" element={<CategorySlugShopPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="wishlist" element={<CustomerWishlistPage />} />
          <Route path="cart" element={<CustomerCartPage />} />
        </Route>
        <Route path="/customer/ai" element={<AiDiscoverPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={['shop_owner']} />}>
        <Route path="/shop" element={<ShopLayout />}>
          <Route index element={<ShopDashboardPage />} />
          <Route path="products" element={<ShopProductsPage />} />
          <Route path="products/new" element={<ShopProductFormPage />} />
          <Route path="products/:id/edit" element={<ShopProductFormPage />} />
          <Route path="categories" element={<ShopCategoriesPage />} />
          <Route path="settings" element={<ShopSettingsPage />} />
          <Route path="profile" element={<ShopProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
