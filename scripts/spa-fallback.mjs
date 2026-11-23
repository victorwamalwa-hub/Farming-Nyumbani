/**
 * GitHub Pages SPA fallback.
 *
 * Pages serves 404.html for unknown paths; copying index.html there lets the
 * client router boot on a deep link (e.g. /farms/kiambu-...) instead of a host
 * 404. Run via `npm run build:pages`.
 */
import { access, copyFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const indexHtml = resolve(distDir, 'index.html')
const fallbackHtml = resolve(distDir, '404.html')

async function main() {
  try {
    await access(indexHtml, constants.F_OK)
  } catch {
    throw new Error('dist/index.html not found. Run `vite build` before the SPA fallback step.')
  }

  await copyFile(indexHtml, fallbackHtml)
  console.log('SPA fallback written: dist/404.html')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
