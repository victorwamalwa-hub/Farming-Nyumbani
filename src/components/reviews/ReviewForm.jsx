import { useState } from 'react'
import { MIN_REVIEW_LENGTH } from '../../data/seedReviews'
import Button from '../ui/Button'

export default function ReviewForm({ author, onSubmit }) {
  const [rating, setRating] = useState('5')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const trimmedBody = body.trim()
    if (trimmedBody.length < MIN_REVIEW_LENGTH) {
      setError(`Write at least ${MIN_REVIEW_LENGTH} characters.`)
      return
    }
    if (!author?.trim()) {
      setError('Add a name before posting a review.')
      return
    }

    setPending(true)
    try {
      await onSubmit({ author: author.trim(), rating: Number(rating), body: trimmedBody })
      setBody('')
      setRating('5')
    } catch (submitError) {
      setError(submitError.message || 'Could not post your review. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="mt-5 grid gap-3 rounded-xl border border-line bg-surface p-4" onSubmit={handleSubmit} noValidate>
      <h3 className="font-semibold text-ink">Write a review</h3>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink">Rating</span>
        <select
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>{value} out of 5</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink">Your review</span>
        <textarea
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          rows={4}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          aria-invalid={Boolean(error)}
        />
      </label>
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? 'Posting…' : 'Post review'}
        </Button>
      </div>
    </form>
  )
}
