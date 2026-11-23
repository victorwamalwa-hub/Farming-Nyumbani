import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import FarmCard from './FarmCard'
import { FARMS } from '../../data/seedFarms'

function renderCard(farm) {
  return render(
    <MemoryRouter>
      <FarmCard farm={farm} />
    </MemoryRouter>,
  )
}

describe('FarmCard', () => {
  it('links the title and shows county, size, rent, crops and lease/water', () => {
    const farm = FARMS[0]
    renderCard(farm)

    expect(screen.getByRole('link', { name: farm.title })).toHaveAttribute('href', `/farms/${farm.id}`)
    expect(screen.getByText('Kiambu')).toBeInTheDocument()
    expect(screen.getByText('Verified')).toBeInTheDocument()
    expect(screen.getByText('1 acre')).toBeInTheDocument()
    expect(screen.getByText(/KES 45,000/)).toBeInTheDocument()
    expect(screen.getByText('Tomato')).toBeInTheDocument()
    expect(screen.getByText(/Full plot · Borehole/)).toBeInTheDocument()
  })

  it('skips crop slugs that do not resolve to a known crop', () => {
    const farm = { ...FARMS[0], suitableCrops: ['tomato', 'not-a-real-crop'] }
    renderCard(farm)

    expect(screen.getByText('Tomato')).toBeInTheDocument()
    expect(screen.queryByText('undefined')).not.toBeInTheDocument()
  })

  it('renders safely when owner name is missing and listing is unverified', () => {
    const farm = { ...FARMS[1], ownerName: '', verified: false }
    renderCard(farm)

    expect(screen.getByText('Unverified')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: farm.title })).toBeInTheDocument()
  })
})
