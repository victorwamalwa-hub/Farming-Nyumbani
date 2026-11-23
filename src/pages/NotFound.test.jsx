import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import NotFound from './NotFound'

afterEach(() => {
  document.title = ''
})

describe('NotFound', () => {
  it('explains the page was not found and provides both recovery links', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/could not find that page/i)
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Browse farms' })).toHaveAttribute('href', '/farms')
  })

  it('sets the document title to "Page not found"', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    )

    expect(document.title).toBe('Page not found | Farming Nyumbani')
  })
})
