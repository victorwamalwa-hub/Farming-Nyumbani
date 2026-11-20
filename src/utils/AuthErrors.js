const MESSAGES = {
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/user-not-found': 'Email or password is incorrect.',
  'auth/invalid-email': 'That email address does not look right.',
  'auth/email-already-in-use': 'An account already uses that email. Try signing in instead.',
  'auth/weak-password': 'Use at least 8 characters for your password.',
  'auth/missing-password': 'Enter your password.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/popup-closed-by-user': 'Google sign-in was closed before it finished. Try again.',
  'auth/popup-blocked': 'Your browser blocked the Google pop-up. Allow pop-ups and try again.',
  'auth/cancelled-popup-request': 'Another sign-in window is already open.',
  'auth/too-many-requests': 'Too many attempts. Wait a minute and try again.',
  'auth/network-request-failed': 'Network problem. Check your connection and try again.',
  'auth/operation-not-allowed': 'That sign-in method is not enabled in Firebase yet.',
  'auth/unauthorized-domain': 'This domain is not authorised in the Firebase console.',
}

/**
 * Turns a Firebase error into something a farmer can act on. Raw codes never
 * reach the UI.
 */
export function authErrorMessage(error) {
  if (error?.code && MESSAGES[error.code]) return MESSAGES[error.code]
  if (error?.code?.startsWith('auth/')) return 'That sign-in attempt did not work. Please try again.'
  if (error?.message) return error.message
  return 'Something went wrong. Please try again.'
}