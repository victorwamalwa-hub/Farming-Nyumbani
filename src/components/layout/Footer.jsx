import { Link } from 'react-router-dom'

const EXPLORE = [
  { to: '/farms', label: 'Find a farm' },
  { to: '/crops', label: 'Crops & regions' },
]

const ROADMAP = [
  'Lease requests and agreements',
  'M-Pesa deposits and payouts',
  'Diaspora adopt-a-farm sponsorship',
  'Verified boundary mapping',
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="section grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-base font-semibold">Farming Nyumbani</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Land, put to work. We connect Kenyan landowners with people who want to farm, with clear
            terms and honest crop guidance.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Explore</h2>
          <ul className="mt-3 space-y-2">
            {EXPLORE.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-ink hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">On the roadmap</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {ROADMAP.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Built as a capstone</h2>
          <p className="mt-3 text-sm text-muted">
            Listings and farm figures on this site are realistic sample data, not offers. Verified
            listings, accounts and payments land in the next release.
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="section flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Farming Nyumbani. Built in Nairobi.</p>
          <p>Prices in Kenyan shillings. Land sizes in acres.</p>
        </div>
      </div>
    </footer>
  )
}