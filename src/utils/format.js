// src/utils/format.js

/**
 * Format a plot size for display. Expects acres as a number.
 * Whole numbers stay whole ("2 acres"), decimals keep one place ("2.5 acres"),
 * and anything unusable (null, NaN, non-numeric strings) renders an em dash.
 */
export function formatAcres(acres) {
  if (acres == null || Number.isNaN(Number(acres))) return '—'
  const n = Number(acres)
  const text = Number.isInteger(n) ? `${n}` : n.toFixed(1)
  return `${text} acre${n === 1 ? '' : 's'}`
}

/**
 * Build the rent label from a farm's rentKes + rentPeriod.
 * Uses en-KE so it renders as "KES 45,000 / season". Falls back to a
 * readable string when rent is missing or non-numeric.
 */
export function rentLabel(farm) {
  const rent = farm?.rentKes
  if (rent == null || Number.isNaN(Number(rent))) return 'Rent on request'

  const kes = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Number(rent))

  const period = farm?.rentPeriod ? ` / ${farm.rentPeriod}` : ''
  return `${kes}${period}`
}
