import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { FARMS } from '../data/seedFarms'
import Home from './Home'

describe('Home', () => {
  it('introduces the service and links to farms and crops', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Find land. Grow your future.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Find a farm' })).toHaveAttribute('href', '/farms')
    expect(screen.getByRole('link', { name: 'Explore crops' })).toHaveAttribute('href', '/crops')
    expect(screen.getByText(`${FARMS.length} sample farms to explore`)).toBeInTheDocument()
  })
})
