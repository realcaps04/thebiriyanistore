import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'drinks')

// Official menu photos from The Biryani Store on Zomato (b.zmtcdn.com)
const items = [
  {
    file: '7up-330ml.png',
    url: 'https://b.zmtcdn.com/data/dish_photos/7d6/03a8da214a0b8cba05de6b797c4927d6.png',
  },
  {
    file: 'fresh-lime.png',
    url: 'https://b.zmtcdn.com/data/dish_photos/3b3/f9b5a1e0ae2f4bab5e316a8cb53d63b3.png',
  },
  {
    file: 'mirinda-330ml.png',
    url: 'https://b.zmtcdn.com/data/dish_photos/f87/0141846153aa57d6883fc6e6bb896f87.png',
  },
  {
    file: 'pepsi-330ml.png',
    url: 'https://b.zmtcdn.com/data/dish_photos/60b/b455b08fa25619743d283c779949160b.png',
  },
  {
    file: 'zero-pepsi-330ml.jpg',
    url: 'https://b.zmtcdn.com/data/dish_photos/603/06d8f9c93f50e8e98ce38f080c71e603.png',
  },
]

await fs.mkdir(outDir, { recursive: true })

for (const item of items) {
  const response = await fetch(`${item.url}?fit=around%7C800%3A800&crop=800%3A800%3B%2A%2C%2A`, {
    headers: { 'User-Agent': 'thebiryanistore-menu-sync/1.0' },
  })
  if (!response.ok) throw new Error(`Failed to download ${item.file}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  await fs.writeFile(path.join(outDir, item.file), buffer)
  console.log(`Saved ${item.file}`)
}

console.log('Done downloading drink images')
