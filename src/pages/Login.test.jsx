import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const authMocks = vi.hoisted(() => ({
  signIn: vi.fn(),
  mode: 'firebase',
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ signIn: authMocks.signIn, mode: authMocks.mode }),
  AuthProvider: ({ children }) => children,
}))

const { default: Login } = await import('./Login')

function LocationText() {
  const location = useLocation()
  return <p>Current route: {location.pathname}</p>
}

function renderLogin(initialEntries = ['/login']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<LocationText />} />
        <Route path="/farms/:id" element={<LocationText />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMocks.mode = 'firebase'
    authMocks.signIn.mockResolvedValue({ email: 'farmer@example.com' })
  })

  it('signs in and redirects to /account', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email address'), 'farmer@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret-pass')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(authMocks.signIn).toHaveBeenCalledWith({
      email: 'farmer@example.com',
      password: 'secret-pass',
    })
    expect(await screen.findByText('Current route: /account')).toBeInTheDocument()
  })

  it('returns to the farm page a signed-out visitor came from', async () => {
    const user = userEvent.setup()
    renderLogin([
      { pathname: '/login', state: { from: { pathname: '/farms/kiambu-ngoliba-tomato-block' } } },
    ])

    await user.type(screen.getByLabelText('Email address'), 'farmer@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret-pass')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(
      await screen.findByText('Current route: /farms/kiambu-ngoliba-tomato-block'),
    ).toBeInTheDocument()
  })

  it('shows field errors on empty submit without calling signIn', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('Enter your email address.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
    expect(authMocks.signIn).not.toHaveBeenCalled()
  })

  it('rejects an invalid email format before calling signIn', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email address'), 'not-an-email')
    await user.type(screen.getByLabelText('Password'), 'secret-pass')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByText('That email address does not look right.')).toBeInTheDocument()
    expect(authMocks.signIn).not.toHaveBeenCalled()
  })

  it('shows the mapped message when sign-in fails', async () => {
    authMocks.signIn.mockRejectedValue(new Error('Email or password is incorrect.'))
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email address'), 'farmer@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrong-pass')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Email or password is incorrect.')
  })

  it('hides the Google button in local mode', () => {
    authMocks.mode = 'local'
    renderLogin()

    expect(screen.queryByRole('button', { name: /Google/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/or continue with/i)).not.toBeInTheDocument()
  })
})
