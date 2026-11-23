import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ReviewSection from './ReviewSection'

const authMock = vi.hoisted(() => ({ user: { displayName: 'Amina' }, isConfigured: false }))
vi.mock('../../context/AuthContext', () => ({ useAuth: () => authMock }))
vi.mock('../../services/localAuth', () => ({ currentLocalUser: () => ({ displayName: 'Amina' }) }))

const engagementMock = vi.hoisted(() => ({
  listReviews: vi.fn(),
  addReview: vi.fn(),
  addComment: vi.fn(),
  toggleReaction: vi.fn(),
  softDeleteItem: vi.fn(),
  restoreItem: vi.fn(),
}))
vi.mock('../../services/engagement', () => engagementMock)

const review = {
  id: 'r1',
  author: 'Amina',
  rating: 5,
  body: 'A solid, honest review of this farm and its water.',
  createdAt: '2026-01-01T00:00:00.000Z',
  comments: [],
  reactions: [],
}

describe('ReviewSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMock.user = { displayName: 'Amina' }
    authMock.isConfigured = false
    engagementMock.listReviews.mockResolvedValue([review])
    engagementMock.addReview.mockResolvedValue(review)
    engagementMock.softDeleteItem.mockResolvedValue(true)
    engagementMock.restoreItem.mockResolvedValue(true)
  })

  it('renders loaded reviews', async () => {
    render(<ReviewSection farmId="f1" />)
    expect(await screen.findByText(review.body)).toBeInTheDocument()
  })

  it('shows an error state on load failure, never the empty message', async () => {
    engagementMock.listReviews.mockRejectedValue(new Error('offline'))
    render(<ReviewSection farmId="f1" />)
    expect(await screen.findByRole('alert')).toHaveTextContent('offline')
    expect(screen.queryByText(/no reviews yet/i)).not.toBeInTheDocument()
  })

  it('deletes and restores a review', async () => {
    render(<ReviewSection farmId="f1" />)
    await screen.findByText(review.body)
    await userEvent.click(screen.getByRole('button', { name: /delete review/i }))
    await waitFor(() => expect(screen.queryByText(review.body)).not.toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /^undo$/i }))
    expect(engagementMock.restoreItem).toHaveBeenCalledWith('reviews', 'r1')
    await waitFor(() => expect(screen.getByText(review.body)).toBeInTheDocument())
  })
})
