import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { accountName, useAuth } from '../../context/AuthContext'
import { initials } from '../../utils/format'
import Button from '../ui/Button'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/farms', label: 'Find a farm' },
  { to: '/crops', label: 'Crops & regions' },
]

function desktopLinkClass({ isActive }) {
  const base = 'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
  return isActive ? `${base} bg-primary-tint text-primary-dark` : `${base} text-ink hover:bg-surface hover:text-primary`
}

function mobileLinkClass({ isActive }) {
  const base = 'block rounded-lg px-3 py-3 text-base font-medium'
  return isActive ? `${base} bg-primary-tint text-primary-dark` : `${base} text-ink hover:bg-paper`
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeButtonRef = useRef(null)
  const { user, signOut } = useAuth()
  const displayName = accountName(user)

  async function handleSignOut() {
    setMenuOpen(false)
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out failed', error)
    }
  }

  // While the drawer is open: Escape closes it, the page behind cannot scroll,
  // and focus moves into the drawer instead of staying on the toggle.
  useEffect(() => {
    if (!menuOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="section flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Farming Nyumbani, go to home">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-lg"
          >
            🌱
          </span>
          <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
            Farming Nyumbani
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link
                to="/account"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface"
                aria-label={`Account: ${displayName}`}
              >
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 place-items-center rounded-full bg-primary-tint text-xs font-semibold text-primary-dark"
                >
                  {initials(displayName)}
                </span>
                <span className="max-w-[9rem] truncate text-sm font-medium">{displayName}</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-surface hover:text-ink"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-surface hover:text-primary"
              >
                Log in
              </Link>
              <Button to="/register" variant="accent" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface text-ink lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden="true" className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Dismiss menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-16 z-30 bg-ink/40 lg:hidden"
          />
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="fixed inset-x-0 top-16 z-40 border-b border-line bg-surface p-4 shadow-card lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Button
              to="/farms"
              variant="accent"
              className="mt-3 w-full"
              onClick={() => setMenuOpen(false)}
            >
              Find a farm
            </Button>

            <div className="mt-3 space-y-1 border-t border-line pt-3">
              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-paper"
                  >
                    Your account ({displayName})
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-paper"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-paper"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-paper"
                  >
                    Create an account
                  </Link>
                </>
              )}
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              className="mt-2 w-full rounded-lg px-3 py-2 text-sm text-muted hover:bg-paper"
            >
              Close menu
            </button>
          </nav>
        </>
      ) : null}
    </header>
  )
}