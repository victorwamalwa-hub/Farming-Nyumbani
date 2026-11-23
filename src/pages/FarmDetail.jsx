import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LeaseRequestForm from '../components/farms/LeaseRequestForm'
import ReportListing from '../components/farms/ReportListing'
import { getCountyName } from '../data/counties'
import { FARMS } from '../data/seedFarms'
import { listReviews } from '../services/engagement'
import { formatDate, formatRating } from '../utils/format'

const formatKes = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
})

export default function FarmDetail() {
  const { farmId } = useParams()
  const farm = FARMS.find((listing) => listing.id === farmId)
  const [reviewState, setReviewState] = useState({
    farmId: null,
    reviews: [],
    loading: true,
    error: '',
  })

  useEffect(() => {
    if (!farm) return undefined

    let active = true

    async function loadReviews() {
      try {
        const farmReviews = await listReviews(farm.id)
        if (active) {
          setReviewState({ farmId: farm.id, reviews: farmReviews, loading: false, error: '' })
        }
      } catch (error) {
        if (active) {
          setReviewState({ farmId: farm.id, reviews: [], loading: false, error: error.message })
        }
      }
    }

    loadReviews()
    return () => {
      active = false
    }
  }, [farm])

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

  const currentReviewState = reviewState.farmId === farm.id
    ? reviewState
    : { reviews: [], loading: true, error: '' }
  const { reviews, loading: reviewsLoading, error: reviewsError } = currentReviewState

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

      <section aria-labelledby="reviews-title" className="mt-10">
        <h2 className="font-display text-2xl font-semibold text-ink" id="reviews-title">
          Farmer reviews
        </h2>
        {reviewsLoading && <p className="mt-3 text-muted">Loading reviews...</p>}
        {reviewsError && <p className="mt-3 text-danger" role="alert">{reviewsError}</p>}
        {reviews.length ? (
          <ul className="mt-4 grid list-none gap-4 p-0 md:grid-cols-2">
            {reviews.map((review) => (
              <li className="rounded-xl border border-line bg-surface p-5" key={review.id}>
                <p className="font-semibold text-ink">{review.author}</p>
                <p aria-label={formatRating(review.rating)} className="mt-1 text-sm text-primary">
                  {review.rating}/5 · {formatDate(review.createdAt)}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">{review.body}</p>
                {review.comments.length > 0 && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer font-semibold text-primary">
                      {review.comments.length} {review.comments.length === 1 ? 'comment' : 'comments'}
                    </summary>
                    <ul className="mt-2 space-y-2 border-l-2 border-line pl-3">
                      {review.comments.map((comment) => (
                        <li key={comment.id}>
                          <p className="font-medium text-ink">{comment.author}</p>
                          <p className="text-muted">{comment.body}</p>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </li>
            ))}
          </ul>
        ) : !reviewsLoading && !reviewsError ? (
          <p className="mt-3 text-muted">No reviews yet.</p>
        ) : null}
      </section>
    </main>
  )
}
