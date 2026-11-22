import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const authState = vi.hoisted(() => ({ current: { user: null, initialising: false } }))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => authState.current,
}))

const { default: ProtectedRoute } = await import('./ProtectedRoute')

function renderGuard() {
  return render(
    <MemoryRouter initialEntries={['/account']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<p>account page</p>} />
        </Route>
        <Route path="/login" element={<p>login page</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  authState.current = { user: null, initialising: false }
})

describe('ProtectedRoute', () => {
  it('shows a spinner while the session is restoring', () => {
    authState.current = { user: null, initialising: true }
    renderGuard()

    expect(screen.getByRole('status')).toHaveTextContent('Checking your session')
    expect(screen.queryByText('account page')).not.toBeInTheDocument()
  })

  it('redirects signed-out visitors to the login page', () => {
    renderGuard()

    expect(screen.getByText('login page')).toBeInTheDocument()
    expect(screen.queryByText('account page')).not.toBeInTheDocument()
  })

  it('renders the protected page for a signed-in user', () => {
    authState.current = { user: { uid: 'u1', email: 'w@example.com' }, initialising: false }
    renderGuard()

    expect(screen.getByText('account page')).toBeInTheDocument()
  })
})