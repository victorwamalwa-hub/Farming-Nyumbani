import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import GoogleButton from '../components/auth/GoogleButton'
import LocalModeNotice from '../components/auth/LocalModeNotice'
import { useAuth } from '../context/AuthContext'
import { authErrorMessage } from '../utils/AuthErrors'
import { validateLogin } from '../utils/validation'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, mode } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectAfterSignIn = () =>
    navigate(location.state?.from?.pathname ?? '/account', { replace: true })

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const errors = validateLogin({ email, password })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await signIn({ email: email.trim(), password })
      redirectAfterSignIn()
    } catch (signInError) {
      setError(authErrorMessage(signInError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in"
      description="Sign in to manage your farming account and requests."
      notice={<LocalModeNotice className="mb-4" />}
      footer={
        <>
          New to Farming Nyumbani?{' '}
          <Link className="font-semibold text-primary hover:underline" to="/register">
            Create an account
          </Link>
        </>
      }
    >
      <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="login-email">
            Email address
          </label>
          <input
            aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            aria-invalid={fieldErrors.email ? 'true' : undefined}
            autoComplete="email"
            className="w-full rounded-lg border border-line px-3 py-2 text-ink"
            id="login-email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-danger" id="login-email-error" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="login-password">
            Password
          </label>
          <input
            aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            aria-invalid={fieldErrors.password ? 'true' : undefined}
            autoComplete="current-password"
            className="w-full rounded-lg border border-line px-3 py-2 text-ink"
            id="login-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-danger" id="login-password-error" role="alert">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-danger" role="alert">{error}</p>}

        <button
          className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        {mode === 'firebase' && (
          <>
            <div className="flex items-center gap-3 pt-2 text-xs uppercase tracking-wide text-muted">
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
              <span>or continue with</span>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>
            <GoogleButton onError={setError} onSuccess={redirectAfterSignIn} />
          </>
        )}
      </form>
    </AuthCard>
  )
}
