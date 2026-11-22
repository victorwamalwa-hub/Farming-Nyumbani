import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'
import { currentLocalUser, signInLocal, signOutLocal, signUpLocal } from '../services/localAuth'
import { authErrorMessage } from '../utils/AuthErrors'

// This module intentionally exports its context consumer and display-name helper.
/* eslint react-refresh/only-export-components: off */

const NOT_CONFIGURED = 'Firebase is not configured on this device.'

const GOOGLE_NEEDS_FIREBASE =
  'Google sign-in needs Firebase keys. Create an account with your email and password instead.'

/**
 * Two modes behind one context:
 *  - "firebase": keys are present, Firebase Auth owns the session.
 *  - "local": no keys, so accounts live in this browser (services/localAuth).
 *    Pages call the same signIn/signUp/signOut functions either way.
 */
const AuthContext = createContext({
  user: null,
  initialising: false,
  isConfigured: false,
  mode: 'firebase',
  signIn: async () => {
    throw new Error(NOT_CONFIGURED)
  },
  signUp: async () => {
    throw new Error(NOT_CONFIGURED)
  },
  signInWithGoogle: async () => {
    throw new Error(NOT_CONFIGURED)
  },
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const localMode = !isFirebaseConfigured

  // Local mode restores synchronously from localStorage, so there is no window
  // where the session looks missing. Firebase starts empty and fills in on the
  // first auth event.
  const [user, setUser] = useState(() => (localMode ? currentLocalUser() : null))
  const [initialising, setInitialising] = useState(!localMode)

  useEffect(() => {
    if (localMode) return undefined

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setInitialising(false)
    })

    return unsubscribe
  }, [localMode])

  const signIn = useCallback(
    async ({ email, password }) => {
      try {
        if (localMode) {
          const nextUser = await signInLocal({ email, password })
          setUser(nextUser)
          return nextUser
        }

        const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
        return credential.user
      } catch (error) {
        throw new Error(authErrorMessage(error))
      }
    },
    [localMode],
  )

  const signUp = useCallback(
    async ({ name, email, password }) => {
      try {
        if (localMode) {
          const nextUser = await signUpLocal({ name, email, password })
          setUser(nextUser)
          return nextUser
        }

        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
        await updateProfile(credential.user, { displayName: name.trim() })
        // onAuthStateChanged fired before the profile update, so refresh the user.
        setUser(auth.currentUser)
        return auth.currentUser ?? credential.user
      } catch (error) {
        throw new Error(authErrorMessage(error))
      }
    },
    [localMode],
  )

  const signInWithGoogle = useCallback(async () => {
    if (localMode) throw new Error(GOOGLE_NEEDS_FIREBASE)

    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider())
      return credential.user
    } catch (error) {
      throw new Error(authErrorMessage(error))
    }
  }, [localMode])

  const signOut = useCallback(async () => {
    try {
      if (localMode) {
        signOutLocal()
        setUser(null)
        return
      }

      await firebaseSignOut(auth)
    } catch (error) {
      throw new Error(authErrorMessage(error))
    }
  }, [localMode])

  const value = useMemo(
    () => ({
      user,
      initialising,
      isConfigured: isFirebaseConfigured,
      mode: localMode ? 'local' : 'firebase',
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [user, initialising, localMode, signIn, signUp, signInWithGoogle, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

/** Display name for the signed-in account, with sensible fallbacks. */
export function accountName(user) {
  if (!user) return ''
  if (user.displayName) return user.displayName
  if (user.email) return user.email.split('@')[0]
  return 'Account holder'
}