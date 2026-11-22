import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../ui/Spinner'

export default function ProtectedRoute() {
  const { user, initialising } = useAuth()
  const location = useLocation()

  // Never redirect while the session is still being restored: that is the
  // "flash of login page" bug on refresh.
  if (initialising) return <Spinner label="Checking your session" />

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}