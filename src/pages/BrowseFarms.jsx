import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COUNTIES, getCountyName } from '../data/counties'
import { FARMS } from '../data/seedFarms'

const formatKes = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
})

export default function BrowseFarms() {
  const [query, setQuery] = useState('')
  const [county, setCounty] = useState('')
  const [crop, setCrop] = useState('')
  const [sort, setSort] = useState('recommended')

  const crops = useMemo(
    () => [...new Set(FARMS.flatMap((farm) => farm.suitableCrops))].sort(),
    [],
  )

  const farms = useMemo(() => {
    const searchTerm = query.trim().toLowerCase()
    const filteredFarms = FARMS.filter((farm) => {
      const matchesCounty = !county || farm.countySlug === county
      const matchesCrop = !crop || farm.suitableCrops.includes(crop)
      const searchableText = [
        farm.title,
        farm.ownerName,
        farm.ward,
        getCountyName(farm.countySlug),
        farm.description,
        ...farm.suitableCrops,
      ]
        .join(' ')
        .toLowerCase()

      return (
        matchesCounty &&
        matchesCrop &&
        (!searchTerm || searchableText.includes(searchTerm))
      )
    })

    if (sort === 'price-low') {
      return [...filteredFarms].sort((a, b) => a.rentKes - b.rentKes)
    }
    if (sort === 'price-high') {
      return [...filteredFarms].sort((a, b) => b.rentKes - a.rentKes)
    }
    if (sort === 'size') {
      return [...filteredFarms].sort((a, b) => b.sizeAcres - a.sizeAcres)
    }
    return filteredFarms
  }, [county, crop, query, sort])

  function clearFilters() {
    setQuery('')
    setCounty('')
    setCrop('')
    setSort('recommended')
  }

  return (
    <main className="section py-10 sm:py-14">
      <header className="mb-8 max-w-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
          Find your next growing space
        </p>
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">Browse farms</h1>
        <p className="mt-3 text-muted">
          Explore farmland available to lease across Kenya and find a plot that
          suits your crops, plans, and budget.
        </p>
      </header>

      <section
        aria-label="Farm filters"
        className="mb-8 grid gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card sm:grid-cols-2 lg:grid-cols-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="farm-search">
            Search farms
          </label>
          <input
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-ink"
            id="farm-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="County, crop, or keyword"
            type="search"
            value={query}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="county-filter">
            County
          </label>
          <select
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-ink"
            id="county-filter"
            onChange={(e) => setCounty(e.target.value)}
            value={county}
          >
            <option value="">All counties</option>
            {COUNTIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="crop-filter">
            Suitable crop
          </label>
          <select
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-ink"
            id="crop-filter"
            onChange={(event) => setCrop(event.target.value)}
            value={crop}
          >
            <option value="">All crops</option>
            {crops.map((item) => (
              <option key={item} value={item}>{item.replaceAll('-', ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="farm-sort">
            Sort by
          </label>
          <select
            className="w-full rounded-lg border border-line bg-white px-3 py-2 text-ink"
            id="farm-sort"
            onChange={(event) => setSort(event.target.value)}
            value={sort}
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="size">Largest plots</option>
          </select>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-muted">
          {farms.length} {farms.length === 1 ? 'farm' : 'farms'} found
        </p>
        {(query || county || crop || sort !== 'recommended') && (
          <button
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
          </button>
        )}
      </div>

      {farms.length > 0 ? (
        <ul className="grid list-none gap-5 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {farms.map((farm) => (
            <li key={farm.id}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold text-primary-dark">
                    {getCountyName(farm.countySlug)}
                  </span>
                  {farm.verified && (
                    <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-muted">
                      Verified
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-ink">
                  <Link
                    className="rounded-sm hover:text-primary"
                    to={`/farms/${farm.id}`}
                  >
                    {farm.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {farm.ward} · {farm.sizeAcres} {farm.sizeAcres === 1 ? 'acre' : 'acres'}
                </p>
                <p className="mt-4 flex-1 text-sm leading-6 text-muted">{farm.description}</p>

                <div className="mt-4 flex flex-wrap gap-2" aria-label="Suitable crops">
                  {farm.suitableCrops.map((farmCrop) => (
                    <span
                      className="rounded-md border border-line px-2 py-1 text-xs capitalize text-ink"
                      key={farmCrop}
                    >
                      {farmCrop.replaceAll('-', ' ')}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
                  <div>
                    <p className="text-lg font-bold text-ink">{formatKes.format(farm.rentKes)}</p>
                    <p className="text-xs text-muted">per {farm.rentPeriod}</p>
                  </div>
                  <Link
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                    to={`/farms/${farm.id}`}
                  >
                    View farm
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
          <h2 className="text-xl font-semibold text-ink">No farms match those filters</h2>
          <p className="mt-2 text-muted">Try another search or clear the selected filters.</p>
          <button
            className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  )
}
