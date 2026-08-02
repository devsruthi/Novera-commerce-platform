import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'
import { homePathForRole } from '../services/authService'

/** Guards private areas and enforces role-based access. */
export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-stone-50 text-stone-500">
        Loading session…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />
  }

  return <Outlet />
}
