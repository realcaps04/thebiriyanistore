import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'egg')

const url =
  'https://b.zmtcdn.com/data/dish_photos/731/dcbecd97a51cb4ba0a5679fb62fb8731.jpeg?fit=around%7C800%3A800&crop=800%3A800%3B%2A%2C%2A'

await fs.mkdir(outDir, { recursive: true })
const response = await fetch(url, {
  headers: { 'User-Agent': 'thebiryanistore-menu-sync/1.0' },
})
if (!response.ok) throw new Error(`Failed to download egg image: ${response.status}`)
await fs.writeFile(path.join(outDir, 'egg-boiled.jpg'), Buffer.from(await response.arrayBuffer()))
console.log('Saved egg-boiled.jpg')
