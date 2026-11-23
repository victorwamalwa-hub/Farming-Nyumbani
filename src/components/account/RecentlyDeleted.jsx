import Badge from '../ui/Badge'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'

const KIND_LABEL = {
  review: 'Review',
  comment: 'Comment',
  report: 'Report',
}

function formatDate(value) {
  if (!value) return '—'
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function RecentlyDeleted({ items = [], onRestore }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-semibold text-ink">Recently deleted</h2>
      {items.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            title="Nothing in the bin"
            description="Anything you delete from your contributions will rest here for a while so you can restore it."
            actionLabel="Back to contributions"
            onAction={() => {
              if (typeof document !== 'undefined') {
                document.getElementById('contributions')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          />
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="neutral">{KIND_LABEL[item.kind] || 'Item'}</Badge>
                  <span className="text-sm font-semibold text-ink">
                    {item.farmId || item.targetId || 'Deleted item'}
                  </span>
                </div>
                {item.body && <p className="mt-1 text-sm text-muted">{item.body}</p>}
                <p className="mt-1 text-xs text-muted">Deleted {formatDate(item.deletedAt)}</p>
              </div>
              <Button variant="outline" onClick={() => onRestore(item)}>
                Restore
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
