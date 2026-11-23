import { SEED_REVIEWS } from '../data/seedReviews'
import { assembleReviews, createId } from './engagementShared'

const STORAGE_KEY = 'farming-nyumbani:engagement:v1'
const COLLECTIONS = ['reviews', 'comments', 'reactions', 'leaseRequests', 'reports']

function emptyStore() {
  return Object.fromEntries(COLLECTIONS.map((name) => [name, []]))
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return emptyStore()
    return Object.fromEntries(COLLECTIONS.map((name) => [
      name,
      Array.isArray(parsed[name]) ? parsed[name] : [],
    ]))
  } catch {
    return emptyStore()
  }
}

function writeStore(store) {
  const message = 'Nothing was saved. Check browser storage and try again.'
  try {
    const payload = JSON.stringify(store)
    window.localStorage.setItem(STORAGE_KEY, payload)
    if (window.localStorage.getItem(STORAGE_KEY) !== payload) throw new Error(message)
  } catch {
    throw new Error(message)
  }
}

function timestamp() {
  return new Date().toISOString()
}

function normalise(value) {
  return String(value ?? '').trim()
}

function updateStore(change) {
  const store = readStore()
  const result = change(store)
  writeStore(store)
  return result
}

export async function listReviews(farmId) {
  const store = readStore()
  return assembleReviews({
    farmId,
    reviews: store.reviews,
    comments: store.comments,
    reactions: store.reactions,
  })
}

export async function addReview(payload) {
  const review = {
    id: createId(),
    farmId: normalise(payload.farmId),
    author: normalise(payload.author),
    rating: Number(payload.rating),
    body: normalise(payload.body),
    createdAt: timestamp(),
    deletedAt: null,
  }
  updateStore((store) => store.reviews.push(review))
  return review
}

export async function addComment(payload) {
  const store = readStore()
  const review = [...SEED_REVIEWS, ...store.reviews].find((item) => item.id === payload.reviewId)
  const comment = {
    id: createId(),
    reviewId: normalise(payload.reviewId),
    farmId: review?.farmId ?? normalise(payload.farmId),
    author: normalise(payload.author),
    body: normalise(payload.body),
    createdAt: timestamp(),
    deletedAt: null,
  }
  store.comments.push(comment)
  writeStore(store)
  return comment
}

export async function toggleReaction({ targetId, emoji, actor }) {
  const store = readStore()
  const existingIndex = store.reactions.findIndex((reaction) =>
    reaction.targetId === targetId && reaction.emoji === emoji && reaction.actor === actor,
  )
  if (existingIndex >= 0) {
    store.reactions.splice(existingIndex, 1)
  } else {
    store.reactions.push({ id: createId(), targetId, emoji, actor })
  }
  writeStore(store)
  return store.reactions.filter((reaction) => reaction.targetId === targetId)
}

export async function requestLease(payload) {
  const request = {
    id: createId(),
    farmId: normalise(payload.farmId),
    farmTitle: normalise(payload.farmTitle),
    ownerName: normalise(payload.ownerName),
    requester: normalise(payload.requester),
    crops: normalise(payload.crops),
    startDate: normalise(payload.startDate),
    message: normalise(payload.message),
    status: 'pending',
    createdAt: timestamp(),
  }
  updateStore((store) => store.leaseRequests.push(request))
  return request
}

export async function listMyLeaseRequests(requester) {
  const name = normalise(requester)
  if (!name) return []
  return readStore().leaseRequests.filter((request) => request.requester === name)
}

export async function reportFarm(payload) {
  const report = {
    id: createId(),
    farmId: normalise(payload.farmId),
    reason: normalise(payload.reason),
    note: normalise(payload.note),
    reporter: normalise(payload.reporter),
    createdAt: timestamp(),
  }
  updateStore((store) => store.reports.push(report))
  return report
}

export async function listReports(farmId) {
  return readStore().reports.filter((report) => report.farmId === farmId)
}

export async function listMyContributions(author) {
  const name = normalise(author)
  if (!name) return { reviews: [], comments: [] }
  const store = readStore()
  return {
    reviews: store.reviews.filter((review) => review.author === name && review.deletedAt == null),
    comments: store.comments.filter((comment) => comment.author === name && comment.deletedAt == null),
  }
}

function getCollection(store, kind) {
  return kind === 'reviews' || kind === 'comments' ? store[kind] : null
}

export async function softDeleteItem(kind, id) {
  return updateStore((store) => {
    const items = getCollection(store, kind)
    const item = items?.find((entry) => entry.id === id)
    if (!item || item.deletedAt != null) return false
    item.deletedAt = timestamp()
    return true
  })
}

export async function restoreItem(kind, id) {
  return updateStore((store) => {
    const items = getCollection(store, kind)
    const item = items?.find((entry) => entry.id === id)
    if (!item || item.deletedAt == null) return false
    item.deletedAt = null
    return true
  })
}

export async function purgeItem(kind, id) {
  return updateStore((store) => {
    const items = getCollection(store, kind)
    const index = items?.findIndex((entry) => entry.id === id) ?? -1
    if (index < 0) return false
    items.splice(index, 1)
    return true
  })
}

export async function listTrash(author) {
  const name = normalise(author)
  if (!name) return []
  const store = readStore()
  return ['reviews', 'comments'].flatMap((kind) =>
    store[kind]
      .filter((item) => item.author === name && item.deletedAt != null)
      .map((item) => ({ ...item, kind })),
  )
}
