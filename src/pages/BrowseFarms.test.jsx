import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import BrowseFarms from './BrowseFarms'

afterEach(cleanup)

function renderBrowseFarms() {
  return render(
    <MemoryRouter>
      <BrowseFarms />
    </MemoryRouter>,
  )
}

describe('BrowseFarms', () => {
  it('shows available seed farms and their detail links', () => {
    renderBrowseFarms()

    expect(screen.getByRole('heading', { name: 'Browse farms' })).toBeInTheDocument()
    expect(screen.getByText('8 farms found')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'One-acre horticulture plot, Ngoliba' }),
    ).toHaveAttribute('href', '/farms/kiambu-ngoliba-tomato-block')
  })

  it('filters farms by county and clears filters', () => {
    renderBrowseFarms()

    fireEvent.change(screen.getByLabelText('County'), { target: { value: 'nakuru' } })

    expect(screen.getByText('1 farm found')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Five-acre maize block, Rongai' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'One-acre horticulture plot, Ngoliba' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('8 farms found')).toBeInTheDocument()
  })

  it('shows an empty state when no farms match', () => {
    renderBrowseFarms()

    fireEvent.change(screen.getByLabelText('Search farms'), {
      target: { value: 'no matching farm' },
    })

    expect(screen.getByRole('heading', { name: 'No farms match those filters' })).toBeInTheDocument()
  })
})
