import LocalModeNotice from './LocalModeNotice'

export default function AuthCard({ eyebrow, title, description, children, footer }) {
  return (
    <main className="section flex justify-center py-10 sm:py-14">
      <section className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-muted">{description}</p>
        <LocalModeNotice className="mb-4" />

        {children}

        {footer && (
          <p className="mt-5 text-center text-sm text-muted">
            {footer}
          </p>
        )}
      </section>
    </main>
  )
}
