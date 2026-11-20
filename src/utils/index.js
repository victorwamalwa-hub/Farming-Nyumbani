export function formatDate(value) {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function truncateText(value, limit = 120) {
  if (typeof value !== 'string') return ''
  if (value.length <= limit) return value

  return `${value.slice(0, limit).trimEnd()}...`
}
