import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NotFound from './NotFound'

describe('NotFound', () => {
  it('explains the page was not found and provides a home link', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'This page could not be found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
  })
})
