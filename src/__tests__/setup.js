import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

/**
 * Node 22+ exposes an experimental `localStorage` global that is undefined
 * unless the process is started with --localstorage-file, and it shadows the
 * jsdom implementation. Reviews and identity are persisted, so give the test
 * environment a real in-memory Storage when that happens.
 */
function hasWorkingStorage() {
  try {
    return Boolean(window.localStorage) && typeof window.localStorage.setItem === 'function'
  } catch {
    return false
  }
}

if (!hasWorkingStorage()) {
  const store = new Map()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      get length() {
        return store.size
      },
      key: (index) => Array.from(store.keys())[index] ?? null,
      getItem: (key) => (store.has(String(key)) ? store.get(String(key)) : null),
      setItem: (key, value) => store.set(String(key), String(value)),
      removeItem: (key) => store.delete(String(key)),
      clear: () => store.clear(),
    },
  })
}

// jsdom logs "Not implemented: window.scrollTo" every time the shell resets
// scroll on a route change. The behaviour is asserted in PageShell.test.jsx, so
// the rest of the suite gets a silent stub instead of a page of stderr.
window.scrollTo = () => {}

// Vitest runs without injected globals here, so React Testing Library cannot
// register its own cleanup. Without this each test renders on top of the
// previous one and queries find duplicate elements.
afterEach(() => {
  cleanup()
  // Reviews, reactions and the local display name are persisted: reset between tests.
  window.localStorage.clear()
})