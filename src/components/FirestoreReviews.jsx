import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function FirestoreReviews({ user }) {
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState('5')
  const [body, setBody] = useState('')
  const [farmId, setFarmId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadReviews() {
      try {
        const snapshot = await getDocs(collection(db, 'reviews'))
        if (active) {
          setReviews(snapshot.docs.map((review) => ({
            id: review.id,
            ...review.data(),
          })))
        }
      } catch (loadError) {
        if (active) setError(loadError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadReviews()
    return () => {
      active = false
    }
  }, [])

  async function submitReview(event) {
    event.preventDefault()
    setError('')

    if (!user) {
      setError('Sign in to leave a review.')
      return
    }

    try {
      const review = await addDoc(collection(db, 'reviews'), {
        authorId: user.uid,
        farmId,
        author: user.displayName || 'Farming Nyumbani user',
        rating: Number(rating),
        body,
        createdAt: serverTimestamp(),
        deletedAt: null,
      })

      setReviews((current) => [
        ...current,
        {
          id: review.id,
          authorId: user.uid,
          farmId,
          author: user.displayName || 'Farming Nyumbani user',
          rating: Number(rating),
          body,
          deletedAt: null,
        },
      ])
      setBody('')
      setFarmId('')
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <section>
      <h2>Reviews</h2>

      {loading && <p>Loading reviews...</p>}
      {error && <p role="alert">{error}</p>}

      <form onSubmit={submitReview}>
        <label htmlFor="farm-id">Farm ID</label>
        <input
          id="farm-id"
          value={farmId}
          onChange={(event) => setFarmId(event.target.value)}
          required
        />

        <label htmlFor="review-rating">Rating</label>
        <select
          id="review-rating"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>

        <label htmlFor="review-body">Review</label>
        <textarea
          id="review-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          minLength={20}
          maxLength={2000}
          required
        />

        <button type="submit">Submit review</button>
      </form>

      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>{review.author}</strong> — {review.rating}/5
            <p>{review.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
