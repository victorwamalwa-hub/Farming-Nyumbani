import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CROPS } from '../data/crops'
import CropsAndRegions from './CropsAndRegions'

describe('CropsAndRegions', () => {
  it('lists crops with growing seasons and regions', () => {
    render(<MemoryRouter><CropsAndRegions /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Crops and regions' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Maize' })).toBeInTheDocument()
    expect(screen.getByText(/Uasin Gishu, Trans Nzoia, Nakuru, Bungoma/)).toBeInTheDocument()
    expect(screen.getAllByText(/Typical season:/)).toHaveLength(CROPS.length)
  })

  it('links to farm listings', () => {
    render(<MemoryRouter><CropsAndRegions /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Browse farm listings' })).toHaveAttribute('href', '/farms')
  })
})
