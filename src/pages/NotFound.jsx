import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')

  return (
    <main className="section flex min-h-[55vh] flex-col items-start justify-center py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Page not found</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
        We could not find that page
      </h1>
      <p className="mt-3 max-w-xl text-muted">
        The link may be old, or the page may have moved. Nothing is broken on your side &mdash;
        you can head home or keep browsing farms from here.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button to="/" variant="primary" size="lg">
          Back to home
        </Button>
        <Button to="/farms" variant="outline" size="lg">
          Browse farms
        </Button>
      </div>
      <p className="mt-6 text-sm text-muted">
        Looking for something specific? Start from the{' '}
        <Link className="font-semibold text-primary hover:underline" to="/">
          home page
        </Link>
        .
      </p>
    </main>
  )
}
