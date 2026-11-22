import { Link, NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { to: '/farms', label: 'Find a farm' },
  { to: '/crops', label: 'Crops & regions' },
]

export default function PageShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="border-b border-line bg-surface">
        <div className="section flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
          <Link className="font-display text-lg font-semibold text-ink" to="/">
            Farming Nyumbani
          </Link>
          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-4">
            {navigation.map((item) => (
              <NavLink
                className={({ isActive }) => (
                  `text-sm font-medium ${isActive ? 'text-primary' : 'text-muted hover:text-primary'}`
                )}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              className={({ isActive }) => (
                `text-sm font-medium ${isActive ? 'text-primary' : 'text-muted hover:text-primary'}`
              )}
              to="/account"
            >
              Account
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="flex-1" id="main-content">
        <Outlet />
      </div>

      <footer className="border-t border-line bg-surface py-6">
        <div className="section flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
          <p>Connecting farmers with farmland across Kenya.</p>
          <p>© {new Date().getFullYear()} Farming Nyumbani</p>
        </div>
      </footer>
    </div>
  )
}
