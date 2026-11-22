const ACCOUNTS_KEY = 'farming-nyumbani:local-accounts'
const SESSION_KEY = 'farming-nyumbani:local-session'
const ITERATIONS = 120_000

function getAccounts() {
  const raw = localStorage.getItem(ACCOUNTS_KEY)
  if (!raw) return []

  const accounts = JSON.parse(raw)
  if (!Array.isArray(accounts)) {
    throw new Error('Local account data is invalid. Clear this browser’s stored site data and try again.')
  }
  return accounts
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function publicUser(account) {
  return {
    uid: account.uid,
    email: account.email,
    displayName: account.displayName,
  }
}

function toHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: Uint8Array.from(salt.match(/.{2}/g), (byte) => Number.parseInt(byte, 16)),
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    256,
  )
  return toHex(bits)
}

function newSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return toHex(bytes)
}

function validateCredentials({ email, password }) {
  if (typeof email !== 'string' || !email.trim()) {
    throw new Error('Enter your email address.')
  }
  if (typeof password !== 'string' || !password) {
    throw new Error('Enter your password.')
  }
}

export function currentLocalUser() {
  const email = localStorage.getItem(SESSION_KEY)
  if (!email) return null

  const account = getAccounts().find((item) => item.email === email)
  if (!account) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }

  return publicUser(account)
}

export async function signUpLocal({ name, email, password }) {
  validateCredentials({ email, password })
  if (password.length < 8) {
    throw new Error('Use at least 8 characters for your password.')
  }
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error('Enter your name.')
  }

  const normalizedEmail = email.trim().toLowerCase()
  const accounts = getAccounts()
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account already uses that email. Try signing in instead.')
  }

  const salt = newSalt()
  const account = {
    uid: crypto.randomUUID(),
    email: normalizedEmail,
    displayName: name.trim(),
    salt,
    passwordHash: await hashPassword(password, salt),
  }

  saveAccounts([...accounts, account])
  localStorage.setItem(SESSION_KEY, normalizedEmail)
  return publicUser(account)
}

export async function signInLocal({ email, password }) {
  validateCredentials({ email, password })

  const normalizedEmail = email.trim().toLowerCase()
  const account = getAccounts().find((item) => item.email === normalizedEmail)
  if (!account || (await hashPassword(password, account.salt)) !== account.passwordHash) {
    throw new Error('Email or password is incorrect.')
  }

  localStorage.setItem(SESSION_KEY, normalizedEmail)
  return publicUser(account)
}

export function signOutLocal() {
  localStorage.removeItem(SESSION_KEY)
}
