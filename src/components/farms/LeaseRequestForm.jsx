import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { requestLease } from '../../services/engagement'
import { validateLeaseRequest } from '../../utils/validation'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function LeaseRequestForm({ farm }) {
  const { user, isConfigured } = useAuth()
  const location = useLocation()
  const [values, setValues] = useState({
    name: user?.displayName || user?.email?.split('@')[0] || '',
    crops: farm?.suitableCrops?.[0]?.replaceAll('-', ' ') || '',
    startDate: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const needsSignIn = isConfigured && !user

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    const nextErrors = validateLeaseRequest(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await requestLease({
        farmId: farm.id,
        farmTitle: farm.title,
        ownerName: farm.ownerName,
        requester: values.name.trim(),
        crops: values.crops.trim(),
        startDate: values.startDate,
        message: values.message.trim(),
      })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message || 'Could not send the request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (needsSignIn) {
    return (
      <section className="mt-8 rounded-2xl border border-line bg-surface p-6" aria-labelledby="lease-title">
        <h2 id="lease-title" className="font-display text-xl font-semibold text-ink">
          Request this lease
        </h2>
        <p className="mt-2 text-sm text-muted">
          Sign in so the owner can reply and you can track the request in your account.
        </p>
        <Button
          className="mt-4"
          to="/login"
          state={{ from: { pathname: location.pathname } }}
          variant="primary"
        >
          Sign in to request this lease
        </Button>
      </section>
    )
  }

  if (submitted) {
    return (
      <section className="mt-8 rounded-2xl border border-line bg-surface p-6" aria-labelledby="lease-title">
        <h2 id="lease-title" className="font-display text-xl font-semibold text-ink">
          Request sent
        </h2>
        <p className="mt-2 text-sm text-muted">
          {farm.ownerName} will review your request. You can follow progress from your account.
        </p>
        <Button className="mt-4" to="/account" variant="outline">
          Go to my account
        </Button>
      </section>
    )
  }

  return (
    <section className="mt-8 rounded-2xl border border-line bg-surface p-6" aria-labelledby="lease-title">
      <h2 id="lease-title" className="font-display text-xl font-semibold text-ink">
        Request this lease
      </h2>
      <form className="mt-4 grid gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Your name"
          value={values.name}
          onChange={update('name')}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-sm text-danger" role="alert">{errors.name}</p>}

        <Input
          label="Crops you plan to grow"
          value={values.crops}
          onChange={update('crops')}
          aria-invalid={Boolean(errors.crops)}
        />
        {errors.crops && <p className="text-sm text-danger" role="alert">{errors.crops}</p>}

        <Input
          label="Preferred start date (optional)"
          type="date"
          value={values.startDate}
          onChange={update('startDate')}
        />

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Message to the owner</span>
          <textarea
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            rows={4}
            value={values.message}
            onChange={update('message')}
            aria-invalid={Boolean(errors.message)}
          />
        </label>
        {errors.message && <p className="text-sm text-danger" role="alert">{errors.message}</p>}

        {submitError && <p className="text-sm text-danger" role="alert">{submitError}</p>}

        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send lease request'}
          </Button>
        </div>
      </form>
    </section>
  )
}
