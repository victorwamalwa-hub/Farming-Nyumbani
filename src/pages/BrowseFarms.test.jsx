import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { FARMS } from '../data/seedFarms'
import BrowseFarms from './BrowseFarms'

function renderBrowse() {
  return render(
    <MemoryRouter>
      <BrowseFarms />
    </MemoryRouter>,
  )
}

describe('BrowseFarms', () => {
  it('lists every farm by default', () => {
    renderBrowse()

    expect(screen.getAllByRole('article')).toHaveLength(FARMS.length)
    expect(screen.getByText(`${FARMS.length} farms match your filters`)).toBeInTheDocument()
  })

  it('narrows the list when a county is chosen', async () => {
    renderBrowse()

    await userEvent.selectOptions(screen.getByLabelText('County'), 'nakuru')

    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText('Five-acre maize block, Rongai')).toBeInTheDocument()
    expect(screen.queryByText('One-acre horticulture plot, Ngoliba')).not.toBeInTheDocument()
  })

  it('filters by crop', async () => {
    renderBrowse()

    await userEvent.selectOptions(screen.getByLabelText('Crop'), 'avocado')

    // Two listings can support the same crop: Murang'a (shared block) and Meru.
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByText('Four acres for avocado, Nkubu')).toBeInTheDocument()
  })

  it('shows an empty state when nothing matches, and recovers on reset', async () => {
    renderBrowse()

    await userEvent.selectOptions(screen.getByLabelText('County'), 'kilifi')
    await userEvent.selectOptions(screen.getByLabelText('Crop'), 'maize')

    expect(screen.getByText('No farms in Kilifi yet')).toBeInTheDocument()
    expect(screen.queryAllByRole('article')).toHaveLength(0)

    await userEvent.click(screen.getAllByRole('button', { name: 'Clear all filters' })[0])

    expect(screen.getAllByRole('article')).toHaveLength(FARMS.length)
  })

  it('names the county when a county has no farms', async () => {
    const user = userEvent.setup()
    renderBrowse()

    // Turkana has no seed farm listings.
    await user.selectOptions(screen.getByLabelText(/county/i), 'turkana')

    expect(await screen.findByText('No farms in Turkana yet')).toBeInTheDocument()
  })
})