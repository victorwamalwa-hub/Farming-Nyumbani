export const COUNTIES = [
  { slug: 'baringo', name: 'Baringo' },
  { slug: 'bomet', name: 'Bomet' },
  { slug: 'bungoma', name: 'Bungoma' },
  { slug: 'busia', name: 'Busia' },
  { slug: 'elgeyo-marakwet', name: 'Elgeyo-Marakwet' },
  { slug: 'embu', name: 'Embu' },
  { slug: 'garissa', name: 'Garissa' },
  { slug: 'homa-bay', name: 'Homa Bay' },
  { slug: 'isiolo', name: 'Isiolo' },
  { slug: 'kajiado', name: 'Kajiado' },
  { slug: 'kakamega', name: 'Kakamega' },
  { slug: 'kericho', name: 'Kericho' },
  { slug: 'kiambu', name: 'Kiambu' },
  { slug: 'kilifi', name: 'Kilifi' },
  { slug: 'kirinyaga', name: 'Kirinyaga' },
  { slug: 'kisii', name: 'Kisii' },
  { slug: 'kisumu', name: 'Kisumu' },
  { slug: 'kitui', name: 'Kitui' },
  { slug: 'kwale', name: 'Kwale' },
  { slug: 'laikipia', name: 'Laikipia' },
  { slug: 'lamu', name: 'Lamu' },
  { slug: 'machakos', name: 'Machakos' },
  { slug: 'makueni', name: 'Makueni' },
  { slug: 'mandera', name: 'Mandera' },
  { slug: 'marsabit', name: 'Marsabit' },
  { slug: 'meru', name: 'Meru' },
  { slug: 'migori', name: 'Migori' },
  { slug: 'mombasa', name: 'Mombasa' },
  { slug: 'muranga', name: 'Muranga' },
  { slug: 'nairobi', name: 'Nairobi' },
  { slug: 'nakuru', name: 'Nakuru' },
  { slug: 'nandi', name: 'Nandi' },
  { slug: 'narok', name: 'Narok' },
  { slug: 'nyamira', name: 'Nyamira' },
  { slug: 'nyandarua', name: 'Nyandarua' },
  { slug: 'nyeri', name: 'Nyeri' },
  { slug: 'samburu', name: 'Samburu' },
  { slug: 'siaya', name: 'Siaya' },
  { slug: 'taita-taveta', name: 'Taita-Taveta' },
  { slug: 'tana-river', name: 'Tana River' },
  { slug: 'tharaka-nithi', name: 'Tharaka-Nithi' },
  { slug: 'trans-nzoia', name: 'Trans Nzoia' },
  { slug: 'turkana', name: 'Turkana' },
  { slug: 'uasin-gishu', name: 'Uasin Gishu' },
  { slug: 'vihiga', name: 'Vihiga' },
  { slug: 'wajir', name: 'Wajir' },
  { slug: 'west-pokot', name: 'West Pokot' },
]

export default COUNTIES

const COUNTIES_BY_SLUG = new Map(
  COUNTIES.map((county) => [county.slug, county]),
)

export function getCounty(slug) {
  if (typeof slug !== 'string') return undefined
  return COUNTIES_BY_SLUG.get(slug.toLowerCase())
}

export function getCountyName(slug) {
  return getCounty(slug)?.name ?? ''
}
