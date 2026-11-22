import { Link } from 'react-router-dom'
import { getCountyName } from '../../data/counties'
import { getCrop } from '../../data/crops'
import { formatAcres, rentLabel } from '../../utils/format'
import Badge from '../ui/Badge'

export default function FarmCard({ farm }) {
  const leadCrop = getCrop(farm.suitableCrops[0])

  return (
    <article className="card-interactive group overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <div
        aria-hidden="true"
        className="flex h-36 items-center justify-center bg-gradient-to-br from-primary-tint via-paper to-accent-tint text-4xl"
      >
        {leadCrop?.emoji ?? '🌱'}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{getCountyName(farm.countySlug)}</Badge>
          {farm.verified ? (
            <Badge tone="primary">Verified</Badge>
          ) : (
            <Badge tone="warning">Unverified</Badge>
          )}
        </div>

        <h3 className="mt-3 font-display text-base font-semibold leading-snug">
          <Link to={`/farms/${farm.id}`} className="hover:text-primary">
            {farm.title}
          </Link>
        </h3>

        <dl className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <dt className="text-xs text-muted">Size</dt>
            <dd className="text-sm font-medium">{formatAcres(farm.sizeAcres)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Rent</dt>
            <dd className="text-sm font-medium">{rentLabel(farm)}</dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {farm.suitableCrops.map((slug) => {
            const crop = getCrop(slug)
            return crop ? (
              <Badge key={slug} tone="accent">
                {crop.name}
              </Badge>
            ) : null
          })}
        </div>

        <p className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>
            {farm.leaseType} · {farm.waterSource}
          </span>
          <span aria-hidden="true" className="text-primary transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </p>
      </div>
    </article>
  )
}