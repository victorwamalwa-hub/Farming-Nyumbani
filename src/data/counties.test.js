import { describe, expect, it } from 'vitest'
import { COUNTIES, getCounty, getCountyName } from './counties.js'

describe('county data', () => {
  it('contains all 47 Kenya counties', () => {
    expect(COUNTIES).toHaveLength(47)
  })

  it('looks up counties by slug', () => {
    expect(getCounty('nairobi')?.name).toBe('Nairobi')
  })

  it('includes region data for seed-farm counties', () => {
    expect(getCounty('kiambu')?.region).toBe('Central')
    expect(getCounty('nakuru')?.region).toBe('Rift Valley')
    expect(getCounty('mombasa')?.region).toBe('Coast')
  })

  it('returns a county name or Unknown county', () => {
    expect(getCountyName('UASIN-GISHU')).toBe('Uasin Gishu')
    expect(getCountyName('unknown')).toBe('Unknown county')
  })

  it('uses unique, lower-case slugs', () => {
    const slugs = COUNTIES.map((county) => county.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    slugs.forEach((slug) => expect(slug).toBe(slug.toLowerCase()))
  })
})
