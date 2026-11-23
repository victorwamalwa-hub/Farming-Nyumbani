/**
 * Client-side validation for sign-in so invalid forms never reach the backend.
 * Returns field messages; an empty object means the input is valid.
 */
export function validateLogin({ email, password }) {
  const errors = {}
  const trimmed = String(email ?? '').trim()
  if (!trimmed) errors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    errors.email = 'That email address does not look right.'
  }
  if (!password) errors.password = 'Enter your password.'
  return errors
}

export function validateRegistration({ name, email, password, confirmPassword }) {
  const errors = {}
  const trimmedName = String(name ?? '').trim()
  const trimmedEmail = String(email ?? '').trim()

  if (!trimmedName) errors.name = 'Enter your full name.'
  else if (trimmedName.length < 2) errors.name = 'Enter at least 2 characters.'

  if (!trimmedEmail) errors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'That email address does not look right.'
  }

  if (!password) errors.password = 'Enter a password.'
  else if (password.length < 8) errors.password = 'Use at least 8 characters.'

  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.'

  return errors
}
