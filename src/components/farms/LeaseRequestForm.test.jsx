import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LeaseRequestForm from './LeaseRequestForm'
import { FARMS } from '../../data/seedFarms'

const authMock = vi.hoisted(() => ({ user: null, isConfigured: false }))
vi.mock('../../context/AuthContext', () => ({ useAuth: () => authMock }))

const requestLeaseMock = vi.hoisted(() => vi.fn())
vi.mock('../../services/engagement', () => ({ requestLease: requestLeaseMock }))

function renderForm() {
  return render(
    <MemoryRouter>
      <LeaseRequestForm farm={FARMS[0]} />
    </MemoryRouter>,
  )
}

describe('LeaseRequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authMock.user = { displayName: 'Amina Farmer' }
    authMock.isConfigured = false
    requestLeaseMock.mockResolvedValue({ id: 'lease-1' })
  })

  it('blocks an empty message', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: /send lease request/i }))

    expect(requestLeaseMock).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/short message|10 characters/i)
  })

  it('shows the thrown error and keeps typed values when requestLease fails', async () => {
    requestLeaseMock.mockRejectedValue(new Error('Network down'))
    const user = userEvent.setup()
    renderForm()

    const message = screen.getByLabelText(/message to the owner/i)
    await user.type(message, 'I would like this plot for the season.')
    await user.click(screen.getByRole('button', { name: /send lease request/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Network down')
    expect(message).toHaveValue('I would like this plot for the season.')
  })

  it('shows a success panel linking to /account after a successful send', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/message to the owner/i), 'I would like this plot for the season.')
    await user.click(screen.getByRole('button', { name: /send lease request/i }))

    expect(await screen.findByText(/request sent/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /go to my account/i })).toHaveAttribute('href', '/account')
    expect(requestLeaseMock).toHaveBeenCalledWith(expect.objectContaining({
      farmId: FARMS[0].id,
      requester: 'Amina Farmer',
      crops: 'tomato',
      message: 'I would like this plot for the season.',
    }))
  })

  it('asks a signed-out visitor to sign in when Firebase is configured', () => {
    authMock.user = null
    authMock.isConfigured = true
    renderForm()

    expect(screen.getByRole('link', { name: /sign in to request this lease/i })).toBeInTheDocument()
  })
})
