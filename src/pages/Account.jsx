import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import RecentlyDeleted from '../components/account/RecentlyDeleted'
import {
  listDeletedContributions,
  listMyContributions,
  listMyLeaseRequests,
  restoreContribution,
} from '../lib/engagement'

function initialsOf(name, email) {
  const source = (name || email || '').trim()
  if (!source) return '—'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function displayNameOf(user) {
  return user.accountName || user.displayName || user.email?.split('@')[0] || '—'
}

function signInMethod(user) {
  const provider = user.providerData?.[0]?.providerId
  return provider === 'google.com' ? 'Google' : 'Email & password'
}

function formatDate(value) {
  if (!value) return '—'
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
}

function newestFirst(a, b) {
  const time = (value) => {
    if (value && typeof value.toDate === 'function') return value.toDate().getTime()
    const parsed = new Date(value ?? 0).getTime()
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return time(b.createdAt) - time(a.createdAt)
}

async function fetchAccountData(user) {
  const [contributions, leaseRequests, deleted] = await Promise.all([
    listMyContributions(user),
    listMyLeaseRequests(user),
    listDeletedContributions(user),
  ])
  return { contributions, leaseRequests, deleted }
}

export default function Account() {
  const { user, initialising, signOut } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviews, setReviews] = useState([])
  const [comments, setComments] = useState([])
  const [reports, setReports] = useState([])
  const [leaseRequests, setLeaseRequests] = useState([])
  const [deleted, setDeleted] = useState([])
  const [signingOut, setSigningOut] = useState(false)
  const [loadedUserId, setLoadedUserId] = useState(null)

  useEffect(() => {
    if (!user) return undefined

    let active = true
    fetchAccountData(user)
      .then(({ contributions, leaseRequests: leases, deleted: deletedItems }) => {
        if (!active) return
        setReviews(contributions.reviews.filter((item) => !item.deletedAt))
        setComments(contributions.comments.filter((item) => !item.deletedAt))
        setReports(contributions.reports.filter((item) => !item.deletedAt))
        setLeaseRequests(leases)
        setDeleted(deletedItems)
        setError('')
        setLoadedUserId(user.uid)
      })
      .catch((loadError) => {
        if (!active) return
        setError(loadError.message || 'Could not load your account. Please try again.')
        setReviews([])
        setComments([])
        setReports([])
        setLeaseRequests([])
        setDeleted([])
        setLoadedUserId(user.uid)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  const counts = useMemo(
    () => ({ reviews: reviews.length, comments: comments.length, reports: reports.length }),
    [reviews, comments, reports],
  )

  const recentReviews = useMemo(
    () => [...reviews].sort(newestFirst).slice(0, 3),
    [reviews],
  )

  async function handleRestore(item) {
    setLoading(true)
    setError('')
    try {
      const restored = await restoreContribution(item)
      if (!restored) {
        setError(
          item.kind === 'report'
            ? 'Reports cannot currently be restored because of the current data permissions.'
            : 'Could not restore this item. It may no longer be available.',
        )
        return false
      }
      const { contributions, leaseRequests: leases, deleted: deletedItems } =
        await fetchAccountData(user)
      setReviews(contributions.reviews.filter((entry) => !entry.deletedAt))
      setComments(contributions.comments.filter((entry) => !entry.deletedAt))
      setReports(contributions.reports.filter((entry) => !entry.deletedAt))
      setLeaseRequests(leases)
      setDeleted(deletedItems)
      setLoadedUserId(user.uid)
      return true
    } catch (restoreError) {
      setError(restoreError.message || 'Could not restore this item. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    setError('')
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch (signOutError) {
      setError(signOutError.message || 'Could not sign out. Please try again.')
    } finally {
      setSigningOut(false)
    }
  }

  if (initialising) return <Spinner label="Checking your session" />
  if (!user) return <Spinner label="Redirecting to sign in" />

  return (
    <main className="section py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="grid h-14 w-14 place-items-center rounded-full bg-primary-tint font-display text-xl font-semibold text-primary-dark"
            >
              {initialsOf(user.accountName || user.displayName, user.email)}
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">{displayNameOf(user)}</h1>
              <p className="text-sm text-muted">{user.email || '—'}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone="primary">{signInMethod(user)}</Badge>
                <span className="text-xs text-muted">
                  Member since {formatDate(user.metadata?.creationTime)}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </header>

        {error && <p className="mt-4 text-sm text-danger" role="alert">{error}</p>}

        {loading || loadedUserId !== user.uid ? (
          <Spinner label="Loading your contributions" />
        ) : (
          <>
            <section id="contributions" className="mt-8">
              <h2 className="font-display text-xl font-semibold text-ink">Your contributions</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-surface p-4">
                  <p className="text-sm text-muted">Reviews</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink">{counts.reviews}</p>
                </div>
                <div className="rounded-xl border border-line bg-surface p-4">
                  <p className="text-sm text-muted">Comments</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink">{counts.comments}</p>
                </div>
                <div className="rounded-xl border border-line bg-surface p-4">
                  <p className="text-sm text-muted">Reports</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-ink">{counts.reports}</p>
                </div>
              </div>

              {recentReviews.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No reviews yet"
                    description="Reviews you write about a farm will appear here. Browse farms to find one you have visited."
                    actionLabel="Browse farms"
                    onAction={() => navigate('/farms')}
                  />
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {recentReviews.map((review) => (
                    <li key={review.id} className="rounded-xl border border-line bg-surface p-4">
                      <p className="text-sm font-semibold text-ink">{review.farmId || 'Farm review'}</p>
                      <p className="mt-1 text-sm text-muted">{review.body}</p>
                      <p className="mt-2 text-xs text-muted">{formatDate(review.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-8">
              <h2 className="font-display text-xl font-semibold text-ink">Lease requests</h2>
              {leaseRequests.length === 0 ? (
                <div className="mt-3">
                  <EmptyState
                    title="No lease requests yet"
                    description="When you send a request to a farm owner it will appear here with its status."
                    actionLabel="Browse farms"
                    onAction={() => navigate('/farms')}
                  />
                </div>
              ) : (
                <ul className="mt-3 space-y-3">
                  {leaseRequests.map((request) => (
                    <li key={request.id} className="rounded-xl border border-line bg-surface p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="font-semibold text-ink">{request.farmTitle || request.farmId}</p>
                        <Badge tone="warning">{request.status || 'Pending'}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {request.crops || '—'} · starts {formatDate(request.startDate)}
                      </p>
                      <p className="mt-1 text-sm text-muted">Owner: {request.ownerName || '—'}</p>
                      {request.message && <p className="mt-2 text-sm text-ink">{request.message}</p>}
                      <p className="mt-2 text-xs text-muted">Sent {formatDate(request.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <RecentlyDeleted items={deleted} onRestore={handleRestore} />
          </>
        )}
      </div>
    </main>
  )
}
