import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FarmFilters from './FarmFilters'
import { DEFAULT_FILTERS } from '../../utils/filters'

function renderFilters(overrides = {}) {
  const onChange = vi.fn()
  const onReset = vi.fn()
  render(
    <FarmFilters
      filters={{ ...DEFAULT_FILTERS, ...overrides }}
      onChange={onChange}
      onReset={onReset}
      resultCount={0}
    />,
  )
  return { onChange, onReset }
}

describe('FarmFilters handlers', () => {
  it('emits query on search input', async () => {
    const { onChange } = renderFilters()
    await userEvent.type(screen.getByLabelText(/search/i), 't')
    expect(onChange).toHaveBeenCalledWith({ query: 't' })
  })

  it('emits county on county select', async () => {
    const { onChange } = renderFilters()
    await userEvent.selectOptions(screen.getByLabelText(/county/i), 'kiambu')
    expect(onChange).toHaveBeenCalledWith({ county: 'kiambu' })
  })

  it('emits crop on crop select', async () => {
    const { onChange } = renderFilters()
    await userEvent.selectOptions(screen.getByLabelText(/crop/i), 'maize')
    expect(onChange).toHaveBeenCalledWith({ crop: 'maize' })
  })

  it('emits waterSource on water select', async () => {
    const { onChange } = renderFilters()
    await userEvent.selectOptions(screen.getByLabelText(/water source/i), 'River')
    expect(onChange).toHaveBeenCalledWith({ waterSource: 'River' })
  })

  it('emits maxRent on rent input', async () => {
    const { onChange } = renderFilters()
    await userEvent.type(screen.getByLabelText(/max rent/i), '5')
    expect(onChange).toHaveBeenCalledWith({ maxRent: '5' })
  })

  it('calls onReset when Clear all filters is clicked', async () => {
    const { onReset } = renderFilters()
    await userEvent.click(screen.getByRole('button', { name: /clear all filters/i }))
    expect(onReset).toHaveBeenCalled()
  })
})
