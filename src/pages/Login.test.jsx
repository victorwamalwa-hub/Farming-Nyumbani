import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Login from './Login'

const authMocks = vi.hoisted(() => ({
  signIn: vi.fn(),
}))

vi.mock('../lib/firebase', () => ({ auth: {} }))
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: authMocks.signIn,
}))

function LocationText() {
  const location = useLocation()
  return <p>Current route: {location.pathname}</p>
}

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<LocationText />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMocks.signIn.mockResolvedValue({})
  })

  it('signs in and redirects to the account', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Email address'), 'farmer@example.com')
    await user.type(screen.getByLabelText('Password'), 'secret-pass')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(authMocks.signIn).toHaveBeenCalledWith({}, 'farmer@example.com', 'secret-pass')
    expect(await screen.findByText('Current route: /account')).toBeInTheDocument()
  })

  it('shows a readable authentication error', async () => {
    authMocks.signIn.mockRejectedValue({ code: 'auth/invalid-credential' })
    renderLogin()

    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'farmer@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-pass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.')
    await waitFor(() => expect(authMocks.signIn).toHaveBeenCalled())
  })
})
