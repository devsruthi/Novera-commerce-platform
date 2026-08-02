import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import { WishlistProvider } from '../context/WishlistContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
