import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export function Snackbar() {
  const { snackbar, dismissSnackbar, openCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  if (!snackbar) return null

  const viewCart = () => {
    if (location.pathname.startsWith('/customer')) {
      navigate('/customer/cart')
      dismissSnackbar()
      return
    }
    openCart()
  }

  return (
    <div
      className="fixed bottom-5 left-1/2 z-[70] flex min-w-[min(420px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl"
      role="status"
      aria-live="polite"
    >
      <span className="min-w-0 flex-1">{snackbar}</span>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="font-bold text-violet-300 hover:text-violet-200"
          onClick={viewCart}
        >
          View cart
        </button>
        <button
          type="button"
          className="px-1 text-lg leading-none text-slate-400 hover:text-white"
          onClick={dismissSnackbar}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}
