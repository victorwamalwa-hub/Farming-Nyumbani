import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicOnlyRoute from './components/auth/PublicOnlyRoute'
import ErrorBoundary from './components/layout/ErrorBoundary'
import PageShell from './components/layout/PageShell'

// Route-level code splitting: each page is its own chunk.
const Home = lazy(() => import('./pages/Home'))
const BrowseFarms = lazy(() => import('./pages/BrowseFarms'))
const FarmDetail = lazy(() => import('./pages/FarmDetail'))
const CropsAndRegions = lazy(() => import('./pages/CropsAndRegions'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Account = lazy(() => import('./pages/Account'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<PageShell />}>
          <Route index element={<Home />} />
          <Route path="farms" element={<BrowseFarms />} />
          <Route path="farms/:farmId" element={<FarmDetail />} />
          <Route path="crops" element={<CropsAndRegions />} />

          {/* Signed-out visitors only: the guards bounce a signed-in user away. */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Signed-in users only: otherwise redirect to /login and come back. */}
          <Route element={<ProtectedRoute />}>
            <Route path="account" element={<Account />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}