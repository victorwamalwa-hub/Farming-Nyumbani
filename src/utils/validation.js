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

export const LEASE_REPORT_REASONS = [
  'Wrong county or location',
  'Rent or size looks wrong',
  'Owner details look wrong',
  'Listing looks fake or duplicated',
  'Other',
]

export function validateLeaseRequest({ name, crops, message }) {
  const errors = {}
  const trimmedName = String(name ?? '').trim()
  const trimmedCrops = String(crops ?? '').trim()
  const trimmedMessage = String(message ?? '').trim()

  if (!trimmedName) errors.name = 'Tell the owner who is asking.'
  else if (trimmedName.length < 2) errors.name = 'Use at least 2 characters.'
  else if (trimmedName.length > 40) errors.name = 'Keep your name under 40 characters.'

  if (!trimmedCrops) errors.crops = 'Say what you plan to grow.'
  else if (trimmedCrops.length > 80) errors.crops = 'Keep your crop plan under 80 characters.'

  if (!trimmedMessage) errors.message = 'Add a short message for the owner.'
  else if (trimmedMessage.length < 10) errors.message = 'Use at least 10 characters.'
  else if (trimmedMessage.length > 500) errors.message = 'Keep your message under 500 characters.'

  return errors
}

export function validateReport({ reason, note }) {
  const errors = {}
  const trimmedReason = String(reason ?? '').trim()
  const trimmedNote = String(note ?? '').trim()

  if (!trimmedReason) errors.reason = 'Choose a reason for the report.'
  else if (!LEASE_REPORT_REASONS.includes(trimmedReason)) {
    errors.reason = 'Choose one of the listed reasons.'
  }

  if (trimmedNote.length > 300) errors.note = 'Keep the note under 300 characters.'

  return errors
}
