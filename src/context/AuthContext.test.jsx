import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  auth: { currentUser: null },
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  emit: null,
}))

vi.mock('../lib/firebase', () => ({ auth: mocks.auth, isFirebaseConfigured: true }))
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: mocks.onAuthStateChanged,
  signInWithEmailAndPassword: mocks.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: mocks.createUserWithEmailAndPassword,
  updateProfile: mocks.updateProfile,
  signInWithPopup: mocks.signInWithPopup,
  signOut: mocks.signOut,
  GoogleAuthProvider: vi.fn(),
}))

const { AuthProvider, useAuth } = await import('./AuthContext')

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

beforeEach(() => {
  vi.clearAllMocks()
  mocks.auth.currentUser = null
  mocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
    mocks.emit = callback
    return vi.fn()
  })
})

describe('AuthProvider', () => {
  it('waits for the first auth event, then exposes the session', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.initialising).toBe(true)

    act(() => {
      mocks.emit({ displayName: 'Wanjiku Mwangi', email: 'wanjiku@example.com' })
    })

    expect(result.current.initialising).toBe(false)
    expect(result.current.user.displayName).toBe('Wanjiku Mwangi')
  })

  it('signs in with a trimmed email and returns the user', async () => {
    mocks.signInWithEmailAndPassword.mockResolvedValue({ user: { email: 'w@example.com' } })
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const user = await result.current.signIn({ email: '  w@example.com ', password: 'secret123' })
      expect(user.email).toBe('w@example.com')
    })

    expect(mocks.signInWithEmailAndPassword).toHaveBeenCalledWith(mocks.auth, 'w@example.com', 'secret123')
  })

  it('turns a Firebase error into a readable message', async () => {
    mocks.signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' })
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await expect(result.current.signIn({ email: 'w@example.com', password: 'nope' })).rejects.toThrow(
        'Email or password is incorrect.',
      )
    })
  })

  it('sets the display name when registering', async () => {
    const firebaseUser = { uid: 'u1', email: 'amina@example.com', displayName: null }
    mocks.createUserWithEmailAndPassword.mockResolvedValue({ user: firebaseUser })
    mocks.updateProfile.mockResolvedValue(undefined)
    mocks.auth.currentUser = { ...firebaseUser, displayName: 'Amina Yusuf' }

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.signUp({ name: 'Amina Yusuf', email: 'amina@example.com', password: 'secret123' })
    })

    expect(mocks.updateProfile).toHaveBeenCalledWith(firebaseUser, { displayName: 'Amina Yusuf' })
    expect(result.current.user.displayName).toBe('Amina Yusuf')
  })

  it('signs out through Firebase', async () => {
    mocks.signOut.mockResolvedValue(undefined)
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.signOut()
    })

    expect(mocks.signOut).toHaveBeenCalledWith(mocks.auth)
  })

  it('opens a Google popup', async () => {
    mocks.signInWithPopup.mockResolvedValue({ user: { email: 'g@example.com' } })
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const user = await result.current.signInWithGoogle()
      expect(user.email).toBe('g@example.com')
    })

    expect(mocks.signInWithPopup).toHaveBeenCalledTimes(1)
  })
})