import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Defaults to the site root for local development and tests. The Pages deploy
  // workflow sets VITE_BASE_PATH to /<repo>/ because a project site is served
  // from a subpath, and every asset URL has to include it.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    // Extra allowed hosts (e.g. a cloud preview domain) come from the environment,
    // so no machine-specific hostname is committed to the repository.
    allowedHosts: (process.env.VITE_ALLOWED_HOSTS ?? '')
      .split(',')
      .map((host) => host.trim())
      .filter(Boolean),
  },
  test: {
    environment: 'jsdom',
    // A real origin is required: jsdom disables localStorage on opaque origins.
    environmentOptions: {
      jsdom: { url: 'http://localhost:3000/' },
    },
    setupFiles: './src/tests/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/tests/**',
        'src/data/**',
        'src/**/*.test.{js,jsx}',
        'src/services/engagementFirestore.js',
      ],
      // Report first, then fail the run below these totals. The numbers sit just
      // under what the suite actually reaches, so a new untested page or a
      // dropped test breaks `npm run coverage` instead of passing quietly.
      thresholds: {
        statements: 90,
        branches: 82,
        functions: 86,
        lines: 90,
      },
    },
  },
})