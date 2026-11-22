export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">{description}</p>
      <button
        className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        onClick={onAction}
        type="button"
      >
        {actionLabel}
      </button>
    </div>
  )
}
