import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

function Exploding() {
  throw new Error('render failed on purpose')
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

beforeEach(() => {
  // React and the boundary both log the error; keep the test output readable.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>Working page</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Working page')).toBeInTheDocument()
    expect(console.error).not.toHaveBeenCalled()
  })

  it('catches a crashed render and shows a way back', async () => {
    render(
      <ErrorBoundary>
        <Exploding />
      </ErrorBoundary>,
    )

    // React reports the error asynchronously; the fallback is what users see.
    await settle()
    expect(
      screen.getByRole('heading', { name: 'Something broke on our side' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Working page')).not.toBeInTheDocument()
    expect(console.error).toHaveBeenCalled()
  })

  it('sends the reader home when the fallback button is used', async () => {
    const assign = vi.fn()
    const original = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...original, assign },
    })

    try {
      render(
        <ErrorBoundary>
          <Exploding />
        </ErrorBoundary>,
      )
      await settle()

      await userEvent.click(screen.getByRole('button', { name: 'Back to the home page' }))

      expect(assign.mock.calls[0][0]).toMatch(/Farming-Nyumbani|^\/$/)
    } finally {
      Object.defineProperty(window, 'location', { configurable: true, value: original })
    }
  })
})