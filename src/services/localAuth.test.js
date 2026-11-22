import { afterEach, describe, expect, it, vi } from 'vitest'
import { authErrorMessage } from '../utils/AuthErrors'
import { currentLocalUser, signInLocal, signOutLocal, signUpLocal } from './localAuth'

const ACCOUNT = { name: 'Amina Yusuf', email: 'amina@example.com', password: 'secret123' }

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

describe('localAuth', () => {
    it('creates an account, keeps the session and signs back in', async () => {
        const created = await signUpLocal(ACCOUNT)

        expect(created.email).toBe('amina@example.com')
        expect(created.displayName).toBe('Amina Yusuf')
        expect(created.providerData[0].providerId).toBe('password')
        expect(currentLocalUser()?.uid).toBe(created.uid)

        signOutLocal()
        expect(currentLocalUser()).toBeNull()

        const signedIn = await signInLocal({ email: '  AMINA@example.com ', password: 'secret123' })
        expect(signedIn.uid).toBe(created.uid)
        expect(currentLocalUser()?.email).toBe('amina@example.com')
    })

    it('never stores the password itself', async () => {
        await signUpLocal(ACCOUNT)

        const raw = window.localStorage.getItem('farming-nyumbani:accounts:v1')
        expect(raw).not.toContain('secret123')
    })

    it('rejects a second account on the same email', async () => {
        await signUpLocal(ACCOUNT)

        const error = await signUpLocal(ACCOUNT).catch((caught) => caught)
        expect(error.code).toBe('auth/email-already-in-use')
        expect(authErrorMessage(error)).toBe('An account already uses that email. Try signing in instead.')
    })

    it('rejects a wrong password and an unknown email with the same message', async () => {
        await signUpLocal(ACCOUNT)

        const wrongPassword = await signInLocal({ email: ACCOUNT.email, password: 'not-it' }).catch(
            (caught) => caught,
        )
        expect(wrongPassword.code).toBe('auth/wrong-password')
        expect(authErrorMessage(wrongPassword)).toBe('Email or password is incorrect.')

        const unknown = await signInLocal({ email: 'nobody@example.com', password: 'secret123' }).catch(
            (caught) => caught,
        )
        expect(unknown.code).toBe('auth/user-not-found')
        expect(authErrorMessage(unknown)).toBe('Email or password is incorrect.')
    })

    it('treats corrupt stored accounts as empty instead of crashing', async () => {
        window.localStorage.setItem('farming-nyumbani:accounts:v1', 'not json')

        expect(currentLocalUser()).toBeNull()
        await expect(signUpLocal(ACCOUNT)).resolves.toMatchObject({ displayName: 'Amina Yusuf' })
    })

    it('returns no session when reading storage fails', () => {
        vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
            throw new Error('blocked')
        })

        expect(currentLocalUser()).toBeNull()
    })

    it('reports a storage write that the browser refuses', async () => {
        const original = window.localStorage.setItem
        window.localStorage.setItem = () => { throw new Error('quota') }
        try {
            await expect(signUpLocal(ACCOUNT)).rejects.toThrow('This browser refused to save your account')
        } finally {
            window.localStorage.setItem = original
        }
    })

    it('reports a write the browser silently drops', async () => {
        const original = window.localStorage.setItem
        window.localStorage.setItem = () => { }
        try {
            await expect(signUpLocal(ACCOUNT)).rejects.toThrow('This browser refused to save your account')
        } finally {
            window.localStorage.setItem = original
        }
    })
it('explains when storage is missing entirely', async () => {
    const blocked = vi.spyOn(window, 'localStorage', 'get').mockReturnValue(undefined)

    try {
        expect(currentLocalUser()).toBeNull()
        expect(() => signOutLocal()).not.toThrow()
        await expect(signUpLocal(ACCOUNT)).rejects.toThrow('blocking local storage')
    } finally {
        blocked.mockRestore()
    }
})

it('refuses to hash a password without Web Crypto', async () => {
    const noSubtle = vi.spyOn(globalThis.crypto, 'subtle', 'get').mockReturnValue(undefined)

    try {
        await expect(signUpLocal(ACCOUNT)).rejects.toThrow('cannot store passwords safely')
    } finally {
        noSubtle.mockRestore()
    }
})

it('clears the session even when storage throws on remove', async () => {
    await signUpLocal(ACCOUNT)
    vi.spyOn(window.localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('blocked')
    })

    expect(() => signOutLocal()).not.toThrow()
})
})