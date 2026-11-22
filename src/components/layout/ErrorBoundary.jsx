import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Application render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="section flex min-h-screen flex-col items-start justify-center py-12">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Something went wrong
          </h1>
          <p className="mt-3 max-w-lg text-muted">
            This page ran into a problem. Reload to try again.
          </p>
          <button
            className="mt-6 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark"
            onClick={() => window.location.reload()}
            type="button"
          >
            Reload page
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
