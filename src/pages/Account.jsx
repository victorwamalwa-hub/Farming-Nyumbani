import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { authErrorMessage } from '../utils/AuthErrors'

export default function Account() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => onAuthStateChanged(
    auth,
    (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    },
    (authError) => {
      setError(authErrorMessage(authError))
      setLoading(false)
    },
  ), [])

  async function handleSignOut() {
    setError('')
    setSigningOut(true)
    try {
      await signOut(auth)
      navigate('/login', { replace: true })
    } catch (signOutError) {
      setError(authErrorMessage(signOutError))
    } finally {
      setSigningOut(false)
    }
  }

  if (loading) {
    return <main className="section py-12"><p role="status">Loading your account…</p></main>
  }

  if (!user) {
    return (
      <main className="section py-12">
        <h1 className="font-display text-3xl font-semibold text-ink">Sign in to your account</h1>
        <p className="mt-3 text-muted">Your account details and lease requests will appear here.</p>
        <Link className="mt-5 inline-flex font-semibold text-primary hover:underline" to="/login">
          Sign in
        </Link>
      </main>
    )
  }

  return (
    <main className="section py-10 sm:py-14">
      <div className="max-w-2xl rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Your account</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
          Welcome, {user.displayName || 'farmer'}
        </h1>
        <p className="mt-3 text-muted">{user.email}</p>
        {error && <p className="mt-4 text-sm text-danger" role="alert">{error}</p>}
        <div className="mt-7 border-t border-line pt-5">
          <h2 className="font-semibold text-ink">Lease requests</h2>
          <p className="mt-2 text-sm text-muted">
            Your submitted lease requests will be shown here.
          </p>
          <Link className="mt-4 inline-flex font-semibold text-primary hover:underline" to="/farms">
            Browse farms
          </Link>
        </div>
        <button
          className="mt-7 rounded-lg border border-line px-4 py-2 font-semibold text-ink hover:border-primary disabled:opacity-60"
          disabled={signingOut}
          onClick={handleSignOut}
          type="button"
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </main>
  )
}
