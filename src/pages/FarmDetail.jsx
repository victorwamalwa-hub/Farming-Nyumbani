import { Link, useParams } from 'react-router-dom'
import LeaseRequestForm from '../components/farms/LeaseRequestForm'
import ReportListing from '../components/farms/ReportListing'
import ReviewSection from '../components/reviews/ReviewSection'
import { getCountyName } from '../data/counties'
import { FARMS } from '../data/seedFarms'

const formatKes = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
})

export default function FarmDetail() {
  const { farmId } = useParams()
  const farm = FARMS.find((listing) => listing.id === farmId)

  if (!farm) {
    return (
      <main className="section py-14">
        <h1 className="font-display text-3xl font-semibold text-ink">Farm not found</h1>
        <p className="mt-3 text-muted">This farm may have been removed or is no longer available.</p>
        <Link className="mt-5 inline-flex font-semibold text-primary hover:underline" to="/farms">
          Browse farms
        </Link>
      </main>
    )
  }

  return (
    <main className="section py-10 lg:py-14">
      <Link className="text-sm font-semibold text-primary hover:underline" to="/farms">
        ← All farms
      </Link>

      <article className="mt-5 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold text-primary-dark">
            {getCountyName(farm.countySlug)}
          </span>
          {farm.verified && (
            <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">
              Verified listing
            </span>
          )}
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {farm.title}
        </h1>
        <p className="mt-2 text-muted">{farm.ward}, {getCountyName(farm.countySlug)}</p>
        <p className="mt-6 max-w-3xl leading-7 text-muted">{farm.description}</p>

        <dl className="mt-8 grid gap-5 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-sm text-muted">Season rent</dt>
            <dd className="mt-1 text-lg font-semibold text-ink">
              {formatKes.format(farm.rentKes)} / {farm.rentPeriod}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Farm size</dt>
            <dd className="mt-1 font-semibold text-ink">{farm.sizeAcres} acres</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Landowner</dt>
            <dd className="mt-1 font-semibold text-ink">{farm.ownerName}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Water source</dt>
            <dd className="mt-1 font-semibold text-ink">{farm.waterSource}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Soil</dt>
            <dd className="mt-1 font-semibold text-ink">{farm.soilType}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Lease type</dt>
            <dd className="mt-1 font-semibold text-ink">{farm.leaseType}</dd>
          </div>
        </dl>

        <div className="mt-7">
          <h2 className="font-display text-lg font-semibold text-ink">Suitable crops</h2>
          <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
            {farm.suitableCrops.map((crop) => (
              <li className="rounded-full border border-line px-3 py-1 text-sm capitalize text-ink" key={crop}>
                {crop.replaceAll('-', ' ')}
              </li>
            ))}
          </ul>
        </div>

      </article>

      <LeaseRequestForm farm={farm} />
      <ReportListing farm={farm} />

      <ReviewSection farmId={farm.id} />
    </main>
  )
}
