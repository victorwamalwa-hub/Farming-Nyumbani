import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import FarmDetail from './FarmDetail'

function renderFarmDetail(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/farms/:farmId" element={<FarmDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('FarmDetail', () => {
  it('shows listing details and reviews for a known farm', async () => {
    renderFarmDetail('/farms/kiambu-ngoliba-tomato-block')

    expect(screen.getByRole('heading', { name: 'One-acre horticulture plot, Ngoliba' })).toBeInTheDocument()
    expect(screen.getByText('Wanjiku Mwangi')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Farmer reviews' })).toBeInTheDocument()
    expect(await screen.findByText(/Clear farm details/)).toBeInTheDocument()
    expect(screen.getByText('5/5 · 18 Jan 2026')).toBeInTheDocument()
    expect(screen.getByText('2 comments')).toBeInTheDocument()
    expect(screen.getByText(/borehole was serviced last season/)).toBeInTheDocument()
  })

  it('shows a not-found message for an unknown farm id', () => {
    renderFarmDetail('/farms/not-a-farm')
    expect(screen.getByRole('heading', { name: 'Farm not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse farms' })).toHaveAttribute('href', '/farms')
  })
})
