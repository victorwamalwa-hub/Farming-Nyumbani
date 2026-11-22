import { describe, expect, it } from 'vitest'
import { COUNTIES } from './counties'
import { FARMS } from './seedFarms'

describe('seed farms', () => {
  it('provides farm records with unique ids and required listing details', () => {
    expect(FARMS.length).toBeGreaterThan(0)

    const ids = FARMS.map((farm) => farm.id)
    expect(new Set(ids).size).toBe(ids.length)

    for (const farm of FARMS) {
      expect(farm.title).toBeTruthy()
      expect(farm.countySlug).toBeTruthy()
      expect(farm.sizeAcres).toBeGreaterThan(0)
      expect(farm.rentKes).toBeGreaterThan(0)
      expect(farm.suitableCrops.length).toBeGreaterThan(0)
    }
  })

  it('uses county slugs present in the county dataset', () => {
    const countySlugs = new Set(COUNTIES.map((county) => county.slug))

    for (const farm of FARMS) {
      expect(countySlugs.has(farm.countySlug)).toBe(true)
    }
  })
})
