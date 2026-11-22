import LocalModeNotice from '../components/auth/LocalModeNotice'
import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { authErrorMessage } from '../utils/AuthErrors'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(credential.user, { displayName: name.trim() })
      navigate('/account', { replace: true })
    } catch (registrationError) {
      setError(authErrorMessage(registrationError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="section flex justify-center py-10 sm:py-14">
      <section className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Get started</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-muted">Join farmers and landowners growing together.</p>
        <LocalModeNotice className="mb-4" />

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="register-name">
              Your name
            </label>
            <input
              autoComplete="name"
              className="w-full rounded-lg border border-line px-3 py-2 text-ink"
              id="register-name"
              onChange={(event) => setName(event.target.value)}
              required
              value={name}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="register-email">
              Email address
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-lg border border-line px-3 py-2 text-ink"
              id="register-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="register-password">
              Password
            </label>
            <input
              autoComplete="new-password"
              className="w-full rounded-lg border border-line px-3 py-2 text-ink"
              id="register-password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="confirm-password">
              Confirm password
            </label>
            <input
              autoComplete="new-password"
              className="w-full rounded-lg border border-line px-3 py-2 text-ink"
              id="confirm-password"
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              type="password"
              value={confirmPassword}
            />
          </div>
          {error && <p className="text-sm text-danger" role="alert">{error}</p>}
          <button
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link className="font-semibold text-primary hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
