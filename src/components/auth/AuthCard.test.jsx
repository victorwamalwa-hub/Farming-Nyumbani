// AuthCard.test.jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AuthCard from './AuthCard'

describe('AuthCard', () => {
  it('renders one h1 with the title', () => {
    render(
      <MemoryRouter>
        <AuthCard title="Sign in" description="Welcome">
          <p>body</p>
        </AuthCard>
      </MemoryRouter>,
    )
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
  })

  it('renders the notice above the card and footer below', () => {
    const { container } = render(
      <MemoryRouter>
        <AuthCard title="Sign in" notice={<p>notice</p>} footer={<p>footer</p>}>
          <p>body</p>
        </AuthCard>
      </MemoryRouter>,
    )
    expect(screen.getByText('notice')).toBeInTheDocument()
    expect(screen.getByText('footer')).toBeInTheDocument()
    expect(container.querySelector('p p')).toBeNull()
  })
})