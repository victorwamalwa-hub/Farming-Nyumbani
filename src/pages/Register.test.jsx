import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Register from './Register'

const authMocks = vi.hoisted(() => ({
  createUser: vi.fn(),
  updateProfile: vi.fn(),
}))

vi.mock('../lib/firebase', () => ({ auth: {} }))
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: authMocks.createUser,
  updateProfile: authMocks.updateProfile,
}))

function renderRegister() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<h1>Account page</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMocks.createUser.mockResolvedValue({ user: { uid: 'user-1' } })
    authMocks.updateProfile.mockResolvedValue()
  })

  it('creates an account and saves the display name', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByLabelText('Your name'), 'Amina Farmer')
    await user.type(screen.getByLabelText('Email address'), 'amina@example.com')
    await user.type(screen.getByLabelText('Password'), 'secure-pass')
    await user.type(screen.getByLabelText('Confirm password'), 'secure-pass')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(authMocks.createUser).toHaveBeenCalledWith({}, 'amina@example.com', 'secure-pass')
    expect(authMocks.updateProfile).toHaveBeenCalledWith(
      { uid: 'user-1' },
      { displayName: 'Amina Farmer' },
    )
    expect(await screen.findByRole('heading', { name: 'Account page' })).toBeInTheDocument()
  })

  it('does not submit when passwords do not match', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByLabelText('Your name'), 'Amina Farmer')
    await user.type(screen.getByLabelText('Email address'), 'amina@example.com')
    await user.type(screen.getByLabelText('Password'), 'secure-pass')
    await user.type(screen.getByLabelText('Confirm password'), 'different-pass')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match.')
    expect(authMocks.createUser).not.toHaveBeenCalled()
  })
})
