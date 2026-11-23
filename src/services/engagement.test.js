import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addComment,
  addReview,
  hasReacted,
  listMyContributions,
  listMyLeaseRequests,
  listReports,
  listReviews,
  listTrash,
  purgeItem,
  reactionCounts,
  reportFarm,
  requestLease,
  restoreItem,
  softDeleteItem,
  toggleReaction,
} from './engagement'

const FARM = 'kiambu-ngoliba-tomato-block'

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('listReviews', () => {
  it('returns the sample reviews for a farm, newest first', async () => {
    const reviews = await listReviews(FARM)
    expect(reviews.map((review) => review.id)).toEqual(['review-ngoliba-02', 'review-ngoliba-01'])
  })

  it('attaches comments in chronological order', async () => {
    const review = (await listReviews(FARM)).find((item) => item.id === 'review-ngoliba-01')
    expect(review.comments.map((comment) => comment.id)).toEqual([
      'comment-ngoliba-01',
      'comment-ngoliba-02',
    ])
  })

  it('returns an empty list for a farm with no reviews', async () => {
    expect(await listReviews('unknown-farm')).toEqual([])
  })
})

describe('addReview', () => {
  it('persists a review and lists it under the farm', async () => {
    const created = await addReview({
      farmId: FARM,
      author: '  Test Tenant  ',
      rating: 4,
      body: '  Water held up and the shed was dry.  ',
    })

    expect(created.author).toBe('Test Tenant')
    expect(created.body).toBe('Water held up and the shed was dry.')

    const reviews = await listReviews(FARM)
    expect(reviews).toHaveLength(3)
    expect(reviews.some((review) => review.id === created.id)).toBe(true)
  })

  it('does not leak reviews between farms', async () => {
    await addReview({
      farmId: 'kakamega-lurambi-mixed',
      author: 'Moses',
      rating: 3,
      body: 'Workable but wet.',
    })

    expect(await listReviews(FARM)).toHaveLength(2)
    expect(await listReviews('kakamega-lurambi-mixed')).toHaveLength(2)
  })
})

describe('addComment', () => {
  it('adds a comment to a review and keeps it after re-reading', async () => {
    await addComment({ reviewId: 'review-ngoliba-01', author: 'Kevin', body: 'Was the pump extra?' })

    const review = (await listReviews(FARM)).find((item) => item.id === 'review-ngoliba-01')
    expect(review.comments).toHaveLength(3)
    expect(review.comments[2].body).toBe('Was the pump extra?')
  })
})

describe('toggleReaction', () => {
  it('adds a reaction then removes it on the second click', async () => {
    const added = await toggleReaction({ targetId: 'review-ngoliba-01', emoji: '🌱', actor: 'Kevin' })
    expect(added).toHaveLength(1)
    expect(hasReacted(added, '🌱', 'Kevin')).toBe(true)

    const removed = await toggleReaction({ targetId: 'review-ngoliba-01', emoji: '🌱', actor: 'Kevin' })
    expect(removed).toHaveLength(0)
    expect(hasReacted(removed, '🌱', 'Kevin')).toBe(false)
  })

  it('keeps reactions from different people separate', async () => {
    await toggleReaction({ targetId: 'review-ngoliba-01', emoji: '🌱', actor: 'Kevin' })
    await toggleReaction({ targetId: 'review-ngoliba-01', emoji: '🌱', actor: 'Amina' })

    const review = (await listReviews(FARM)).find((item) => item.id === 'review-ngoliba-01')
    expect(reactionCounts(review.reactions)).toEqual({ '🌱': 2 })
  })

  it('does not affect another target', async () => {
    await toggleReaction({ targetId: 'review-ngoliba-02', emoji: '⚠️', actor: 'Kevin' })

    const first = (await listReviews(FARM)).find((item) => item.id === 'review-ngoliba-01')
    expect(first.reactions).toHaveLength(0)
  })
})

describe('delete and restore', () => {
  it('hides a review after deleting it but keeps the record', async () => {
    const created = await addReview({
      farmId: FARM,
      author: 'Amina',
      rating: 4,
      body: 'Good water all season.',
    })
    expect(await listReviews(FARM)).toHaveLength(3)

    expect(await softDeleteItem('reviews', created.id)).toBe(true)
    expect(await listReviews(FARM)).toHaveLength(2)

    // Still on disk, just stamped, and tagged with the collection it came from.
    expect(await listTrash('Amina')).toMatchObject([{ id: created.id, kind: 'reviews' }])
  })

  it('brings a deleted review back with its original text', async () => {
    const created = await addReview({
      farmId: FARM,
      author: 'Amina',
      rating: 5,
      body: 'Best plot I leased.',
    })
    await softDeleteItem('reviews', created.id)

    expect(await restoreItem('reviews', created.id)).toBe(true)

    const restored = (await listReviews(FARM)).find((review) => review.id === created.id)
    expect(restored.body).toBe('Best plot I leased.')
    expect(await listTrash('Amina')).toHaveLength(0)
  })

  it('hides deleted comments but keeps the review visible', async () => {
    const comment = await addComment({
      reviewId: 'review-ngoliba-01',
      author: 'Amina',
      body: 'Thanks for this.',
    })
    await softDeleteItem('comments', comment.id)

    const review = (await listReviews(FARM)).find((item) => item.id === 'review-ngoliba-01')
    expect(review.comments.some((item) => item.id === comment.id)).toBe(false)
    expect((await listReviews(FARM)).some((item) => item.id === 'review-ngoliba-01')).toBe(true)
  })

  it('keeps deleted items out of the contributions list', async () => {
    const created = await addReview({
      farmId: FARM,
      author: 'Amina',
      rating: 4,
      body: 'Solid plot overall.',
    })
    expect((await listMyContributions('Amina')).reviews).toHaveLength(1)

    await softDeleteItem('reviews', created.id)
    expect((await listMyContributions('Amina')).reviews).toHaveLength(0)

    await restoreItem('reviews', created.id)
    expect((await listMyContributions('Amina')).reviews).toHaveLength(1)
  })

  it('refuses to delete reports, because nothing in the UI offers it', async () => {
    const report = await reportFarm({ farmId: FARM, reason: 'Wrong county', reporter: 'Amina' })

    expect(await softDeleteItem('reports', report.id)).toBe(false)
    expect(await restoreItem('reports', report.id)).toBe(false)
    expect(await purgeItem('reports', report.id)).toBe(false)
    expect(await listReports(FARM)).toHaveLength(1)
  })

  it('only lists the trash of the given author', async () => {
    const mine = await addReview({
      farmId: FARM,
      author: 'Amina',
      rating: 4,
      body: 'Mine to delete.',
    })
    const theirs = await addReview({
      farmId: FARM,
      author: 'Kevin',
      rating: 3,
      body: 'Not mine to delete.',
    })
    await softDeleteItem('reviews', mine.id)
    await softDeleteItem('reviews', theirs.id)

    expect(await listTrash('Amina')).toMatchObject([{ id: mine.id, kind: 'reviews' }])
    expect(await listTrash('')).toEqual([])
  })

  it('removes the record permanently with purgeItem', async () => {
    const created = await addReview({
      farmId: FARM,
      author: 'Amina',
      rating: 4,
      body: 'Gone for good now.',
    })
    await softDeleteItem('reviews', created.id)

    expect(await purgeItem('reviews', created.id)).toBe(true)
    expect(await listTrash('Amina')).toHaveLength(0)
    expect(await restoreItem('reviews', created.id)).toBe(false)
  })

  it('returns false for an unknown item or collection', async () => {
    expect(await softDeleteItem('reviews', 'nope')).toBe(false)
    expect(await restoreItem('comments', 'nope')).toBe(false)
    expect(await purgeItem('reviews', 'nope')).toBe(false)
    expect(await softDeleteItem('farms', 'nope')).toBe(false)
  })
})

describe('failed writes', () => {
  const REVIEW = {
    farmId: FARM,
    author: 'Amina',
    rating: 4,
    body: 'Water held up and the shed stayed dry.',
  }

  it('reports a full or blocked storage instead of claiming the review saved', async () => {
    vi.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem').mockImplementation(() => {
      throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
    })

    await expect(addReview(REVIEW)).rejects.toThrow(/nothing was saved/i)

    // Nothing half-written: the list is exactly the sample reviews.
    expect(await listReviews(FARM)).toHaveLength(2)
  })

  it('catches a browser that accepts the write and then drops it', async () => {
    vi.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem').mockImplementation(() => {})

    await expect(requestLease({ ...REVIEW, requester: 'Amina' })).rejects.toThrow(
      /nothing was saved/i,
    )
    expect(await listMyLeaseRequests('Amina')).toEqual([])
  })

  it('reports a failed delete rather than showing the item as gone', async () => {
    const created = await addReview(REVIEW)
    vi.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked in private mode.', 'SecurityError')
    })

    await expect(softDeleteItem('reviews', created.id)).rejects.toThrow(/nothing was saved/i)

    // The review is still visible, which is where a reload would leave it.
    expect(await listReviews(FARM)).toHaveLength(3)
  })
})

describe('lease requests', () => {
  it('saves a request under the requester and lists only their own', async () => {
    await requestLease({
      farmId: FARM,
      farmTitle: 'One-acre horticulture plot, Ngoliba',
      ownerName: 'Wanjiku Mwangi',
      requester: '  Amina  ',
      crops: '  Tomatoes and kales  ',
      startDate: '2026-11-01',
      message: '  I can start at the long rains.  ',
    })
    await requestLease({
      farmId: 'nakuru-rongai-maize',
      farmTitle: 'Five-acre maize block, Rongai',
      ownerName: 'Grace Otieno',
      requester: 'Kevin',
      crops: 'Maize',
      message: 'Ready whenever the season opens.',
    })

    const mine = await listMyLeaseRequests('Amina')
    expect(mine).toHaveLength(1)
    expect(mine[0]).toMatchObject({
      farmId: FARM,
      requester: 'Amina',
      crops: 'Tomatoes and kales',
      startDate: '2026-11-01',
      message: 'I can start at the long rains.',
      status: 'pending',
    })
    expect(await listMyLeaseRequests('Kevin')).toHaveLength(1)
    expect(await listMyLeaseRequests('')).toEqual([])
  })

  it('keeps requests after a reload of the service', async () => {
    const created = await requestLease({
      farmId: FARM,
      farmTitle: 'One-acre horticulture plot, Ngoliba',
      ownerName: 'Wanjiku Mwangi',
      requester: 'Amina',
      crops: 'Kales',
      message: 'Could I view the plot on Saturday?',
    })

    const reloaded = await listMyLeaseRequests('Amina')
    expect(reloaded[0].id).toBe(created.id)
  })
})

describe('reportFarm', () => {
  it('records a report with the reporter and reason', async () => {
    await reportFarm({
      farmId: FARM,
      reason: 'Photos do not match the plot',
      note: '  The photo shows a greenhouse. ',
      reporter: 'Amina',
    })

    const reports = await listReports(FARM)
    expect(reports).toHaveLength(1)
    expect(reports[0]).toMatchObject({
      farmId: FARM,
      reason: 'Photos do not match the plot',
      note: 'The photo shows a greenhouse.',
      reporter: 'Amina',
    })
    expect(await listReports('nakuru-rongai-maize')).toHaveLength(0)
  })
})