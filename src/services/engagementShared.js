import { SEED_COMMENTS, SEED_REVIEWS } from '../data/seedReviews'

export function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function hasReacted(reactions, emoji, actor) {
  return reactions.some((reaction) =>
    reaction.emoji === emoji && (reaction.actor ?? reaction.actorId) === actor,
  )
}

export function reactionCounts(reactions) {
  return reactions.reduce((counts, reaction) => {
    counts[reaction.emoji] = (counts[reaction.emoji] ?? 0) + 1
    return counts
  }, {})
}

function timestampValue(value) {
  if (value && typeof value.toDate === 'function') return value.toDate().getTime()
  if (value instanceof Date) return value.getTime()
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

function mergeById(...groups) {
  return Array.from(
    groups.flat().reduce((merged, item) => merged.set(item.id, item), new Map()).values(),
  )
}

export function assembleReviews({ farmId, reviews = [], comments = [], reactions = [] }) {
  const allReviews = mergeById(
    SEED_REVIEWS.filter((review) => review.farmId === farmId),
    reviews.filter((review) => review.farmId === farmId),
  )
  const activeReviews = allReviews.filter((review) => review.deletedAt == null)
  const activeReviewIds = new Set(activeReviews.map((review) => review.id))
  const allComments = mergeById(
    SEED_COMMENTS.filter((comment) => activeReviewIds.has(comment.reviewId)),
    comments.filter((comment) => activeReviewIds.has(comment.reviewId)),
  ).filter((comment) => comment.deletedAt == null)

  return activeReviews
    .map((review) => ({
      ...review,
      comments: allComments
        .filter((comment) => comment.reviewId === review.id)
        .sort((a, b) => timestampValue(a.createdAt) - timestampValue(b.createdAt)),
      reactions: reactions.filter((reaction) => reaction.targetId === review.id),
    }))
    .sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt))
}
