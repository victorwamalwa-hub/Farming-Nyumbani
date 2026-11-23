import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { SEED_REVIEWS } from '../data/seedReviews'
import { assembleReviews } from './engagementShared'

function currentUserId() {
  const uid = auth?.currentUser?.uid
  if (!uid) throw new Error('Sign in to continue.')
  return uid
}

function records(snapshot) {
  return snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }))
}

async function listBy(collectionName, field, value) {
  const snapshot = await getDocs(
    query(collection(db, collectionName), where(field, '==', value)),
  )
  return records(snapshot)
}

async function findFarmId(targetId) {
  for (const kind of ['reviews', 'comments']) {
    const snapshot = await getDoc(doc(db, kind, targetId))
    if (snapshot.exists()) return snapshot.data().farmId
  }
  return SEED_REVIEWS.find((review) => review.id === targetId)?.farmId ?? ''
}

export async function listReviews(farmId) {
  const [reviews, comments, reactions] = await Promise.all([
    listBy('reviews', 'farmId', farmId),
    listBy('comments', 'farmId', farmId),
    listBy('reactions', 'farmId', farmId),
  ])
  return assembleReviews({ farmId, reviews, comments, reactions })
}

export async function addReview(payload) {
  const uid = currentUserId()
  const review = {
    authorId: uid,
    farmId: String(payload.farmId).trim(),
    author: String(payload.author || auth.currentUser.displayName || 'Farming Nyumbani user').trim(),
    rating: Number(payload.rating),
    body: String(payload.body).trim(),
    createdAt: serverTimestamp(),
    deletedAt: null,
  }
  const created = await addDoc(collection(db, 'reviews'), review)
  return { ...review, id: created.id, createdAt: new Date().toISOString() }
}

export async function addComment(payload) {
  const uid = currentUserId()
  const farmId = payload.farmId || await findFarmId(payload.reviewId)
  if (!farmId) throw new Error('Could not find the farm for this review.')
  const comment = {
    authorId: uid,
    farmId,
    reviewId: String(payload.reviewId),
    author: String(payload.author || auth.currentUser.displayName || 'Farming Nyumbani user').trim(),
    body: String(payload.body).trim(),
    createdAt: serverTimestamp(),
    deletedAt: null,
  }
  const created = await addDoc(collection(db, 'comments'), comment)
  return { ...comment, id: created.id, createdAt: new Date().toISOString() }
}

export async function toggleReaction({ targetId, emoji }) {
  const uid = currentUserId()
  const reactionId = encodeURIComponent(JSON.stringify([targetId, emoji, uid]))
  const reference = doc(db, 'reactions', reactionId)
  const existing = await getDoc(reference)
  if (existing.exists()) {
    await deleteDoc(reference)
  } else {
    const farmId = await findFarmId(targetId)
    if (!farmId) throw new Error('Could not find the farm for this reaction.')
    await setDoc(reference, {
      actorId: uid,
      emoji,
      farmId,
      targetId,
    })
  }
  return listBy('reactions', 'targetId', targetId)
}

export async function requestLease(payload) {
  const uid = currentUserId()
  const request = {
    requesterId: uid,
    farmId: String(payload.farmId).trim(),
    farmTitle: String(payload.farmTitle).trim(),
    ownerName: String(payload.ownerName).trim(),
    requester: String(payload.requester || auth.currentUser.displayName || 'Farming Nyumbani user').trim(),
    crops: String(payload.crops).trim(),
    startDate: String(payload.startDate ?? '').trim(),
    message: String(payload.message).trim(),
    status: 'pending',
    createdAt: serverTimestamp(),
  }
  const created = await addDoc(collection(db, 'leaseRequests'), request)
  return { ...request, id: created.id, createdAt: new Date().toISOString() }
}

export async function listMyLeaseRequests() {
  return listBy('leaseRequests', 'requesterId', currentUserId())
}

export async function reportFarm(payload) {
  const uid = currentUserId()
  const report = {
    reporterId: uid,
    farmId: String(payload.farmId).trim(),
    reason: String(payload.reason).trim(),
    note: String(payload.note ?? '').trim(),
    createdAt: serverTimestamp(),
  }
  const created = await addDoc(collection(db, 'reports'), report)
  return {
    ...report,
    id: created.id,
    reporter: auth.currentUser.displayName || payload.reporter || '',
    createdAt: new Date().toISOString(),
  }
}

export async function listMyReports(farmId) {
  const reports = await listBy('reports', 'reporterId', currentUserId())
  return reports.filter((report) => report.farmId === farmId)
}

export async function listMine() {
  const uid = currentUserId()
  const [reviews, comments] = await Promise.all([
    listBy('reviews', 'authorId', uid),
    listBy('comments', 'authorId', uid),
  ])
  return {
    reviews: reviews.filter((review) => review.deletedAt == null),
    comments: comments.filter((comment) => comment.deletedAt == null),
  }
}

async function itemReference(kind, id) {
  if (kind !== 'reviews' && kind !== 'comments') return null
  const reference = doc(db, kind, id)
  const snapshot = await getDoc(reference)
  return snapshot.exists() ? { reference, data: snapshot.data() } : null
}

export async function softDeleteItem(kind, id) {
  currentUserId()
  const item = await itemReference(kind, id)
  if (!item || item.data.deletedAt != null) return false
  await updateDoc(item.reference, { deletedAt: serverTimestamp() })
  return true
}

export async function restoreItem(kind, id) {
  currentUserId()
  const item = await itemReference(kind, id)
  if (!item || item.data.deletedAt == null) return false
  await updateDoc(item.reference, { deletedAt: null })
  return true
}

export async function purgeItem(kind, id) {
  currentUserId()
  const item = await itemReference(kind, id)
  if (!item) return false
  await deleteDoc(item.reference)
  return true
}

export async function listTrashMine() {
  const uid = currentUserId()
  const [reviews, comments] = await Promise.all([
    listBy('reviews', 'authorId', uid),
    listBy('comments', 'authorId', uid),
  ])
  return [
    ...reviews.filter((review) => review.deletedAt != null).map((review) => ({ ...review, kind: 'reviews' })),
    ...comments.filter((comment) => comment.deletedAt != null).map((comment) => ({ ...comment, kind: 'comments' })),
  ]
}
