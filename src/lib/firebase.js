import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

/**
 * Firebase is configured through .env.local (see .env.example). The web config
 * is public by design - Firestore security rules and Auth authorised domains,
 * not key secrecy, are the real access control.
 *
 * If the keys are missing the app must still run: sign-in surfaces a setup
 * notice instead of crashing on import. That keeps local development and the
 * test suite working without a Firebase project.
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const REQUIRED_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId']

export const isFirebaseConfigured = REQUIRED_KEYS.every((key) => Boolean(config[key]))

let app = null
let auth = null
let db = null

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(config)
  auth = getAuth(app)
  db = getFirestore(app)
}

export { app, auth, db }