import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const authMocks = vi.hoisted(() => ({
  signUp: vi.fn(),
  mode: 'firebase',
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ signUp: authMocks.signUp, mode: authMocks.mode }),
  AuthProvider: ({ children }) => children,
}))

const { default: Register } = await import('./Register')

function LocationText() {
  const location = useLocation()
  return <p>Current route: {location.pathname}</p>
}

function renderRegister(initialEntries = ['/register']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<LocationText />} />
        <Route path="/login" element={<LocationText />} />
      </Routes>
    </MemoryRouter>,
  )
}

async function fillRegistration(user, { name = 'Amina Farmer', email = 'amina@example.com', password = 'secure-pass', confirmPassword = password } = {}) {
  await user.type(screen.getByLabelText('Your name'), name)
  await user.type(screen.getByLabelText('Email address'), email)
  await user.type(screen.getByLabelText('Password'), password)
  await user.type(screen.getByLabelText('Confirm password'), confirmPassword)
}

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMocks.mode = 'firebase'
    authMocks.signUp.mockResolvedValue({ uid: 'user-1' })
  })

  it('creates an account and redirects to /account', async () => {
    const user = userEvent.setup()
    renderRegister()
    await fillRegistration(user)

    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(authMocks.signUp).toHaveBeenCalledWith({
      name: 'Amina Farmer',
      email: 'amina@example.com',
      password: 'secure-pass',
    })
    expect(await screen.findByText('Current route: /account')).toBeInTheDocument()
  })

  it('validates a name that is too short before signing up', async () => {
    const user = userEvent.setup()
    renderRegister()
    await fillRegistration(user, { name: 'A' })

    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('Enter at least 2 characters.')).toBeInTheDocument()
    expect(authMocks.signUp).not.toHaveBeenCalled()
  })

  it('validates email format before signing up', async () => {
    const user = userEvent.setup()
    renderRegister()
    await fillRegistration(user, { email: 'not-an-email' })

    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('That email address does not look right.')).toBeInTheDocument()
    expect(authMocks.signUp).not.toHaveBeenCalled()
  })

  it('validates password length before signing up', async () => {
    const user = userEvent.setup()
    renderRegister()
    await fillRegistration(user, { password: 'short', confirmPassword: 'short' })

    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('Use at least 8 characters.')).toBeInTheDocument()
    expect(authMocks.signUp).not.toHaveBeenCalled()
  })

  it('validates matching passwords before signing up', async () => {
    const user = userEvent.setup()
    renderRegister()
    await fillRegistration(user, { confirmPassword: 'different-pass' })

    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument()
    expect(authMocks.signUp).not.toHaveBeenCalled()
  })

  it('offers sign-in after a duplicate email error', async () => {
    authMocks.signUp.mockRejectedValue(
      new Error('An account already uses that email. Try signing in instead.'),
    )
    const user = userEvent.setup()
    renderRegister()
    await fillRegistration(user)

    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'An account already uses that email. Try signing in instead.',
    )
    expect(screen.getByRole('link', { name: 'Sign in to your account' })).toHaveAttribute('href', '/login')
  })

  it('shows local mode notice and hides Google sign-in in local mode', () => {
    authMocks.mode = 'local'
    renderRegister()

    expect(screen.getByRole('status')).toHaveTextContent('Local accounts are on.')
    expect(screen.queryByRole('button', { name: /Google/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/or continue with/i)).not.toBeInTheDocument()
  })
})
