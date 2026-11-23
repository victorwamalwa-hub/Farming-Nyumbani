// GoogleButton.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

const authState = vi.hoisted(() => ({ current: { mode: 'firebase', signInWithGoogle: vi.fn() } }))
vi.mock('../../context/AuthContext', () => ({ useAuth: () => authState.current }))

const { default: GoogleButton } = await import('./GoogleButton')

describe('GoogleButton', () => {
  it('renders nothing in local mode', () => {
    authState.current = { mode: 'local', signInWithGoogle: vi.fn() }
    const { container } = render(<GoogleButton />)
    expect(container).toBeEmptyDOMElement()
  })

  it('calls onSuccess when popup resolves', async () => {
    const user = { email: 'x@y.z' }
    const onSuccess = vi.fn()
    authState.current = { mode: 'firebase', signInWithGoogle: vi.fn().mockResolvedValue(user) }
    render(<GoogleButton onSuccess={onSuccess} />)
    await userEvent.click(screen.getByRole('button', { name: /Google/i }))
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(user))
  })

  it('calls onError with the mapped message on failure', async () => {
    const onError = vi.fn()
    authState.current = {
      mode: 'firebase',
      signInWithGoogle: vi.fn().mockRejectedValue({ code: 'auth/popup-blocked' }),
    }
    render(<GoogleButton onError={onError} />)
    await userEvent.click(screen.getByRole('button', { name: /Google/i }))
    await waitFor(() => expect(onError).toHaveBeenCalledWith(expect.stringMatching(/pop-up/)))
  })

  it('disables while pending', async () => {
    let resolve
    const pending = new Promise((r) => { resolve = r })
    authState.current = { mode: 'firebase', signInWithGoogle: vi.fn(() => pending) }
    render(<GoogleButton />)
    const button = screen.getByRole('button', { name: /Google/i })
    await userEvent.click(button)
    expect(button).toBeDisabled()
    resolve({})
  })
})