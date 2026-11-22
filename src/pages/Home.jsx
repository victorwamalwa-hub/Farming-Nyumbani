import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import { FARMS } from '../data/seedFarms'

export default function Home() {
  return (
    <main>
      <section className="section grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Farming Nyumbani
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Find land. Grow your future.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">
            Discover farmland to lease across Kenya, connect with landowners, and find a
            growing space that fits your plans.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark"
              to="/farms"
            >
              Find a farm
            </Link>
            <Link
              className="rounded-lg border border-line bg-surface px-5 py-3 font-semibold text-ink hover:border-primary"
              to="/crops"
            >
              Explore crops
            </Link>
          </div>
        </div>
        <img
          alt="Green farmland and crops in Kenya"
          className="h-72 w-full rounded-3xl object-cover shadow-card md:h-96"
          src={heroImage}
        />
      </section>

      <section className="bg-surface py-12">
        <div className="section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Start growing
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
                A place for your next season
              </h2>
            </div>
            <p className="text-sm text-muted">{FARMS.length} sample farms to explore</p>
          </div>
          <p className="mt-4 max-w-2xl leading-7 text-muted">
            Compare location, acreage, rent, and water access before choosing a plot.
            Listings include farms from counties across Kenya.
          </p>
          <Link className="mt-5 inline-flex font-semibold text-primary hover:underline" to="/farms">
            Browse available farms <span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
