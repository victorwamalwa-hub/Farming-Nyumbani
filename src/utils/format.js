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
 * Uses a stable "KES 45,000 / season" label across browser locales. Falls back
 * to a readable string when rent is missing or non-numeric.
 */
export function rentLabel(farm) {
  const rent = farm?.rentKes
  if (rent == null || Number.isNaN(Number(rent))) return 'Rent on request'

  const amount = new Intl.NumberFormat('en-KE', {
    maximumFractionDigits: 0,
  }).format(Number(rent))

  const period = farm?.rentPeriod ? ` / ${farm.rentPeriod}` : ''
  return `KES ${amount}${period}`
}

export function initials(value) {
  const words = typeof value === 'string' ? value.trim().split(/\s+/).filter(Boolean) : []
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

/**
 * Human date for review timestamps: "18 Jan 2026".
 * Returns an em dash for unparseable input.
 */
export function formatDate(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Rating display: "5 out of 5", floored to integers in 1–5.
 */
export function formatRating(rating) {
  const n = Math.round(Number(rating))
  if (Number.isNaN(n)) return '—'
  const clamped = Math.min(5, Math.max(1, n))
  return `${clamped} out of 5`
}