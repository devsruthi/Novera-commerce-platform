import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface SignOutModalProps {
  open: boolean
  onClose: () => void
}

export function SignOutModal({ open, onClose }: SignOutModalProps) {
  const { user, signOut } = useAuth()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !user) return null

  const confirm = () => {
    signOut()
    onClose()
  }

  return (
    <div className="modal-backdrop auth-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal signout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signout-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="signout-title">Sign out?</h2>
        <p className="modal-copy">
          You’re signed in as <strong>{user.email}</strong>. Sign out of Styla on this
          device?
        </p>
        <div className="signout-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="solid-btn" onClick={confirm}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
