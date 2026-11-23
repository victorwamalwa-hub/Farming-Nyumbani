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
