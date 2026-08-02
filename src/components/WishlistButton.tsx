import type { MouseEvent } from 'react'
import type { Product } from '../types'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'
import { setPendingWishlistProduct } from '../lib/pendingWishlist'

interface WishlistButtonProps {
  product: Product
  className?: string
}

export function WishlistButton({ product, className = '' }: WishlistButtonProps) {
  const { wishlist, toggleWishlist } = useShop()
  const { user, openAuth } = useAuth()
  const wished = wishlist.some((item) => item.id === product.id)

  const onToggle = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!user) {
      setPendingWishlistProduct(product)
      openAuth({ mode: 'login', saveProductId: product.id })
      return
    }
    toggleWishlist(product)
  }

  return (
    <button
      type="button"
      className={`wishlist-heart ${wished ? 'is-active' : ''} ${className}`.trim()}
      onClick={onToggle}
      aria-pressed={wished}
      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill={wished ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
          d="M12.1 20.3 4.6 13a5.1 5.1 0 0 1 7.2-7.2l.3.3.3-.3a5.1 5.1 0 0 1 7.2 7.2l-7.5 7.3Z"
        />
      </svg>
    </button>
  )
}
