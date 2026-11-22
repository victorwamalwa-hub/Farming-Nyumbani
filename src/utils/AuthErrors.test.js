import { describe, expect, it } from 'vitest'
import { authErrorMessage } from './AuthErrors'

describe('authErrorMessage', () => {
  it('maps a known Firebase code to plain English', () => {
    expect(authErrorMessage({ code: 'auth/invalid-credential' })).toBe('Email or password is incorrect.')
  })

  it('uses the same sentence for wrong-password and user-not-found', () => {
    const wrong = authErrorMessage({ code: 'auth/wrong-password' })
    const missing = authErrorMessage({ code: 'auth/user-not-found' })
    expect(wrong).toBe(missing)
    expect(wrong).toBe('Email or password is incorrect.')
  })

  it('falls back to a retry sentence for an unknown auth/* code', () => {
    expect(authErrorMessage({ code: 'auth/some-new-code' })).toBe(
      'That sign-in attempt did not work. Please try again.',
    )
  })

  it('uses a non-auth Error message as-is', () => {
    expect(authErrorMessage(new Error('Storage quota exceeded'))).toBe('Storage quota exceeded')
  })

  it('returns a safe sentence for a null error', () => {
    expect(authErrorMessage(null)).toBe('Something went wrong. Please try again.')
  })

  it('never returns an empty string or undefined for any input', () => {
    const inputs = [null, undefined, {}, { code: 'auth/x' }, new Error('boom'), { code: 'other' }]
    for (const input of inputs) {
      const message = authErrorMessage(input)
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    }
  })

  it('maps each documented code to a non-empty sentence', () => {
    const codes = [
      'auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found',
      'auth/invalid-email', 'auth/email-already-in-use', 'auth/weak-password',
      'auth/missing-password', 'auth/user-disabled', 'auth/popup-closed-by-user',
      'auth/popup-blocked', 'auth/cancelled-popup-request', 'auth/too-many-requests',
      'auth/network-request-failed', 'auth/operation-not-allowed', 'auth/unauthorized-domain',
    ]
    for (const code of codes) {
      const message = authErrorMessage({ code })
      expect(message, code).toBeTruthy()
      expect(message).not.toBe('That sign-in attempt did not work. Please try again.')
    }
  })
})