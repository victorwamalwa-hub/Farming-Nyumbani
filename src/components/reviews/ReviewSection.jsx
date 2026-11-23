import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  addComment,
  addReview,
  listReviews,
  restoreItem,
  softDeleteItem,
} from '../../services/engagement'
import Button from '../ui/Button'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'

function actorName(user) {
  return user?.displayName || user?.email?.split('@')[0] || ''
}

export default function ReviewSection({ farmId }) {
  const { user, isConfigured } = useAuth()
  const actor = actorName(user)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletedReview, setDeletedReview] = useState(null)

  useEffect(() => {
    let active = true
    listReviews(farmId)
      .then((items) => {
        if (active) {
          setReviews(items)
          setError('')
        }
      })
      .catch((loadError) => {
        if (active) {
          setReviews([])
          setError(loadError.message || 'Could not load reviews. Please try again.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [farmId])

  async function refreshReviews() {
    const items = await listReviews(farmId)
    setReviews(items)
  }

  async function handleAddReview(payload) {
    const created = await addReview({ ...payload, farmId })
    setReviews((current) => [
      { ...created, comments: [], reactions: [] },
      ...current,
    ])
  }

  async function handleAddComment({ reviewId, body }) {
    await addComment({ reviewId, farmId, author: actor, body })
    await refreshReviews()
  }

  async function handleDelete(review) {
    setError('')
    try {
      const deleted = await softDeleteItem('reviews', review.id)
      if (deleted === false) throw new Error('Could not delete this review. Please try again.')
      setReviews((current) => current.filter((entry) => entry.id !== review.id))
      setDeletedReview(review)
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete this review. Please try again.')
    }
  }

  async function handleRestore() {
    if (!deletedReview) return
    setError('')
    try {
      const restored = await restoreItem('reviews', deletedReview.id)
      if (restored === false) throw new Error('Could not restore this review. Please try again.')
      setReviews((current) => [deletedReview, ...current])
      setDeletedReview(null)
    } catch (restoreError) {
      setError(restoreError.message || 'Could not restore this review. Please try again.')
    }
  }

  return (
    <section aria-labelledby="reviews-title" className="mt-10">
      <h2 className="font-display text-2xl font-semibold text-ink" id="reviews-title">
        Farmer reviews
      </h2>
      {error && <p className="mt-3 text-danger" role="alert">{error}</p>}
      {loading && <p className="mt-3 text-muted">Loading reviews...</p>}
      {!loading && !error && reviews.length === 0 && <p className="mt-3 text-muted">No reviews yet.</p>}

      {!loading && reviews.length > 0 && (
        <ul className="mt-4 grid list-none gap-4 p-0 md:grid-cols-2">
          {reviews.map((review) => (
            <li key={review.id}>
              <ReviewCard
                review={review}
                actor={actor}
                farmId={farmId}
                onDelete={handleDelete}
                onAddComment={handleAddComment}
              />
            </li>
          ))}
        </ul>
      )}

      {deletedReview && (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-paper p-3 text-sm">
          <span>Review deleted.</span>
          <Button variant="outline" onClick={handleRestore}>Undo</Button>
        </div>
      )}

      {isConfigured && !user ? (
        <p className="mt-5 text-sm text-muted">
          <Link className="font-semibold text-primary hover:underline" to="/login">
            Sign in
          </Link>{' '}
          to add a review or comment.
        </p>
      ) : (
        <ReviewForm author={actor} onSubmit={handleAddReview} />
      )}
    </section>
  )
}
