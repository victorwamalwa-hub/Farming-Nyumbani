import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ReportListing from './ReportListing'
import { FARMS } from '../../data/seedFarms'

const authMock = vi.hoisted(() => ({ user: null, isConfigured: false }))
vi.mock('../../context/AuthContext', () => ({ useAuth: () => authMock }))

const reportFarmMock = vi.hoisted(() => vi.fn())
vi.mock('../../services/engagement', () => ({ reportFarm: reportFarmMock }))

function renderReport() {
  return render(
    <MemoryRouter>
      <ReportListing farm={FARMS[0]} />
    </MemoryRouter>,
  )
}

describe('ReportListing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMock.user = { displayName: 'Amina Farmer' }
    authMock.isConfigured = false
    reportFarmMock.mockResolvedValue({ id: 'report-1' })
  })

  it('blocks an empty reason', async () => {
    const user = userEvent.setup()
    renderReport()

    await user.click(screen.getByRole('button', { name: /send report/i }))

    expect(reportFarmMock).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/choose a reason/i)
  })

  it('confirms the listing is flagged after a successful report', async () => {
    const user = userEvent.setup()
    renderReport()

    await user.selectOptions(screen.getByLabelText(/reason/i), 'Listing looks fake or duplicated')
    await user.click(screen.getByRole('button', { name: /send report/i }))

    expect(await screen.findByText(/flagged for a human check/i)).toBeInTheDocument()
    expect(reportFarmMock).toHaveBeenCalledWith(expect.objectContaining({
      farmId: FARMS[0].id,
      reason: 'Listing looks fake or duplicated',
      reporter: 'Amina Farmer',
    }))
  })

  it('each send creates a separate report record', async () => {
    const user = userEvent.setup()
    renderReport()

    await user.selectOptions(screen.getByLabelText(/reason/i), 'Listing looks fake or duplicated')
    await user.click(screen.getByRole('button', { name: /send report/i }))
    await screen.findByText(/flagged for a human check/i)

    await user.selectOptions(screen.getByLabelText(/reason/i), 'Rent or size looks wrong')
    await user.click(screen.getByRole('button', { name: /send report/i }))

    expect(reportFarmMock).toHaveBeenCalledTimes(2)
  })
})
