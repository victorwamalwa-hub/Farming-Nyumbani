import { describe, expect, it } from 'vitest'
import { validateLogin } from './validation'

describe('validateLogin', () => {
  it('requires an email and password', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'Enter your email address.',
      password: 'Enter your password.',
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
