import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../context/AuthContext'

vi.mock('../lib/firebase', () => ({ auth: {}, db: null, isFirebaseConfigured: true }))
vi.mock('firebase/auth', () => ({ onAuthStateChanged: (_auth, callback) => callback(null) }))

const { default: App } = await import('../App')

describe('App', () => {
  it('renders the home page by default', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Land, put to work.' })).toBeInTheDocument()
  })
})
