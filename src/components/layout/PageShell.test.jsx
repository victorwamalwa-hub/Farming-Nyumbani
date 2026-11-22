import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PageShell from './PageShell'

function Page() {
  return (
    <>
      <p>Page body</p>
      <Link to="/farms">Go to farms</Link>
    </>
  )
}

function renderShell() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<PageShell />}>
          <Route index element={<Page />} />
          <Route path="farms" element={<Page />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('PageShell', () => {
  it('wraps the page with a skip link, header, main landmark and footer', () => {
    renderShell()

    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main',
    )
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Farming Nyumbani')
    expect(screen.getByText('Page body')).toBeInTheDocument()
  })

  it('starts each new route at the top of the page', async () => {
    renderShell()

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    window.scrollTo.mockClear()

    await userEvent.click(screen.getByRole('link', { name: 'Go to farms' }))

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })
})