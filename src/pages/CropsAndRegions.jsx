import { Link } from 'react-router-dom'
import { CROPS } from '../data/crops'

export default function CropsAndRegions() {
  const categories = [...new Set(CROPS.map((crop) => crop.category))]

  return (
    <main className="section py-10 lg:py-14">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Plan your season
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Crops and regions
        </h1>
        <p className="mt-3 leading-7 text-muted">
          Explore common crops, typical growing seasons, and Kenyan counties where they are grown.
          Local conditions vary, so confirm water, soil, and seasonal advice before planting.
        </p>
      </header>

      <nav aria-label="Crop categories" className="mt-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <a
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink hover:border-primary"
            href={`#${category.toLowerCase().replaceAll(' ', '-')}`}
            key={category}
          >
            {category}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-10">
        {categories.map((category) => {
          const categoryCrops = CROPS.filter((crop) => crop.category === category)
          const categoryId = category.toLowerCase().replaceAll(' ', '-')

          return (
            <section aria-labelledby={`${categoryId}-heading`} id={categoryId} key={category}>
              <h2
                className="mb-4 font-display text-2xl font-semibold text-ink"
                id={`${categoryId}-heading`}
              >
                {category}
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                {categoryCrops.map((crop) => (
                  <article
                    className="rounded-2xl border border-line bg-surface p-5 shadow-card"
                    key={crop.slug}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-display text-xl font-semibold text-ink">{crop.name}</h3>
                      <span className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-muted">
                        {crop.harvestDays} days to harvest
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-muted">
                      <strong className="text-ink">Typical season:</strong> {crop.season}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      <strong className="text-ink">Growing counties:</strong> {crop.regions.join(', ')}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <p className="mt-8 rounded-xl border border-line bg-surface p-4 text-sm text-muted">
        Looking for land for a particular crop?{' '}
        <Link className="font-semibold text-primary hover:underline" to="/farms">
          Browse farm listings
        </Link>
        .
      </p>
    </main>
  )
}
