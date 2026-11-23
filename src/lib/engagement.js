import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { SEED_COMMENTS } from '../data/seedComments'
import { SEED_REVIEWS } from '../data/seedReviews'

const LEASE_REQUESTS_KEY = 'farming-nyumbani:leaseRequests:v1'
const DELETED_KEY = 'farming-nyumbani:deleted:v1'
const SEED_REPORTS = []

function storage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

function readJson(key, fallback) {
  const store = storage()
  if (!store) return fallback

  try {
    const parsed = JSON.parse(store.getItem(key) ?? 'null')
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  const store = storage()
  if (!store) throw new Error('Browser storage is unavailable; nothing was saved.')

  const payload = JSON.stringify(value)
  try {
    store.setItem(key, payload)
    if (store.getItem(key) !== payload) throw new Error('Browser storage did not save the update.')
  } catch (error) {
    throw new Error(`Could not save this update: ${error.message}`)
  }
}

function timestampValue(value) {
  if (value && typeof value.toDate === 'function') return value.toDate().getTime()
  const parsed = new Date(value ?? 0).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

function byNewest(a, b) {
  return timestampValue(b.createdAt) - timestampValue(a.createdAt)
}

function deletedNewestFirst(a, b) {
  return timestampValue(b.deletedAt) - timestampValue(a.deletedAt)
}

function documents(snapshot) {
  return snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }))
}

async function fetchMine(name, field, uid) {
  const snapshot = await getDocs(
    query(collection(db, name), where(field, '==', uid)),
  )
  return documents(snapshot)
}

function localSeed(name) {
  if (name === 'reviews') return SEED_REVIEWS
  if (name === 'comments') return SEED_COMMENTS
  if (name === 'reports') return SEED_REPORTS
  if (name === 'leaseRequests') {
    const requests = readJson(LEASE_REQUESTS_KEY, [])
    return Array.isArray(requests) ? requests : []
  }
  return []
}

function localDeletedIds() {
  const ids = readJson(DELETED_KEY, [])
  return Array.isArray(ids) ? ids : []
}

function applyLocalDeleted(items) {
  const deletedIds = new Set(localDeletedIds())
  return items.map((item) => (
    deletedIds.has(item.id)
      ? { ...item, deletedAt: item.deletedAt || new Date().toISOString() }
      : item
  ))
}

function matchesLocalUser(item, user) {
  return item.authorId === user.uid
    || item.requesterId === user.uid
    || item.reporterId === user.uid
    || Boolean(user.displayName && (
      item.author === user.displayName
      || item.requester === user.displayName
      || item.reporter === user.displayName
    ))
}

export async function listMyContributions(user) {
  if (!user?.uid) return { reviews: [], comments: [], reports: [] }

  if (!isFirebaseConfigured) {
    const ownActive = (name) => applyLocalDeleted(localSeed(name))
      .filter((item) => matchesLocalUser(item, user) && !item.deletedAt)
    return {
      reviews: ownActive('reviews'),
      comments: ownActive('comments'),
      reports: ownActive('reports'),
    }
  }

  const [reviews, comments, reports] = await Promise.all([
    fetchMine('reviews', 'authorId', user.uid),
    fetchMine('comments', 'authorId', user.uid),
    fetchMine('reports', 'reporterId', user.uid),
  ])
  return {
    reviews: reviews.filter((item) => !item.deletedAt),
    comments: comments.filter((item) => !item.deletedAt),
    reports: reports.filter((item) => !item.deletedAt),
  }
}

export async function listMyLeaseRequests(user) {
  if (!user?.uid) return []

  if (!isFirebaseConfigured) {
    return applyLocalDeleted(localSeed('leaseRequests'))
      .filter((item) => matchesLocalUser(item, user) && !item.deletedAt)
      .sort(byNewest)
  }

  return (await fetchMine('leaseRequests', 'requesterId', user.uid))
    .filter((item) => !item.deletedAt)
    .sort(byNewest)
}

export async function listDeletedContributions(user) {
  if (!user?.uid) return []

  if (!isFirebaseConfigured) {
    const items = [
      ...localSeed('reviews').map((item) => ({ ...item, kind: 'review' })),
      ...localSeed('comments').map((item) => ({ ...item, kind: 'comment' })),
      ...localSeed('reports').map((item) => ({ ...item, kind: 'report' })),
    ]
    return applyLocalDeleted(items)
      .filter((item) => item.deletedAt && matchesLocalUser(item, user))
        .sort(deletedNewestFirst)
  }

  const [reviews, comments, reports] = await Promise.all([
    fetchMine('reviews', 'authorId', user.uid),
    fetchMine('comments', 'authorId', user.uid),
    fetchMine('reports', 'reporterId', user.uid),
  ])
  return [
    ...reviews.map((item) => ({ ...item, kind: 'review' })),
    ...comments.map((item) => ({ ...item, kind: 'comment' })),
    ...reports.map((item) => ({ ...item, kind: 'report' })),
  ]
    .filter((item) => item.deletedAt)
    .sort(deletedNewestFirst)
}

export async function restoreContribution(item) {
  if (!item?.id || !['review', 'comment', 'report'].includes(item.kind)) return false

  if (!isFirebaseConfigured) {
    const deletedIds = localDeletedIds()
    if (!deletedIds.includes(item.id)) return false
    writeJson(DELETED_KEY, deletedIds.filter((id) => id !== item.id))
    return true
  }

  if (item.kind === 'report') return false
  const collectionName = item.kind === 'review' ? 'reviews' : 'comments'
  await updateDoc(doc(db, collectionName, item.id), { deletedAt: null })
  return true
}

export function softDeleteLocally(id) {
  if (!id) throw new Error('A contribution ID is required.')
  const deletedIds = localDeletedIds()
  if (!deletedIds.includes(id)) writeJson(DELETED_KEY, [...deletedIds, id])
}
