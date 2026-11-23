import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import RecentlyDeleted from './RecentlyDeleted'

describe('RecentlyDeleted', () => {
  it('shows an empty state when the bin is empty', () => {
    render(<RecentlyDeleted items={[]} onRestore={vi.fn()} />)

    expect(screen.getByText('Nothing in the bin')).toBeInTheDocument()
  })

  it('lists deleted items with a Restore action that calls onRestore', async () => {
    const onRestore = vi.fn()
    const user = userEvent.setup()
    const item = {
      id: 'x1',
      kind: 'review',
      farmId: 'Old Farm',
      body: 'Old review',
      deletedAt: '2026-03-01T00:00:00.000Z',
    }

    render(<RecentlyDeleted items={[item]} onRestore={onRestore} />)

    await user.click(screen.getByRole('button', { name: 'Restore' }))
    expect(onRestore).toHaveBeenCalledWith(item)
  })
})
