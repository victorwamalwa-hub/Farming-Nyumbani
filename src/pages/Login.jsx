import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LocalModeNotice from '../components/auth/LocalModeNotice'
import { auth } from '../lib/firebase'
import { authErrorMessage } from '../utils/AuthErrors'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      navigate(location.state?.from?.pathname || '/account', { replace: true })
    } catch (signInError) {
      setError(authErrorMessage(signInError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="section flex justify-center py-10 sm:py-14">
      <section className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Welcome back</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Sign in to manage your farming account and requests.</p>
        <LocalModeNotice className="mb-4" />

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="login-email">
              Email address
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-lg border border-line px-3 py-2 text-ink"
              id="login-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="login-password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="w-full rounded-lg border border-line px-3 py-2 text-ink"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>
          {error && <p className="text-sm text-danger" role="alert">{error}</p>}
          <button
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          New to Farming Nyumbani?{' '}
          <Link className="font-semibold text-primary hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}
