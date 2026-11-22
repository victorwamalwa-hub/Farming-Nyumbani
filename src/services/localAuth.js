/**
 * Accounts for the no-Firebase mode.
 *
 * The project is built on Firebase Auth, but sign-in has to work on a machine
 * with no keys as well: local development, a reviewer opening the deployed
 * build, the test suite. When .env.local is empty this module keeps accounts in
 * localStorage - one record per email, a random salt per account, and a
 * SHA-256 hash of salt + password. It is not a security boundary (anyone with
 * the browser profile can read or replace the store); Firestore and its rules
 * stay the real backend whenever keys are present.
 *
 * The four exported calls mirror what AuthContext needs from Firebase, and the
 * errors carry Firebase-style codes so authErrorMessage() maps them to the same
 * human sentences in both modes.
 */

const ACCOUNTS_KEY = 'farming-nyumbani:accounts:v1'
const SESSION_KEY = 'farming-nyumbani:session:v1'

const WRITE_ERROR =
  'This browser refused to save your account. Storage may be full, or blocked in private mode - free some space and try again.'
const NO_STORAGE = 'This browser is blocking local storage, so accounts cannot be saved here.'

function storage() {
  if (typeof window === 'undefined' || !window.localStorage) return null
  return window.localStorage
}

function randomHex(byteCount) {
  const values = new Uint8Array(byteCount)
  globalThis.crypto.getRandomValues(values)
  return Array.from(values, (value) => value.toString(16).padStart(2, '0')).join('')
}

function sha256Hex(text) {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    return Promise.reject(
      new Error('This browser cannot store passwords safely here. Use a current browser, or add Firebase keys to .env.local.'),
    )
  }

  return subtle.digest('SHA-256', new TextEncoder().encode(text)).then((digest) =>
    Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join(''),
  )
}

function authError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

function readAccounts() {
  const store = storage()
  if (!store) return []

  try {
    const parsed = JSON.parse(store.getItem(ACCOUNTS_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Corrupt payload: treat it as no accounts rather than crash the form.
    return []
  }
}

function writeAccounts(accounts) {
  const store = storage()
  if (!store) throw new Error(NO_STORAGE)

  const payload = JSON.stringify(accounts)

  try {
    store.setItem(ACCOUNTS_KEY, payload)
    // Some browsers accept setItem and then drop the value; read it back.
    if (store.getItem(ACCOUNTS_KEY) !== payload) throw new Error(WRITE_ERROR)
  } catch {
    throw new Error(WRITE_ERROR)
  }
}

function saveSession(uid) {
  const store = storage()
  if (!store) throw new Error(NO_STORAGE)

  try {
    store.setItem(SESSION_KEY, uid)
    if (store.getItem(SESSION_KEY) !== uid) throw new Error(WRITE_ERROR)
  } catch {
    throw new Error(WRITE_ERROR)
  }
}

/** Firebase-shaped user, so pages read the same fields in both modes. */
function toUser(account) {
  return {
    uid: account.uid,
    email: account.email,
    displayName: account.displayName,
    providerData: [{ providerId: 'password' }],
    metadata: {
      creationTime: new Date(account.createdAt).toISOString(),
    },
  }
}

/** The account signed in on this device, or null. */
export function currentLocalUser() {
  const store = storage()
  if (!store) return null

  try {
    const uid = store.getItem(SESSION_KEY)
    if (!uid) return null

    const account = readAccounts().find((item) => item.uid === uid)
    return account ? toUser(account) : null
  } catch {
    return null
  }
}

export async function signUpLocal({ name, email, password }) {
  const accounts = readAccounts()
  const normalisedEmail = String(email).trim().toLowerCase()

  if (accounts.some((account) => account.email === normalisedEmail)) {
    throw authError('auth/email-already-in-use', 'An account already uses that email. Try signing in instead.')
  }

  const salt = randomHex(16)
  const account = {
    uid: `local_${randomHex(8)}`,
    email: normalisedEmail,
    displayName: String(name).trim(),
    salt,
    passwordHash: await sha256Hex(`${salt}:${password}`),
    createdAt: Date.now(),
  }

  writeAccounts([...accounts, account])
  saveSession(account.uid)
  return toUser(account)
}

export async function signInLocal({ email, password }) {
  const normalisedEmail = String(email).trim().toLowerCase()
  const account = readAccounts().find((item) => item.email === normalisedEmail)

  if (!account) throw authError('auth/user-not-found', 'Email or password is incorrect.')

  const hash = await sha256Hex(`${account.salt}:${password}`)
  if (hash !== account.passwordHash) {
    throw authError('auth/wrong-password', 'Email or password is incorrect.')
  }

  saveSession(account.uid)
  return toUser(account)
}

export function signOutLocal() {
  const store = storage()
  if (!store) return

  try {
    store.removeItem(SESSION_KEY)
  } catch {
    // Storage is unavailable; the React state is cleared by the caller anyway.
  }
}