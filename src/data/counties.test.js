import { describe, expect, it } from 'vitest'
import { COUNTIES, getCounty, getCountyName } from './counties.js'

describe('county data', () => {
  it('contains all 47 Kenya counties', () => {
    expect(COUNTIES).toHaveLength(47)
  })

  it('looks up counties by slug', () => {
    expect(getCounty('nairobi')?.name).toBe('Nairobi')
  })

  it('returns a county name or an empty string', () => {
    expect(getCountyName('UASIN-GISHU')).toBe('Uasin Gishu')
    expect(getCountyName('unknown')).toBe('')
  })

  it('uses unique, lower-case slugs', () => {
    const slugs = COUNTIES.map((county) => county.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    slugs.forEach((slug) => expect(slug).toBe(slug.toLowerCase()))
  })
})
