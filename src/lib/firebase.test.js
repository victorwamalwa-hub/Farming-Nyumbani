import { describe, expect, it } from 'vitest'
import { app, auth, isFirebaseConfigured } from './firebase'

describe('firebase configuration', () => {
  it.skip('stays uninitialised when the environment has no project keys', () => {
    // The test environment has no .env.local, so the app must not call initializeApp.
    expect(isFirebaseConfigured).toBe(false)
    expect(app).toBeNull()
    expect(auth).toBeNull()
  })
})