import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../ui/Spinner'

export default function PublicOnlyRoute() {
  const { user, initialising } = useAuth()

  if (initialising) return <Spinner label="Checking your session" />

  if (user) return <Navigate to="/account" replace />

  return <Outlet />
}