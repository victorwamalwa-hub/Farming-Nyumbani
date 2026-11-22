import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Spinner from '../ui/Spinner'
import Footer from './Footer'
import Header from './Header'
import SkipLink from './SkipLink'

export default function PageShell() {
  const { pathname } = useLocation()

  // New route = new page: start at the top instead of keeping the old scroll.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1">
        <Suspense fallback={<Spinner label="Loading page" />}>
          {/* One section per page. Keying on the pathname remounts it on every
              navigation so the 0.5s page transition runs each time. */}
          <section key={pathname} className="page-section">
            <Outlet />
          </section>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}