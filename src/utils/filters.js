import { getCountyName } from '../data/counties'

export const DEFAULT_FILTERS = {
  query: '',
  county: '',
  crop: '',
  maxRent: '',
}

export function activeFilterCount(filters) {
  return Number(Boolean(filters.query.trim()))
    + Number(Boolean(filters.county))
    + Number(Boolean(filters.crop))
    + Number(Boolean(filters.maxRent))
}

export function filterFarms(farms, filters) {
  const query = filters.query.trim().toLowerCase()
  const maxRent = Number(filters.maxRent)

  return farms.filter((farm) => {
    const matchesCounty = !filters.county || farm.countySlug === filters.county
    const matchesCrop = !filters.crop || farm.suitableCrops.includes(filters.crop)
    const matchesRent = !maxRent || farm.rentKes <= maxRent
    const searchableText = [
      farm.title,
      farm.ownerName,
      farm.ward,
      getCountyName(farm.countySlug),
      farm.description,
      ...farm.suitableCrops,
    ].join(' ').toLowerCase()
    const matchesQuery = !query || searchableText.includes(query)

    return matchesCounty && matchesCrop && matchesRent && matchesQuery
  })
}
