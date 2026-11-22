import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'

const authState = vi.hoisted(() => ({
  value: { user: null, initialising: false },
}))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => authState.value,
}))

function CurrentLocation() {
  const location = useLocation()
  return <p>Login redirect: {location.state?.from?.pathname}</p>
}

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/account']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<p>Protected area</p>} />
        </Route>
        <Route path="/login" element={<CurrentLocation />} />
      </Routes>
    </MemoryRouter>,
  )
}

function renderPublicOnlyRoute() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<p>Public sign-in page</p>} />
        </Route>
        <Route path="/account" element={<p>Account page</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('route guards', () => {
  beforeEach(() => {
    authState.value = { user: null, initialising: false }
  })

  it('redirects signed-out visitors to login and remembers the requested path', () => {
    renderProtectedRoute()
    expect(screen.getByText('Login redirect: /account')).toBeInTheDocument()
  })

  it('renders protected content for signed-in visitors', () => {
    authState.value = { user: { uid: 'user-1' }, initialising: false }
    renderProtectedRoute()
    expect(screen.getByText('Protected area')).toBeInTheDocument()
  })

  it('redirects signed-in visitors away from public-only pages', () => {
    authState.value = { user: { uid: 'user-1' }, initialising: false }
    renderPublicOnlyRoute()
    expect(screen.getByText('Account page')).toBeInTheDocument()
  })

  it('shows a loading status while authentication is initialising', () => {
    authState.value = { user: null, initialising: true }
    renderProtectedRoute()
    expect(screen.getByRole('status')).toHaveTextContent('Checking your session')
  })
})
