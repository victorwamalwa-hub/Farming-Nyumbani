import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Home from './Home'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home', () => {
  it('renders the hero heading and primary calls to action', () => {
    renderHome()

    expect(screen.getByRole('heading', { level: 1, name: 'Land, put to work.' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Find a farm' })[0]).toHaveAttribute('href', '/farms')
  })

  it('shows only verified farms in the featured section', () => {
    renderHome()

    expect(screen.getByText('One-acre horticulture plot, Ngoliba')).toBeInTheDocument()
    expect(screen.queryByText('Three-acre mixed farm, Lurambi')).not.toBeInTheDocument()
  })

  it('labels impact figures as targets rather than results', () => {
    renderHome()

    expect(screen.getByText(/Targets, not results/i)).toBeInTheDocument()
    expect(screen.getByText('acres activated by year two')).toBeInTheDocument()
  })

  it('renders the how-it-works steps in order', () => {
    renderHome()

    const steps = screen.getAllByRole('listitem').slice(0, 3)
    expect(steps[0]).toHaveTextContent('Find a plot that fits')
    expect(steps[2]).toHaveTextContent('Farm the season')
  })
})