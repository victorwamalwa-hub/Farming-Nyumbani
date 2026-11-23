import { db } from '../lib/firebase'
import * as local from './engagementLocal'
import * as remote from './engagementFirestore'
import { createId, hasReacted, reactionCounts } from './engagementShared'

/**
 * The engagement API used by the app. Two backends sit behind these functions:
 *
 *   Firebase configured  -> Firestore (shared across devices, rules enforced)
 *   no Firebase keys     -> localStorage (this browser only, used by tests)
 *
 * Function names and arguments are unchanged from the local version; only the
 * return values are now Promises, because a network database cannot answer
 * synchronously. Callers await once and never care which backend answered.
 *
 * Auth is required for writes on the Firestore path: anything a visitor creates
 * is tied to their account, which is what makes "delete, then restore from
 * another device" work at all.
 */

const isRemote = () => Boolean(db)

export { createId, hasReacted, reactionCounts }

export async function listReviews(farmId) {
  return isRemote() ? remote.listReviews(farmId) : local.listReviews(farmId)
}

export async function addReview(payload) {
  return isRemote() ? remote.addReview(payload) : local.addReview(payload)
}

export async function addComment(payload) {
  return isRemote() ? remote.addComment(payload) : local.addComment(payload)
}

export async function toggleReaction(payload) {
  return isRemote() ? remote.toggleReaction(payload) : local.toggleReaction(payload)
}

export async function requestLease(payload) {
  return isRemote() ? remote.requestLease(payload) : local.requestLease(payload)
}

/**
 * `requester` is the display name, used only by the local backend. Firestore
 * filters on the uid instead.
 */
export async function listMyLeaseRequests(requester) {
  return isRemote() ? remote.listMyLeaseRequests() : local.listMyLeaseRequests(requester)
}

export async function reportFarm(payload) {
  return isRemote() ? remote.reportFarm(payload) : local.reportFarm(payload)
}

export async function listReports(farmId) {
  return isRemote() ? remote.listMyReports(farmId) : local.listReports(farmId)
}

/**
 * `author` is the display name, which is how the local backend identifies rows.
 * Firestore identifies them by uid instead, so the name is not used there - a
 * display name is not unique, a uid is.
 */
export async function listMyContributions(author) {
  return isRemote() ? remote.listMine() : local.listMyContributions(author)
}

export async function softDeleteItem(kind, id) {
  return isRemote() ? remote.softDeleteItem(kind, id) : local.softDeleteItem(kind, id)
}

export async function restoreItem(kind, id) {
  return isRemote() ? remote.restoreItem(kind, id) : local.restoreItem(kind, id)
}

export async function purgeItem(kind, id) {
  return isRemote() ? remote.purgeItem(kind, id) : local.purgeItem(kind, id)
}

export async function listTrash(author) {
  return isRemote() ? remote.listTrashMine() : local.listTrash(author)
}