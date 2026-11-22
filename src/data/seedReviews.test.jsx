import { describe, expect, it } from 'vitest'
import { MIN_REVIEW_LENGTH, SEED_COMMENTS, SEED_REVIEWS } from './seedReviews'
import { FARMS } from './seedFarms'

const farmIds = new Set(FARMS.map((f) => f.id))
const reviewIds = new Set(SEED_REVIEWS.map((r) => r.id))

describe('seedReviews', () => {
  it('every review farmId points at a seeded farm', () => {
    for (const review of SEED_REVIEWS) {
      expect(farmIds.has(review.farmId), `review ${review.id} → unknown farm ${review.farmId}`).toBe(true)
    }
  })

  it('every comment reviewId points at a seeded review', () => {
    for (const comment of SEED_COMMENTS) {
      expect(reviewIds.has(comment.reviewId), `comment ${comment.id} → unknown review ${comment.reviewId}`).toBe(true)
    }
  })

  it('every review body meets MIN_REVIEW_LENGTH', () => {
    for (const review of SEED_REVIEWS) {
      expect(review.body.length, `review ${review.id} body too short`).toBeGreaterThanOrEqual(MIN_REVIEW_LENGTH)
    }
  })

  it('every review has a rating between 1 and 5', () => {
    for (const review of SEED_REVIEWS) {
      expect(review.rating).toBeGreaterThanOrEqual(1)
      expect(review.rating).toBeLessThanOrEqual(5)
    }
  })

  it('at least one review has comments', () => {
    expect(SEED_COMMENTS.length).toBeGreaterThan(0)
  })
})