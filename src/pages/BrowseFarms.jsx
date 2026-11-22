import { useMemo, useState } from 'react'
import FarmCard from '../components/farms/FarmCard'
import FarmFilters from '../components/farms/FarmFilters'
import EmptyState from '../components/ui/EmptyState'
import { getCountyName } from '../data/counties'
import { FARMS } from '../data/seedFarms'
import useDebouncedValue from '../hooks/useDebouncedValue'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { DEFAULT_FILTERS, activeFilterCount, filterFarms } from '../utils/filters'

export default function BrowseFarms() {
  useDocumentTitle('Find a farm')

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const debouncedQuery = useDebouncedValue(filters.query, 250)

  // Cheap enough on eight listings, but this keeps filtering off every keystroke
  // and will matter once listings come from Firestore.
  const results = useMemo(
    () => filterFarms(FARMS, { ...filters, query: debouncedQuery }),
    [filters, debouncedQuery],
  )

  const hasActiveFilters = activeFilterCount(filters) > 0

  function updateFilter(patch) {
    setFilters((current) => ({ ...current, ...patch }))
  }

  function resetFilters() {
    setFilters({ ...DEFAULT_FILTERS })
  }

  return (
    <div className="section py-10 lg:py-14">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Find a farm</h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          Every plot below is listed by its landowner with the season rent, water source and the
          crops the soil and rainfall can support.
        </p>
      </header>

      <div className="mt-8">
        <FarmFilters
          filters={filters}
          onChange={updateFilter}
          onReset={resetFilters}
          resultCount={results.length}
        />
      </div>

      <section aria-labelledby="results-heading" className="mt-8">
        <h2 id="results-heading" className="sr-only">
          Farm results
        </h2>

        {results.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={
              filters.county && filters.county !== 'all'
                ? `No farms in ${getCountyName(filters.county)} yet`
                : 'No farms match those filters'
            }
            description={
              hasActiveFilters
                ? 'Try widening the rent ceiling, choosing a different county, or clearing the search.'
                : 'No listings are open right now. Check back at the start of the next season.'
            }
            actionLabel="Clear all filters"
            onAction={resetFilters}
          />
        )}
      </section>

      <p className="mt-10 rounded-xl border border-line bg-surface p-4 text-xs text-muted">
        Listings are realistic sample data for this release. Verified documents and boundary maps
        are still to come; lease requests you send are saved to your account.
      </p>
    </div>
  )
}