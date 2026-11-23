import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function GoogleButton({ onSuccess, onError, className = '' }) {
  const { signInWithGoogle } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  async function handleClick() {
    setSubmitting(true)
    try {
      const user = await signInWithGoogle()
      onSuccess?.(user)
    } catch (error) {
      onError?.(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <button
      className={`w-full rounded-lg border border-line bg-surface px-4 py-3 font-semibold text-ink hover:bg-paper disabled:opacity-60 ${className}`.trim()}
      disabled={submitting}
      onClick={handleClick}
      type="button"
    >
      {submitting ? 'Connecting…' : 'Continue with Google'}
    </button>
  )
}
