import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ReviewCard from './ReviewCard'

const review = {
  id: 'r1',
  author: 'Amina Farmer',
  rating: 4,
  body: 'Nice plot.',
  createdAt: '2026-01-01T00:00:00.000Z',
  comments: [{ id: 'c1', author: 'Bob', body: 'Agreed', createdAt: '2026-01-02T00:00:00.000Z' }],
  reactions: [],
}

describe('ReviewCard', () => {
  it('renders author, rating and existing comments', () => {
    render(
      <ReviewCard review={review} actor="Amina" farmId="f1" onDelete={vi.fn()} onChanged={vi.fn()} />,
    )
    expect(screen.getByText('Amina Farmer')).toBeInTheDocument()
    expect(screen.getByText(/4 out of 5/)).toBeInTheDocument()
    expect(screen.getByText('Agreed')).toBeInTheDocument()
  })
})
