import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import GoogleButton from '../components/auth/GoogleButton'
import LocalModeNotice from '../components/auth/LocalModeNotice'
import { useAuth } from '../context/AuthContext'
import { authErrorMessage } from '../utils/AuthErrors'
import { validateRegistration } from '../utils/validation'

const DUPLICATE_EMAIL_MESSAGE = authErrorMessage({ code: 'auth/email-already-in-use' })

export default function Register() {
  const navigate = useNavigate()
  const { signUp, mode } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [showSignInLink, setShowSignInLink] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setShowSignInLink(false)

    const errors = validateRegistration({ name, email, password, confirmPassword })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await signUp({ name: name.trim(), email: email.trim(), password })
      navigate('/account', { replace: true })
    } catch (registrationError) {
      const message = authErrorMessage(registrationError)
      setError(message)
      setShowSignInLink(
        registrationError?.code === 'auth/email-already-in-use'
          || message === DUPLICATE_EMAIL_MESSAGE,
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard
      eyebrow="Get started"
      title="Create your account"
      description="Join farmers and landowners growing together."
      notice={<LocalModeNotice className="mb-4" />}
      footer={
        <>
          Already have an account?{' '}
          <Link className="font-semibold text-primary hover:underline" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="register-name">
            Your name
          </label>
          <input
            aria-describedby={fieldErrors.name ? 'register-name-error register-name-hint' : 'register-name-hint'}
            aria-invalid={fieldErrors.name ? 'true' : undefined}
            autoComplete="name"
            className="w-full rounded-lg border border-line px-3 py-2 text-ink"
            id="register-name"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
          <p className="mt-1 text-sm text-muted" id="register-name-hint">
            This is what appears on your reviews, comments and listings.
          </p>
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-danger" id="register-name-error" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="register-email">
            Email address
          </label>
          <input
            aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
            aria-invalid={fieldErrors.email ? 'true' : undefined}
            autoComplete="email"
            className="w-full rounded-lg border border-line px-3 py-2 text-ink"
            id="register-email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-danger" id="register-email-error" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="register-password">
            Password
          </label>
          <input
            aria-describedby={fieldErrors.password ? 'register-password-error register-password-hint' : 'register-password-hint'}
            aria-invalid={fieldErrors.password ? 'true' : undefined}
            autoComplete="new-password"
            className="w-full rounded-lg border border-line px-3 py-2 text-ink"
            id="register-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
          <p className="mt-1 text-sm text-muted" id="register-password-hint">
            At least 8 characters.
          </p>
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-danger" id="register-password-error" role="alert">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="confirm-password">
            Confirm password
          </label>
          <input
            aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
            aria-invalid={fieldErrors.confirmPassword ? 'true' : undefined}
            autoComplete="new-password"
            className="w-full rounded-lg border border-line px-3 py-2 text-ink"
            id="confirm-password"
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            value={confirmPassword}
          />
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-sm text-danger" id="confirm-password-error" role="alert">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        {error && (
          <div>
            <p className="text-sm text-danger" role="alert">{error}</p>
            {showSignInLink && (
              <Link className="mt-1 inline-flex text-sm font-semibold text-primary hover:underline" to="/login">
                Sign in to your account
              </Link>
            )}
          </div>
        )}

        <button
          className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        {mode === 'firebase' && (
          <>
            <div className="flex items-center gap-3 pt-2 text-xs uppercase tracking-wide text-muted">
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
              <span>or continue with</span>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>
            <GoogleButton
              onError={(googleError) => {
                setError(googleError)
                setShowSignInLink(false)
              }}
              onSuccess={() => navigate('/account', { replace: true })}
            />
          </>
        )}
      </form>
    </AuthCard>
  )
}
