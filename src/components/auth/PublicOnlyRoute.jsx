import { Navigate, Outlet } from 'react-router-dom'
import useAuthUser from '../../hooks/useAuthUser'

export default function PublicOnlyRoute() {
  const { user, loading, error } = useAuthUser()

  if (loading) {
    return <p className="section py-10 text-muted" role="status">Checking your sign-in…</p>
  }

  if (error) {
    return <p className="section py-10 text-danger" role="alert">{error}</p>
  }

  if (user) {
    return <Navigate to="/account" replace />
  }

  return <Outlet />
}
