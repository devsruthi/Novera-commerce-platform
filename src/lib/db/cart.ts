/**
 * Cart persistence — Phase 2 carts + cart_lines (FK to products).
 * Re-exports the service API so existing CartContext keeps working.
 */
export {
  fetchCartItems,
  upsertCartItem,
  setCartItemQuantity,
  removeCartItem,
  clearCartItems,
  replaceCartItems,
} from '../../services/cartService'

export type { PaymentMethod } from '../../types'
