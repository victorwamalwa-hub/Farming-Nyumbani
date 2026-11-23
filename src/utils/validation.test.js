import { describe, expect, it } from 'vitest'
import {
  LEASE_REPORT_REASONS,
  validateLeaseRequest,
  validateLogin,
  validateRegistration,
  validateReport,
} from './validation'

describe('validateLogin', () => {
  it('requires an email and password', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'Enter your email address.',
      password: 'Enter your password.',
    })
  })

  describe('validateLeaseRequest', () => {
    it('requires a name, crop plan, and a message of at least 10 characters', () => {
      expect(validateLeaseRequest({ name: ' ', crops: '', message: 'hi' })).toEqual({
        name: 'Tell the owner who is asking.',
        crops: 'Say what you plan to grow.',
        message: 'Use at least 10 characters.',
      })
    })

    it('accepts a complete request', () => {
      expect(validateLeaseRequest({
        name: 'Amina',
        crops: 'maize',
        message: 'I would like to lease this farm.',
      })).toEqual({})
    })

    it('enforces Firestore field length limits', () => {
      expect(validateLeaseRequest({
        name: 'A'.repeat(41),
        crops: 'c'.repeat(81),
        message: 'm'.repeat(501),
      })).toEqual({
        name: 'Keep your name under 40 characters.',
        crops: 'Keep your crop plan under 80 characters.',
        message: 'Keep your message under 500 characters.',
      })
    })
  })

  describe('validateReport', () => {
    it('requires a listed reason and caps the optional note at 300 characters', () => {
      expect(validateReport({ reason: 'not-listed', note: 'x'.repeat(301) })).toEqual({
        reason: 'Choose one of the listed reasons.',
        note: 'Keep the note under 300 characters.',
      })
    })

    it('accepts a listed reason and note within the limit', () => {
      expect(validateReport({ reason: LEASE_REPORT_REASONS[0], note: 'Please verify this location.' })).toEqual({})
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
