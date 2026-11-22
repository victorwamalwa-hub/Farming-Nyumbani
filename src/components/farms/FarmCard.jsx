import { Link } from 'react-router-dom'
import { getCountyName } from '../../data/counties'

const formatKes = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
})

export default function FarmCard({ farm }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold text-primary-dark">
          {getCountyName(farm.countySlug)}
        </span>
        {farm.verified && <span className="text-xs font-medium text-primary">Verified</span>}
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold text-ink">
        <Link className="hover:text-primary" to={`/farms/${farm.id}`}>
          {farm.title}
        </Link>
      </h2>
      <p className="mt-1 text-sm text-muted">
        {farm.ward} · {farm.sizeAcres} {farm.sizeAcres === 1 ? 'acre' : 'acres'}
      </p>
      <p className="mt-4 flex-1 text-sm leading-6 text-muted">{farm.description}</p>
      <ul aria-label="Suitable crops" className="mt-4 flex list-none flex-wrap gap-2 p-0">
        {farm.suitableCrops.map((crop) => (
          <li className="rounded-full border border-line px-2.5 py-1 text-xs capitalize text-ink" key={crop}>
            {crop.replaceAll('-', ' ')}
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-line pt-4 font-semibold text-ink">
        {formatKes.format(farm.rentKes)}
        <span className="ml-1 text-sm font-normal text-muted">per {farm.rentPeriod}</span>
      </p>
    </article>
  )
}
