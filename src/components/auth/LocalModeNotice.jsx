import { useAuth } from '../../context/AuthContext'

/**
 * Shown when Firebase keys are absent and accounts live in this browser only.
 * Renders nothing in Firebase mode, so pages can include it unconditionally.
 */
export default function LocalModeNotice({ className = '' }) {
  const { mode } = useAuth()

  if (mode !== 'local') return null

  return (
    <p
      className={`rounded-lg border border-line bg-paper p-3 text-sm text-muted ${className}`.trim()}
      role="status"
    >
      <strong className="font-semibold text-ink">Local accounts are on.</strong>{' '}
      This device has no Firebase keys, so accounts are stored in this browser only.
      They are a demo fallback — not a security boundary.
    </p>
  )
}