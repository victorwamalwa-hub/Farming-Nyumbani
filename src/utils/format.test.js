import { describe, expect, it } from 'vitest'
import { formatAcres, rentLabel } from './format'

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
    const formattedKes = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(45000)

    expect(rentLabel({ rentKes: 45000, rentPeriod: 'season' })).toBe(`${formattedKes} / season`)
  })

  it('returns a fallback when rent is unavailable', () => {
    expect(rentLabel({})).toBe('Rent on request')
  })
})
