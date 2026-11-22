export const CROPS = [
  {
    slug: 'maize',
    name: 'Maize',
    category: 'Cereal',
    regions: ['Uasin Gishu', 'Trans Nzoia', 'Nakuru', 'Bungoma'],
    season: 'March-May and October-December',
    harvestDays: '90-150',
  },
  {
    slug: 'beans',
    name: 'Beans',
    category: 'Legume',
    regions: ['Meru', 'Nyeri', 'Nakuru', 'Machakos'],
    season: 'March-May and October-December',
    harvestDays: '60-90',
  },
  {
    slug: 'irish-potato',
    name: 'Irish Potato',
    category: 'Root crop',
    regions: ['Nyandarua', 'Nakuru', 'Elgeyo-Marakwet'],
    season: 'March-May and October-December',
    harvestDays: '90-120',
  },
  {
    slug: 'coffee',
    name: 'Coffee',
    category: 'Cash crop',
    regions: ['Kirinyaga', 'Nyeri', 'Muranga', 'Kiambu'],
    season: 'Year-round',
    harvestDays: '730-1095',
  },
  {
    slug: 'tea',
    name: 'Tea',
    category: 'Cash crop',
    regions: ['Kericho', 'Nandi', 'Bomet', 'Muranga'],
    season: 'Year-round',
    harvestDays: '1095-1825',
  },
  {
    slug: 'tomato',
    name: 'Tomato',
    category: 'Vegetable',
    regions: ['Kirinyaga', 'Kajiado', 'Nakuru', 'Taita-Taveta'],
    season: 'Year-round with irrigation',
    harvestDays: '60-90',
  },
  {
    slug: 'avocado',
    name: 'Avocado',
    category: 'Fruit',
    regions: ['Muranga', 'Kiambu', 'Nyeri', 'Bungoma'],
    season: 'Year-round',
    harvestDays: '730-1095',
  },
  {
    slug: 'sweet-potato',
    name: 'Sweet Potato',
    category: 'Root crop',
    regions: ['Busia', 'Homa Bay', 'Kisii', 'Machakos'],
    season: 'Year-round',
    harvestDays: '90-150',
  },
]

export default CROPS

const CROPS_BY_SLUG = new Map(CROPS.map((crop) => [crop.slug, crop]));

export function getCrop(slug) {
  if (typeof slug !== 'string') return undefined;
  return CROPS_BY_SLUG.get(slug.toLowerCase());
}


