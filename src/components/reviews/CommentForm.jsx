import { useState } from 'react'
import Button from '../ui/Button'

export default function CommentForm({ author, onAdd, pending = false }) {
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const trimmedBody = body.trim()
    if (!trimmedBody) {
      setError('Write a comment first.')
      return
    }
    if (!author?.trim()) {
      setError('Add a name before sending a comment.')
      return
    }

    try {
      await onAdd(trimmedBody)
      setBody('')
    } catch (addError) {
      setError(addError.message || 'Could not add your comment. Please try again.')
    }
  }

  return (
    <form className="mt-4 grid gap-2" onSubmit={handleSubmit} noValidate>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink">Add a comment</span>
        <textarea
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          rows={2}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          aria-invalid={Boolean(error)}
        />
      </label>
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
      <div>
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? 'Sending…' : 'Send comment'}
        </Button>
      </div>
    </form>
  )
}
