import { Component } from 'react'

/**
 * Catches render errors anywhere below it so a single broken component does
 * not blank the whole site. Class component because there is no hook version.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // In production this is where an error reporter would be wired in.
    console.error('Unhandled UI error', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="grid min-h-screen place-items-center bg-paper px-4">
        <div className="w-full max-w-md rounded-xl border border-line bg-surface p-8 text-center shadow-card">
          <p aria-hidden="true" className="text-3xl">
            🌾
          </p>
          <h1 className="mt-3 font-display text-xl font-semibold">Something broke on our side</h1>
          <p className="mt-2 text-sm text-muted">
            The page failed to load. Reloading usually fixes it, and nothing you entered was lost.
          </p>
          <button
            type="button"
            onClick={() => window.location.assign('/Farming-Nyumbani/')}
            className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Back to the home page
          </button>
        </div>
      </div>
    )
  }
}