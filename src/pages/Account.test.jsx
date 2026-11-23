import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Account from './Account'

const authMock = vi.hoisted(() => ({
  user: null,
  initialising: false,
  signOut: vi.fn(),
}))
vi.mock('../context/AuthContext', () => ({
  useAuth: () => authMock,
}))

const engagementMock = vi.hoisted(() => ({
  listMyContributions: vi.fn(),
  listDeletedContributions: vi.fn(),
  restoreContribution: vi.fn(),
}))
vi.mock('../lib/engagement', () => engagementMock)

const leaseRequestsMock = vi.hoisted(() => ({
  listMyLeaseRequests: vi.fn(),
}))
vi.mock('../services/engagement', () => leaseRequestsMock)

const navigateMock = vi.hoisted(() => vi.fn())
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => navigateMock }
})

function renderAccount() {
  return render(
    <MemoryRouter>
      <Account />
    </MemoryRouter>,
  )
}

describe('Account', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMock.user = {
      uid: 'user-1',
      displayName: 'Amina Farmer',
      email: 'amina@example.com',
      providerData: [{ providerId: 'password' }],
      metadata: { creationTime: '2025-03-01T10:00:00.000Z' },
    }
    authMock.initialising = false
    authMock.signOut.mockResolvedValue()
    engagementMock.listMyContributions.mockResolvedValue({ reviews: [], comments: [], reports: [] })
    leaseRequestsMock.listMyLeaseRequests.mockResolvedValue([])
    engagementMock.listDeletedContributions.mockResolvedValue([])
    engagementMock.restoreContribution.mockResolvedValue(true)
  })

  it('renders identity, contribution counts, and empty states', async () => {
    renderAccount()

    expect(await screen.findByRole('heading', { name: 'Amina Farmer' })).toBeInTheDocument()
    expect(screen.getByText('amina@example.com')).toBeInTheDocument()
    expect(screen.getByText(/member since/i)).toBeInTheDocument()
    await waitFor(() => expect(engagementMock.listMyContributions).toHaveBeenCalledTimes(1))
    expect(leaseRequestsMock.listMyLeaseRequests).toHaveBeenCalledWith('Amina Farmer')
    expect(await screen.findByText('No reviews yet')).toBeInTheDocument()
    expect(screen.getByText('No lease requests yet')).toBeInTheDocument()
    expect(screen.getByText('Nothing in the bin')).toBeInTheDocument()
  })

  it('shows contribution counts and recent reviews', async () => {
    engagementMock.listMyContributions.mockResolvedValue({
      reviews: [
        { id: 'r1', farmId: 'Farm One', body: 'Great soil', createdAt: '2026-01-10T00:00:00.000Z', deletedAt: null },
        { id: 'r2', farmId: 'Farm Two', body: 'Good water', createdAt: '2026-02-10T00:00:00.000Z', deletedAt: null },
      ],
      comments: [{ id: 'c1', deletedAt: null }],
      reports: [],
    })
    renderAccount()

    expect(await screen.findByText('Farm One')).toBeInTheDocument()
    expect(screen.getByText('Farm Two')).toBeInTheDocument()
    expect(screen.getByText('2', { selector: 'p' })).toBeInTheDocument()
  })

  it('renders lease requests with their status', async () => {
    leaseRequestsMock.listMyLeaseRequests.mockResolvedValue([
      {
        id: 'lr1',
        farmTitle: 'Ngoliba Tomato Block',
        crops: 'Tomatoes',
        startDate: '2026-04-01T00:00:00.000Z',
        ownerName: 'Faith A.',
        message: 'I would like to lease this block.',
        status: 'Pending',
        createdAt: '2026-03-20T00:00:00.000Z',
      },
    ])
    renderAccount()

    expect(await screen.findByText('Ngoliba Tomato Block')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('restores a deleted item and refreshes the account data', async () => {
    engagementMock.listDeletedContributions.mockResolvedValue([
      { id: 'r-del', kind: 'review', farmId: 'Old Farm', deletedAt: '2026-03-01T00:00:00.000Z' },
    ])
    const user = userEvent.setup()
    renderAccount()

    await user.click(await screen.findByRole('button', { name: 'Restore' }))

    expect(engagementMock.restoreContribution).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'r-del' }),
    )
    await waitFor(() => expect(engagementMock.listMyContributions).toHaveBeenCalledTimes(2))
  })

  it('explains that reports cannot be restored under the current permissions', async () => {
    engagementMock.listDeletedContributions.mockResolvedValue([
      { id: 'report-del', kind: 'report', farmId: 'Old Farm', deletedAt: '2026-03-01T00:00:00.000Z' },
    ])
    engagementMock.restoreContribution.mockResolvedValue(false)
    const user = userEvent.setup()
    renderAccount()

    await user.click(await screen.findByRole('button', { name: 'Restore' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Reports cannot currently be restored because of the current data permissions.',
    )
    expect(engagementMock.listMyContributions).toHaveBeenCalledTimes(1)
  })

  it('signs out and navigates home', async () => {
    const user = userEvent.setup()
    renderAccount()

    await user.click(await screen.findByRole('button', { name: 'Sign out' }))

    expect(authMock.signOut).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true })
  })

  it('shows an error when account data cannot be loaded', async () => {
    engagementMock.listMyContributions.mockRejectedValue(new Error('Could not load data.'))
    renderAccount()

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load data.')
    expect(await screen.findByText('No reviews yet')).toBeInTheDocument()
  })
})
