import { useCart } from '../context/CartContext'

export function Snackbar() {
  const { snackbar, dismissSnackbar, openCart } = useCart()

  if (!snackbar) return null

  return (
    <div className="snackbar" role="status" aria-live="polite">
      <span>{snackbar}</span>
      <div className="snackbar-actions">
        <button type="button" className="snackbar-link" onClick={openCart}>
          View cart
        </button>
        <button
          type="button"
          className="snackbar-dismiss"
          onClick={dismissSnackbar}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}
