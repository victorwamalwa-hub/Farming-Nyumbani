import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Account from './Account'

const authMocks = vi.hoisted(() => ({
  currentUser: null,
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('../lib/firebase', () => ({
  auth: {
    get currentUser() {
      return authMocks.currentUser
    },
  },
}))
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: authMocks.onAuthStateChanged,
  signOut: authMocks.signOut,
}))

describe('Account', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMocks.currentUser = { displayName: 'Amina Farmer', email: 'amina@example.com' }
    authMocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(authMocks.currentUser)
      return vi.fn()
    })
    authMocks.signOut.mockResolvedValue()
  })

  it('shows the signed-in user and account links', () => {
    render(<MemoryRouter><Account /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Welcome, Amina Farmer' })).toBeInTheDocument()
    expect(screen.getByText('amina@example.com')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse farms' })).toHaveAttribute('href', '/farms')
  })

  it('signs out the current user', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><Account /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(authMocks.signOut).toHaveBeenCalledWith({
      currentUser: authMocks.currentUser,
    })
  })

  it('prompts signed-out visitors to sign in', () => {
    authMocks.currentUser = null
    render(<MemoryRouter><Account /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Sign in to your account' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
  })
})
