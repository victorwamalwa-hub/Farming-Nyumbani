export const COUNTIES = [
  { slug: 'baringo', name: 'Baringo', region: 'Rift Valley' },
  { slug: 'bomet', name: 'Bomet', region: 'Rift Valley' },
  { slug: 'bungoma', name: 'Bungoma', region: 'Western' },
  { slug: 'busia', name: 'Busia', region: 'Western' },
  { slug: 'elgeyo-marakwet', name: 'Elgeyo-Marakwet', region: 'Rift Valley' },
  { slug: 'embu', name: 'Embu', region: 'Eastern' },
  { slug: 'garissa', name: 'Garissa', region: 'North Eastern' },
  { slug: 'homa-bay', name: 'Homa Bay', region: 'Nyanza' },
  { slug: 'isiolo', name: 'Isiolo', region: 'Eastern' },
  { slug: 'kajiado', name: 'Kajiado', region: 'Rift Valley' },
  { slug: 'kakamega', name: 'Kakamega', region: 'Western' },
  { slug: 'kericho', name: 'Kericho', region: 'Rift Valley' },
  { slug: 'kiambu', name: 'Kiambu', region: 'Central' },
  { slug: 'kilifi', name: 'Kilifi', region: 'Coast' },
  { slug: 'kirinyaga', name: 'Kirinyaga', region: 'Central' },
  { slug: 'kisii', name: 'Kisii', region: 'Nyanza' },
  { slug: 'kisumu', name: 'Kisumu', region: 'Nyanza' },
  { slug: 'kitui', name: 'Kitui', region: 'Eastern' },
  { slug: 'kwale', name: 'Kwale', region: 'Coast' },
  { slug: 'laikipia', name: 'Laikipia', region: 'Central' },
  { slug: 'lamu', name: 'Lamu', region: 'Coast' },
  { slug: 'machakos', name: 'Machakos', region: 'Eastern' },
  { slug: 'makueni', name: 'Makueni', region: 'Eastern' },
  { slug: 'mandera', name: 'Mandera', region: 'North Eastern' },
  { slug: 'marsabit', name: 'Marsabit', region: 'Eastern' },
  { slug: 'meru', name: 'Meru', region: 'Eastern' },
  { slug: 'migori', name: 'Migori', region: 'Nyanza' },
  { slug: 'mombasa', name: 'Mombasa', region: 'Coast' },
  { slug: 'muranga', name: 'Muranga', region: 'Central' },
  { slug: 'nairobi', name: 'Nairobi', region: 'Nairobi' },
  { slug: 'nakuru', name: 'Nakuru', region: 'Rift Valley' },
  { slug: 'nandi', name: 'Nandi', region: 'Rift Valley' },
  { slug: 'narok', name: 'Narok', region: 'Rift Valley' },
  { slug: 'nyamira', name: 'Nyamira', region: 'Nyanza' },
  { slug: 'nyandarua', name: 'Nyandarua', region: 'Central' },
  { slug: 'nyeri', name: 'Nyeri', region: 'Central' },
  { slug: 'samburu', name: 'Samburu', region: 'Rift Valley' },
  { slug: 'siaya', name: 'Siaya', region: 'Nyanza' },
  { slug: 'taita-taveta', name: 'Taita-Taveta', region: 'Coast' },
  { slug: 'tana-river', name: 'Tana River', region: 'Coast' },
  { slug: 'tharaka-nithi', name: 'Tharaka-Nithi', region: 'Eastern' },
  { slug: 'trans-nzoia', name: 'Trans Nzoia', region: 'Rift Valley' },
  { slug: 'turkana', name: 'Turkana', region: 'Rift Valley' },
  { slug: 'uasin-gishu', name: 'Uasin Gishu', region: 'Rift Valley' },
  { slug: 'vihiga', name: 'Vihiga', region: 'Western' },
  { slug: 'wajir', name: 'Wajir', region: 'North Eastern' },
  { slug: 'west-pokot', name: 'West Pokot', region: 'Rift Valley' },
]

export default COUNTIES

const bySlug = new Map(
  COUNTIES.map((county) => [county.slug, county]),
)

export function getCounty(slug) {
  if (typeof slug !== 'string') return undefined
  return bySlug.get(slug.toLowerCase())
}

export function getCountyName(slug) {
  const county = getCounty(slug)
  return county ? county.name : 'Unknown county'
}
