import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { SEED_COMMENTS, SEED_REVIEWS } from '../data/seedReviews'
import { db } from '../lib/firebase'

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

export function assembleReviews({
  farmId,
  storedReviews = [],
  comments = [],
  reactions = [],
}) {
  const reviews = mergeById(
    SEED_REVIEWS.filter((review) => review.farmId === farmId),
    storedReviews.filter((review) => review.farmId === farmId),
  )
  const activeReviews = reviews.filter((review) => review.deletedAt == null)
  const reviewIds = new Set(activeReviews.map((review) => review.id))
  const allComments = mergeById(
    SEED_COMMENTS.filter((comment) => reviewIds.has(comment.reviewId)),
    comments.filter((comment) => reviewIds.has(comment.reviewId)),
  ).filter((comment) => comment.deletedAt == null)

  return activeReviews
    .map((review) => ({
      ...review,
      comments: allComments.filter((comment) => comment.reviewId === review.id),
      reactions: reactions.filter((reaction) => reaction.targetId === review.id),
    }))
    .sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt))
}

function documents(snapshot) {
  return snapshot.docs.map((document) => ({
    ...document.data(),
    id: document.id,
  }))
}

export async function listReviews(farmId) {
  if (!db) return assembleReviews({ farmId })

  const readFarmCollection = async (name) => {
    const snapshot = await getDocs(
      query(collection(db, name), where('farmId', '==', farmId)),
    )
    return documents(snapshot)
  }

  const [storedReviews, comments, reactions] = await Promise.all([
    readFarmCollection('reviews'),
    readFarmCollection('comments'),
    readFarmCollection('reactions'),
  ])

  return assembleReviews({ farmId, storedReviews, comments, reactions })
}
