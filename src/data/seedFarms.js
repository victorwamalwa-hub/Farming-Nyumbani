// Sample reviews so the engagement features are visible before accounts exist.
// Read-only: user-generated reviews are stored separately and appended after these.
// temporary, in a console or test
console.log([...new Set(farms.map(f => f.countySlug))].sort())
export const SEED_REVIEWS = [
  {
    id: 'seed-rev-1',
    farmId: 'kiambu-ngoliba-tomato-block',
    author: 'Mercy Njoroge',
    rating: 5,
    body: 'Water was reliable right through the dry spell and the shed saved my inputs. Wanjiku gave me access a week early to prepare beds.',
    createdAt: Date.parse('2026-03-12T08:00:00Z'),
  },
  {
    id: 'seed-rev-2',
    farmId: 'kiambu-ngoliba-tomato-block',
    author: 'Brian Ochieng',
    rating: 4,
    body: 'Good plot and an honest landlord. The access road turns rough in heavy rain, so plan your deliveries around the weather.',
    createdAt: Date.parse('2026-02-02T09:30:00Z'),
  },
  {
    id: 'seed-rev-3',
    farmId: 'nakuru-rongai-maize',
    author: 'Halima Abdi',
    rating: 4,
    body: 'Five acres of flat, workable land and the owner arranged ploughing at a fair price. Rain-fed only, so plant with the long rains.',
    createdAt: Date.parse('2026-02-20T11:15:00Z'),
  },
]

export const SEED_COMMENTS = [
  {
    id: 'seed-cmt-1',
    reviewId: 'seed-rev-1',
    author: 'Amina Yusuf',
    body: 'Did you have to top up for water beyond the agreed limit?',
    createdAt: Date.parse('2026-03-12T10:05:00Z'),
  },
  {
    id: 'seed-cmt-2',
    reviewId: 'seed-rev-1',
    author: 'Mercy Njoroge',
    body: 'No, the borehole covered the whole tomato cycle. I only paid for the pump service once.',
    createdAt: Date.parse('2026-03-12T12:40:00Z'),
  },
  {
    id: 'seed-cmt-3',
    reviewId: 'seed-rev-2',
    author: 'Kevin Mwangi',
    body: 'Useful, thanks. Which months were worst for the road?',
    createdAt: Date.parse('2026-02-03T07:20:00Z'),
  },
]