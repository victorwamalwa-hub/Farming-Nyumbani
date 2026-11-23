import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../context/AuthContext'

vi.mock('../lib/firebase', () => ({ auth: {}, db: null, isFirebaseConfigured: true }))
vi.mock('firebase/auth', () => ({ onAuthStateChanged: (_auth, callback) => callback(null) }))

const { default: App } = await import('../App')

describe('catch-all route', () => {
  it('renders the NotFound page for an unmatched path', async () => {
    render(
      <MemoryRouter initialEntries={['/nonsense']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/could not find that page/i)
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
  })
})
