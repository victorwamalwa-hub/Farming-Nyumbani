import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const authState = vi.hoisted(() => ({ current: { mode: 'local' } }))

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => authState.current,
}))

const { default: LocalModeNotice } = await import('./LocalModeNotice')

describe('LocalModeNotice', () => {
  it('renders the notice in local mode', () => {
    authState.current = { mode: 'local' }
    render(<LocalModeNotice />)
    expect(screen.getByRole('status')).toHaveTextContent(/Local accounts are on/)
  })

  it('renders nothing in firebase mode', () => {
    authState.current = { mode: 'firebase' }
    const { container } = render(<LocalModeNotice />)
    expect(container).toBeEmptyDOMElement()
  })
})