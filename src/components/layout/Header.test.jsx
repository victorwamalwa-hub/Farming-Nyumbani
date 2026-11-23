import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Header from './Header'

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
}

describe('Header', () => {
  it('renders the main navigation links', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: /farming nyumbani/i })).toHaveAttribute('href', '/')
    expect(screen.getAllByRole('link', { name: 'Find a farm' }).length).toBeGreaterThan(0)
  })

  it('opens and closes the mobile menu', async () => {
    renderHeader()
    const toggle = screen.getByRole('button', { name: 'Menu' })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the mobile menu on Escape', async () => {
    renderHeader()
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
  })

  it('closes the mobile menu after choosing a navigation link', async () => {
    renderHeader()
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    const mobileNavigation = screen.getByRole('navigation', { name: 'Mobile' })
    await userEvent.click(within(mobileNavigation).getByRole('link', { name: 'Crops & regions' }))

    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
  })
})