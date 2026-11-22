import { createElement } from 'react'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// No keys on this device: the provider must fall back to local accounts.
vi.mock('../lib/firebase', () => ({ auth: null, isFirebaseConfigured: false }))

const { AuthProvider, useAuth } = await import('./AuthContext')

const wrapper = ({ children }) => createElement(AuthProvider, null, children)

describe('AuthProvider without Firebase keys', () => {
  it('starts signed out in local mode without waiting on Firebase', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.mode).toBe('local')
    expect(result.current.isConfigured).toBe(false)
    expect(result.current.initialising).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('signs up, restores the session in a new provider, then signs out', async () => {
    const first = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await first.result.current.signUp({
        name: 'Amina Yusuf',
        email: 'amina@example.com',
        password: 'secret123',
      })
    })

    expect(first.result.current.user.displayName).toBe('Amina Yusuf')
    first.unmount()

    // A reload: fresh provider, same browser.
    const second = renderHook(() => useAuth(), { wrapper })
    expect(second.result.current.user.email).toBe('amina@example.com')

    await act(async () => {
      await second.result.current.signOut()
    })
    expect(second.result.current.user).toBeNull()
  })

  it('signs in with an existing local account and reports a wrong password', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.signUp({
        name: 'Amina Yusuf',
        email: 'amina@example.com',
        password: 'secret123',
      })
      await result.current.signOut()
    })

    await act(async () => {
      const user = await result.current.signIn({
        email: 'amina@example.com',
        password: 'secret123',
      })
      expect(user.displayName).toBe('Amina Yusuf')
    })
    expect(result.current.user.email).toBe('amina@example.com')

    await act(async () => {
      await expect(
        result.current.signIn({ email: 'amina@example.com', password: 'wrong-one' }),
      ).rejects.toThrow('Email or password is incorrect.')
    })
  })

  it('refuses Google sign-in instead of pretending it worked', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await expect(result.current.signInWithGoogle()).rejects.toThrow(
        'Google sign-in needs Firebase keys',
      )
    })
  })
})