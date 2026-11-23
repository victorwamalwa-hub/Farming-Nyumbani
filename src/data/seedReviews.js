export const MIN_REVIEW_LENGTH = 20

export const SEED_REVIEWS = [  {
    id: 'review-ngoliba-01',
    authorId: 'seed-user-1',
    author: 'Faith A.',
    farmId: 'kiambu-ngoliba-tomato-block',
    rating: 5,
    body: 'Clear farm details, easy access from Thika, and the borehole worked throughout the season.',
    createdAt: '2026-01-18T10:30:00.000Z',
    deletedAt: null,
  },
  {
    id: 'review-ngoliba-02',
    authorId: 'seed-user-2',
    author: 'Daniel M.',
    farmId: 'kiambu-ngoliba-tomato-block',
    rating: 4,
    body: 'Good soil and a convenient location for market deliveries. The shed could use more shelving.',
    createdAt: '2026-02-06T14:15:00.000Z',
    deletedAt: null,
  },
  {
    id: 'review-kandara-01',
    authorId: 'seed-user-3',
    author: 'Mary N.',
    farmId: 'muranga-kandara-coffee',
    rating: 5,
    body: 'The existing coffee trees were healthy and the caretaker explained the maintenance schedule clearly.',
    createdAt: '2026-01-24T09:45:00.000Z',
    deletedAt: null,
  },
  {
    id: 'review-rongai-01',
    authorId: 'seed-user-4',
    author: 'Brian O.',
    farmId: 'nakuru-rongai-maize',
    rating: 4,
    body: 'The block was level and easy to access with a lorry. It is important to confirm rainfall before leasing.',
    createdAt: '2026-02-12T11:20:00.000Z',
    deletedAt: null,
  },
  {
    id: 'review-lurambi-01',
    authorId: 'seed-user-5',
    author: 'David W.',
    farmId: 'kakamega-lurambi-mixed',
    rating: 4,
    body: 'Reliable rainfall and useful river frontage. The title verification process took a little longer than planned.',
    createdAt: '2026-01-29T16:05:00.000Z',
    deletedAt: null,
  },
  {
    id: 'review-kitengela-01',
    authorId: 'seed-user-6',
    author: 'Naomi S.',
    farmId: 'kajiado-kitengela-fodder',
    rating: 5,
    body: 'The borehole was dependable and the owner explained the water-meter limit before we started.',
    createdAt: '2026-02-03T13:40:00.000Z',
    deletedAt: null,
  },
  {
    id: 'review-nkubu-01',
    authorId: 'seed-user-7',
    author: 'Peter M.',
    farmId: 'meru-nkubu-avocado',
    rating: 5,
    body: 'Excellent volcanic soil and a gentle slope for drainage. A strong choice for a long-term avocado lease.',
    createdAt: '2026-02-10T08:25:00.000Z',
    deletedAt: null,
  },
  {
    id: 'review-moiben-01',
    authorId: 'seed-user-8',
    author: 'Christine K.',
    farmId: 'uasin-gishu-moiben-wheat',
    rating: 4,
    body: 'Large enough for mechanized work and easy to divide into fields. The storage shed was useful.',
    createdAt: '2026-02-14T12:10:00.000Z',
    deletedAt: null,
  },
]

export { SEED_COMMENTS } from './seedComments'

/** Kept for callers that still import the original name. */
export const REVIEWS = SEED_REVIEWS
export default SEED_REVIEWS