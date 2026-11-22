import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthUser from '../../hooks/useAuthUser'

export default function ProtectedRoute() {
  const { user, loading, error } = useAuthUser()
  const location = useLocation()

  if (loading) {
    return <p className="section py-10 text-muted" role="status">Checking your sign-in…</p>
  }

  if (error) {
    return <p className="section py-10 text-danger" role="alert">{error}</p>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
