import { COUNTIES } from '../../data/counties'
import { CROPS } from '../../data/crops'
import { WATER_SOURCES } from '../../utils/constants'
import Input from '../ui/Input'
import Select from '../ui/Select'

export default function FarmFilters({ filters, onChange, onReset, resultCount }) {
  const countyOptions = [
    { value: 'all', label: 'All counties' },
    ...COUNTIES.map((county) => ({ value: county.slug, label: county.name })),
  ]

  const cropOptions = [
    { value: 'all', label: 'Any crop' },
    ...CROPS.map((crop) => ({ value: crop.slug, label: crop.name })),
  ]

  const waterOptions = [
    { value: 'all', label: 'Any water source' },
    ...WATER_SOURCES.map((source) => ({ value: source, label: source })),
  ]

  return (
    <form
      className="rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5"
      onSubmit={(event) => event.preventDefault()}
      aria-label="Filter farms"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          label="Search"
          type="search"
          placeholder="County, ward or crop"
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
        />
        <Select
          label="County"
          value={filters.county}
          options={countyOptions}
          onChange={(event) => onChange({ county: event.target.value })}
        />
        <Select
          label="Crop"
          value={filters.crop}
          options={cropOptions}
          onChange={(event) => onChange({ crop: event.target.value })}
        />
        <Select
          label="Water source"
          value={filters.waterSource}
          options={waterOptions}
          onChange={(event) => onChange({ waterSource: event.target.value })}
        />
        <Input
          label="Max rent (KES)"
          type="number"
          min="0"
          step="5000"
          inputMode="numeric"
          placeholder="Any budget"
          value={filters.maxRent}
          onChange={(event) => onChange({ maxRent: event.target.value })}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-line pt-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-muted">
          {resultCount} {resultCount === 1 ? 'farm matches' : 'farms match'} your filters
        </p>
        <button
          type="button"
          onClick={onReset}
          className="self-start rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-tint"
        >
          Clear all filters
        </button>
      </div>
    </form>
  )
}