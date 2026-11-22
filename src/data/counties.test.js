import { describe, expect, it } from 'vitest'
import { COUNTIES, getCounty, getCountyName } from './counties.js'
import { FARMS } from './seedFarms.js'

describe('counties', () => {
  it('getCounty returns the record for a known slug', () => {
    expect(getCounty('kiambu')).toMatchObject({ slug: 'kiambu', name: 'Kiambu' })
  })

  it('getCounty returns undefined for an unknown slug', () => {
    expect(getCounty('atlantis')).toBeUndefined()
  })

  it('getCountyName returns the display name for a known slug', () => {
    expect(getCountyName('kiambu')).toBe('Kiambu')
  })

  it('getCountyName returns a readable fallback for unknown slug', () => {
    const result = getCountyName('atlantis')
    expect(result).toBe('Unknown county')
    expect(result).not.toBeUndefined()
  })

  it('every county has slug, name and region', () => {
    for (const county of COUNTIES) {
      expect(county.slug).toBeTruthy()
      expect(county.name).toBeTruthy()
      expect(county.region).toBeTruthy()
    }
  })

  it('slugs are unique', () => {
    const slugs = COUNTIES.map((county) => county.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('contains all 47 Kenya counties', () => {
    expect(COUNTIES).toHaveLength(47)
  })

  it('has no orphaned seed-farm county slugs', () => {
    const countySlugs = new Set(COUNTIES.map((county) => county.slug))
    const orphaned = [
      ...new Set(FARMS.map((farm) => farm.countySlug)),
    ].filter((slug) => !countySlugs.has(slug))

    expect(orphaned).toEqual([])
  })
})
