import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ReviewForm from './ReviewForm'
import { MIN_REVIEW_LENGTH } from '../../data/seedReviews'

describe('ReviewForm', () => {
  it('blocks too-short bodies', async () => {
    const onSubmit = vi.fn()
    render(<ReviewForm author="Amina" onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/your review/i), 'short')
    await userEvent.click(screen.getByRole('button', { name: /post review/i }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(new RegExp(`${MIN_REVIEW_LENGTH}`, 'i'))
  })

  it('keeps the body when save fails', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Nope'))
    render(<ReviewForm author="Amina" onSubmit={onSubmit} />)
    const body = screen.getByLabelText(/your review/i)
    await userEvent.type(body, 'A solid, honest review of this farm and its water.')
    await userEvent.click(screen.getByRole('button', { name: /post review/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Nope')
    expect(body).toHaveValue('A solid, honest review of this farm and its water.')
  })
})
