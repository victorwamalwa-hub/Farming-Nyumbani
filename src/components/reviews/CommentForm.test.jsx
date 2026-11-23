import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CommentForm from './CommentForm'

describe('CommentForm', () => {
  it('blocks an empty body', async () => {
    const onAdd = vi.fn()
    render(<CommentForm author="Amina" onAdd={onAdd} pending={false} />)
    await userEvent.click(screen.getByRole('button', { name: /send comment/i }))
    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/write a comment first/i)
  })

  it('blocks when no name is available', async () => {
    const onAdd = vi.fn()
    render(<CommentForm author="" onAdd={onAdd} pending={false} />)
    await userEvent.type(screen.getByLabelText(/add a comment/i), 'Nice review')
    await userEvent.click(screen.getByRole('button', { name: /send comment/i }))
    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/add a name/i)
  })
})
