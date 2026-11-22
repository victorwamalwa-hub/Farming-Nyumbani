import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="section flex min-h-[55vh] flex-col items-start justify-center py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Error 404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
        This page could not be found
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        The address may be incorrect, or the page may have moved. You can head back and keep
        exploring farms.
      </p>
      <Link
        className="mt-6 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark"
        to="/"
      >
        Back to home
      </Link>
    </main>
  )
}
