
/**
 * Shared shell for the sign-in and register pages: optional notice above the
 * card, one <h1> in the body, children in the form area, and an optional
 * footer link line ("New here? Create an account").
 */
export default function AuthCard({
  eyebrow,
  title,
  description,
  notice = null,
  children,
  footer = null,
}) {
  return (
    <main className="section flex justify-center py-10 sm:py-14">
      <div className="w-full max-w-md">
        {notice}
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{title}</h1>
          {description && <p className="mt-2 text-sm text-muted">{description}</p>}
          {children}
        </section>
        {footer && (
          <div className="mt-5 text-center text-sm text-muted">{footer}</div>
        )}
      </div>
    </main>
  )
}