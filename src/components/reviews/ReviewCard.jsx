import { useState } from 'react'
import { formatDate, formatRating } from '../../utils/format'
import Button from '../ui/Button'
import CommentForm from './CommentForm'

export default function ReviewCard({
  review,
  actor,
  farmId,
  onDelete,
  onChanged,
  onAddComment,
}) {
  const [commentPending, setCommentPending] = useState(false)

  async function addComment(body) {
    setCommentPending(true)
    try {
      await onAddComment({ reviewId: review.id, farmId, body })
      await onChanged?.()
    } finally {
      setCommentPending(false)
    }
  }

  return (
    <article className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{review.author}</p>
          <p className="mt-1 text-sm text-primary">
            {formatRating(review.rating)} · {formatDate(review.createdAt)}
          </p>
        </div>
        {actor && review.author === actor && onDelete && (
          <Button
            variant="outline"
            onClick={() => onDelete(review)}
            aria-label="Delete review"
          >
            Delete review
          </Button>
        )}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{review.body}</p>

      {review.comments?.length > 0 && (
        <ul className="mt-4 space-y-3 border-l-2 border-line pl-3">
          {review.comments.map((comment) => (
            <li key={comment.id}>
              <p className="font-medium text-ink">{comment.author}</p>
              <p className="text-sm text-muted">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      {actor && onAddComment && (
        <CommentForm author={actor} onAdd={addComment} pending={commentPending} />
      )}
    </article>
  )
}
