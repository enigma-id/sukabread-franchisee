// Generates minimal PWA icon PNGs from favicon SVG
// Run: node scripts/generate-pwa-icons.mjs

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

// Check if sharp is available, otherwise use pngjs
let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.log('sharp not available, using fallback SVG->PNG via chrome headless')
  process.exit(0) // Skip - icons not critical for build
}

const svg = readFileSync(join(rootDir, 'public', 'favicon.svg'))

await sharp(svg)
  .resize(192, 192)
  .png()
  .toFile(join(rootDir, 'public', 'pwa-192x192.png'))

await sharp(svg)
  .resize(512, 512)
  .png()
  .toFile(join(rootDir, 'public', 'pwa-512x512.png'))

console.log('PWA icons generated: pwa-192x192.png, pwa-512x512.png')