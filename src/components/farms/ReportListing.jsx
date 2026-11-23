import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { reportFarm } from '../../services/engagement'
import { LEASE_REPORT_REASONS, validateReport } from '../../utils/validation'
import Button from '../ui/Button'
import Select from '../ui/Select'

export default function ReportListing({ farm }) {
  const { user, isConfigured } = useAuth()
  const location = useLocation()
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const needsSignIn = isConfigured && !user

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    const nextErrors = validateReport({ reason, note })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await reportFarm({
        farmId: farm.id,
        reason,
        note: note.trim(),
        reporter: user?.displayName || '',
      })
      setConfirmed(true)
      setReason('')
      setNote('')
    } catch (error) {
      setSubmitError(error.message || 'Could not send the report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (needsSignIn) {
    return (
      <section className="mt-8 rounded-2xl border border-line bg-surface p-6" aria-labelledby="report-title">
        <h2 id="report-title" className="font-display text-lg font-semibold text-ink">
          Report this listing
        </h2>
        <p className="mt-2 text-sm text-muted">
          Sign in so the report can be reviewed alongside your account.
        </p>
        <Button
          className="mt-3"
          to="/login"
          state={{ from: { pathname: location.pathname } }}
          variant="outline"
        >
          Sign in to report this listing
        </Button>
      </section>
    )
  }

  return (
    <section className="mt-8 rounded-2xl border border-line bg-surface p-6" aria-labelledby="report-title">
      <h2 id="report-title" className="font-display text-lg font-semibold text-ink">
        Report this listing
      </h2>
      <p className="mt-2 text-sm text-muted">
        Seen something wrong? Send it to a human for review — reports are kept separately and never
        remove the listing automatically.
      </p>

      {confirmed && (
        <p className="mt-3 text-sm font-medium text-primary" role="status">
          This listing has been flagged for a human check.
        </p>
      )}

      <form className="mt-4 grid gap-3" onSubmit={handleSubmit} noValidate>
        <Select
          label="Reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          options={[
            { value: '', label: 'Choose a reason' },
            ...LEASE_REPORT_REASONS.map((option) => ({ value: option, label: option })),
          ]}
          aria-invalid={Boolean(errors.reason)}
        />
        {errors.reason && <p className="text-sm text-danger" role="alert">{errors.reason}</p>}

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-ink">Note (optional)</span>
          <textarea
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            aria-invalid={Boolean(errors.note)}
          />
        </label>
        {errors.note && <p className="text-sm text-danger" role="alert">{errors.note}</p>}

        {submitError && <p className="text-sm text-danger" role="alert">{submitError}</p>}

        <div>
          <Button type="submit" variant="outline" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send report'}
          </Button>
        </div>
      </form>
    </section>
  )
}
