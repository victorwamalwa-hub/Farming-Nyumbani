import { describe, expect, it } from 'vitest'
import { validateLogin, validateRegistration } from './validation'

describe('validateLogin', () => {
  it('requires an email and password', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'Enter your email address.',
      password: 'Enter your password.',
    })
  })

  describe('validateRegistration', () => {
    it('reports all required fields', () => {
      expect(validateRegistration({ name: '', email: '', password: '', confirmPassword: '' })).toEqual({
        name: 'Enter your full name.',
        email: 'Enter your email address.',
        password: 'Enter a password.',
      })
    })

    it('checks name length, email format, password length, and confirmation', () => {
      expect(validateRegistration({
        name: 'A',
        email: 'not-an-email',
        password: 'short',
        confirmPassword: 'different',
      })).toEqual({
        name: 'Enter at least 2 characters.',
        email: 'That email address does not look right.',
        password: 'Use at least 8 characters.',
        confirmPassword: 'Passwords do not match.',
      })
    })

    it('accepts valid details and trims name and email for validation', () => {
      expect(validateRegistration({
        name: '  Amina Yusuf ',
        email: ' amina@example.com ',
        password: 'secret123',
        confirmPassword: 'secret123',
      })).toEqual({})
    })
  })

  it('trims and validates the email format', () => {
    expect(validateLogin({ email: '  not-an-email ', password: 'secret' })).toEqual({
      email: 'That email address does not look right.',
    })
    expect(validateLogin({ email: ' user@example.com ', password: 'secret' })).toEqual({})
  })

  it('accepts a missing email value and reports it as required', () => {
    expect(validateLogin({ password: 'secret' })).toEqual({
      email: 'Enter your email address.',
    })
  })
})
