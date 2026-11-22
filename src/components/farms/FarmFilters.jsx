import { COUNTIES } from '../../data/counties'
import { FARMS } from '../../data/seedFarms'

export default function FarmFilters({ filters, onChange, onReset, resultCount }) {
  const county = filters.county
  const setCounty = (value) => onChange({ county: value })
  const crops = [...new Set(FARMS.flatMap((farm) => farm.suitableCrops))].sort()

  return (
    <section
      aria-label="Farm filters"
      className="grid gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card sm:grid-cols-2 lg:grid-cols-4"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="farm-search">
          Search
        </label>
        <input
          className="w-full rounded-lg border border-line px-3 py-2"
          id="farm-search"
          onChange={(event) => onChange({ query: event.target.value })}
          placeholder="Farm, owner, or location"
          type="search"
          value={filters.query}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="county-filter">
          County
        </label>
        <select
          className="w-full rounded-lg border border-line bg-white px-3 py-2"
          id="county-filter"
          value={county}
          onChange={(e) => setCounty(e.target.value)}
        >
          <option value="">All counties</option>
          {COUNTIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="crop-filter">
          Crop
        </label>
        <select
          className="w-full rounded-lg border border-line bg-white px-3 py-2 capitalize"
          id="crop-filter"
          onChange={(event) => onChange({ crop: event.target.value })}
          value={filters.crop}
        >
          <option value="">All crops</option>
          {crops.map((crop) => (
            <option key={crop} value={crop}>{crop.replaceAll('-', ' ')}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="rent-ceiling">
          Maximum rent per season (KES)
        </label>
        <input
          className="w-full rounded-lg border border-line px-3 py-2"
          id="rent-ceiling"
          min="0"
          onChange={(event) => onChange({ maxRent: event.target.value })}
          placeholder="Any rent"
          type="number"
          value={filters.maxRent}
        />
      </div>

      <div className="flex items-center justify-between gap-3 sm:col-span-2 lg:col-span-4">
        <p aria-live="polite" className="text-sm text-muted">
          {resultCount} {resultCount === 1 ? 'farm' : 'farms'} match your filters
        </p>
        <button
          className="text-sm font-semibold text-primary hover:underline"
          onClick={onReset}
          type="button"
        >
          Clear all filters
        </button>
      </div>
    </section>
  )
}
