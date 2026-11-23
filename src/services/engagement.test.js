import { beforeEach, describe, expect, it, vi } from 'vitest'

const firestore = vi.hoisted(() => ({
  collection: vi.fn((database, name) => ({ database, name })),
  getDocs: vi.fn(),
  query: vi.fn((reference, ...constraints) => ({ reference, constraints })),
  where: vi.fn((...args) => args),
}))

vi.mock('firebase/firestore', () => firestore)
vi.mock('../lib/firebase', () => ({ db: { name: 'test-db' } }))

import { assembleReviews, listReviews } from './engagement'

const farmId = 'kiambu-ngoliba-tomato-block'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('assembleReviews', () => {
  it('merges seed and stored engagement, removes deleted records, and sorts newest-first', () => {
    const reviews = assembleReviews({
      farmId,
      storedReviews: [
        {
          id: 'stored-review',
          farmId,
          author: 'Amina',
          rating: 5,
          body: 'A newer stored review.',
          createdAt: '2026-03-01T10:00:00.000Z',
          deletedAt: null,
        },
        {
          id: 'review-ngoliba-01',
          farmId,
          deletedAt: '2026-03-02T10:00:00.000Z',
        },
      ],
      comments: [{
        id: 'stored-comment',
        farmId,
        reviewId: 'review-ngoliba-02',
        body: 'Stored comment',
        createdAt: '2026-02-08T10:00:00.000Z',
        deletedAt: null,
      }],
      reactions: [{
        id: 'reaction-1',
        farmId,
        targetId: 'review-ngoliba-02',
        emoji: '👍',
      }],
    })

    expect(reviews.map((review) => review.id)).toEqual([
      'stored-review',
      'review-ngoliba-02',
    ])
    expect(reviews[1].comments.map((comment) => comment.id)).toEqual([
      'comment-ngoliba-03',
      'stored-comment',
    ])
    expect(reviews[1].reactions).toEqual([{
      id: 'reaction-1',
      farmId,
      targetId: 'review-ngoliba-02',
      emoji: '👍',
    }])
    expect(reviews[1].createdAt).toBe('2026-02-06T14:15:00.000Z')
  })
})

describe('listReviews', () => {
  it('loads farm-scoped reviews, comments, and reactions from Firestore', async () => {
    const docsByCollection = {
      reviews: [{
        id: 'firestore-review',
        data: () => ({
          farmId,
          author: 'Amina',
          rating: 5,
          body: 'A stored review from Firestore.',
          createdAt: { toDate: () => new Date('2026-03-01T10:00:00.000Z') },
          deletedAt: null,
        }),
      }],
      comments: [],
      reactions: [],
    }
    firestore.getDocs.mockImplementation(async ({ reference }) => ({
      docs: docsByCollection[reference.name],
    }))

    const reviews = await listReviews(farmId)

    expect(firestore.getDocs).toHaveBeenCalledTimes(3)
    expect(reviews[0]).toMatchObject({
      id: 'firestore-review',
      author: 'Amina',
      comments: [],
      reactions: [],
    })
    expect(reviews.some((review) => review.id === 'review-ngoliba-01')).toBe(true)
    expect(firestore.where).toHaveBeenCalledWith('farmId', '==', farmId)
  })
})
