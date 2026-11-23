import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  listDeletedContributions,
  listMyContributions,
  listMyLeaseRequests,
  restoreContribution,
  softDeleteLocally,
} from './engagement'

vi.mock('./firebase', () => ({ db: null, isFirebaseConfigured: false }))

describe('local account engagement', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('lists only seed contributions matching the signed-in user', async () => {
    const contributions = await listMyContributions({
      uid: 'user-faith',
      displayName: 'Faith A.',
    })

    expect(contributions.reviews.map((item) => item.id)).toEqual(['review-ngoliba-01'])
    expect(contributions.comments.map((item) => item.id)).toEqual(['comment-ngoliba-02'])
    expect(contributions.reports).toEqual([])
  })

  it('moves a locally deleted contribution to the bin and restores it', async () => {
    const user = { uid: 'user-faith', displayName: 'Faith A.' }
    softDeleteLocally('review-ngoliba-01')

    const deleted = await listDeletedContributions(user)
    expect(deleted).toEqual([
      expect.objectContaining({
        id: 'review-ngoliba-01',
        kind: 'review',
        deletedAt: expect.any(String),
      }),
    ])
    expect((await listMyContributions(user)).reviews).toEqual([])

    await expect(restoreContribution(deleted[0])).resolves.toBe(true)
    expect(await listDeletedContributions(user)).toEqual([])
    expect((await listMyContributions(user)).reviews).toHaveLength(1)
  })

  it('lists only the signed-in user’s lease requests', async () => {
    localStorage.setItem(
      'farming-nyumbani:leaseRequests:v1',
      JSON.stringify([
        { id: 'mine', requesterId: 'user-faith', createdAt: '2026-03-01T00:00:00.000Z' },
        { id: 'theirs', requesterId: 'user-other', createdAt: '2026-03-02T00:00:00.000Z' },
      ]),
    )

    await expect(listMyLeaseRequests({ uid: 'user-faith' })).resolves.toEqual([
      expect.objectContaining({ id: 'mine' }),
    ])
  })

  it('rejects invalid local delete IDs instead of silently ignoring them', () => {
    expect(() => softDeleteLocally('')).toThrow('A contribution ID is required.')
  })
})
