import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('App', () => {
  it('renders the application', () => {
    render(<main>Farming Nyumbani</main>)

    expect(screen.getByText('Farming Nyumbani')).toBeInTheDocument()
  })
})
