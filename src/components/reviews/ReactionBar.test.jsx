import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ReactionBar from './ReactionBar'

describe('ReactionBar', () => {
  it('shows counts, aria-pressed and disables when there is no actor', () => {
    render(
      <ReactionBar
        targetId="r1"
        targetLabel="the review"
        reactions={[{ emoji: '👍', actor: 'Amina' }, { emoji: '👍', actor: 'Bob' }]}
        actor={null}
        onToggle={vi.fn()}
      />,
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveTextContent('2')
    buttons.forEach((button) => expect(button).toBeDisabled())
  })

  it('toggles when a signed-in actor is present', async () => {
    const onToggle = vi.fn()
    render(
      <ReactionBar targetId="r1" targetLabel="the review" reactions={[]} actor="Amina" onToggle={onToggle} />,
    )
    const thumbs = screen.getAllByRole('button')[0]
    expect(thumbs).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(thumbs)
    expect(onToggle).toHaveBeenCalledWith({ targetId: 'r1', emoji: '👍' })
  })
})
