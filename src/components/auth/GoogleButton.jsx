import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { authErrorMessage } from '../../utils/AuthErrors'

/**
 * Google sign-in. Hidden in local mode (no Firebase keys) — a dead button is
 * worse than no button. Disabled while pending. Failures go through onError;
 * success through onSuccess; never leaves a spinner stuck.
 */
export default function GoogleButton({ onError, onSuccess }) {
  const { mode, signInWithGoogle } = useAuth()
  const [pending, setPending] = useState(false)

  if (mode !== 'firebase') return null

  async function handleClick() {
    setPending(true)
    try {
      const user = await signInWithGoogle()
      onSuccess?.(user)
    } catch (error) {
      onError?.(authErrorMessage(error))
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      className="w-full rounded-lg border border-line bg-surface px-4 py-3 font-semibold text-ink hover:border-primary disabled:opacity-60"
      disabled={pending}
      onClick={handleClick}
      type="button"
    >
      {pending ? 'Opening Google…' : 'Continue with Google'}
    </button>
  )
}