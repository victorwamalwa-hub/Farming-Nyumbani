import { describe, expect, it } from 'vitest'
import { formatAcres, formatDate, formatRating, initials, rentLabel } from './format'

describe('formatAcres', () => {
  it('formats whole and decimal acre values', () => {
    expect(formatAcres(2)).toBe('2 acres')
    expect(formatAcres(1)).toBe('1 acre')
    expect(formatAcres(2.5)).toBe('2.5 acres')
  })

  it('returns a fallback for invalid values', () => {
    expect(formatAcres(null)).toBe('—')
    expect(formatAcres('not a number')).toBe('—')
  })
})

describe('rentLabel', () => {
  it('formats a farm rent and period', () => {
    expect(rentLabel({ rentKes: 45000, rentPeriod: 'season' })).toBe('KES 45,000 / season')
  })

  it('returns a fallback when rent is unavailable', () => {
    expect(rentLabel({})).toBe('Rent on request')
  })
})

describe('initials', () => {
  it('uses the first and last name initials', () => {
    expect(initials('Wanjiku Mwangi')).toBe('WM')
  })

  it('returns a fallback for an empty name', () => {
    expect(initials('')).toBe('?')
  })
})

describe('format edge cases', () => {
  it('formatAcres handles null and non-numeric input', () => {
    expect(formatAcres(null)).toBe('—')
    expect(formatAcres('nope')).toBe('—')
  })

  it('formatDate handles null and invalid input', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate('not a date')).toBe('—')
  })

  it('formatRating clamps invalid values', () => {
    expect(formatRating(Number.NaN)).toBe('—')
    expect(formatRating(10)).toBe('5 out of 5')
    expect(formatRating(0)).toBe('1 out of 5')
  })

  it('rentLabel handles missing period and missing rent', () => {
    expect(rentLabel({})).toBe('Rent on request')
    expect(rentLabel({ rentKes: 50000 })).toBe('KES 50,000')
  })
})
