import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import { AuthProvider } from './context/AuthContext'

/**
 * The real router, providers and route table: this is the test that fails if a
 * route stops resolving, the shell stops wrapping pages, or a lazy page throws
 * on load. Individual pages keep their own tests for their content.
 */
function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('renders the shell around the home page', async () => {
    renderApp('/')

    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main',
    )
    expect(await screen.findByRole('heading', { level: 1, name: 'Land, put to work.' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Find a farm' }).length).toBeGreaterThan(0)
  })

  it('routes an unknown URL to the not-found page', async () => {
    renderApp('/this-page-does-not-exist')

    expect(
      await screen.findByRole('heading', { name: 'That page is not in this shamba' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
  })

  it('sends a signed-out visitor from a protected page to the login form', async () => {
    renderApp('/account')

    expect(await screen.findByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
  })
})