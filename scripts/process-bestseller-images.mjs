import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'bestsellers')

const items = [
  {
    url: 'https://dineinpetweb.gumlet.io/homewebsite/120827/thumb_2024_01_12_13_21_17_Malabar_biryani.jpg?w=800&format=jpg&q=85',
    file: 'chicken-malabar.jpg',
  },
  {
    url: 'https://dineinpetweb.gumlet.io/homewebsite/120827/thumb_2024_01_12_13_21_39_Beef_Biryani.jpg?w=800&format=jpg&q=85',
    file: 'beef-malabar.jpg',
  },
  {
    url: 'https://dineinpetweb.gumlet.io/homewebsite/120827/thumb_2024_01_12_13_28_43_Chicken_Fry_small.jpg?w=800&format=jpg&q=85',
    file: 'chicken-fry.jpg',
  },
  {
    url: 'https://dineinpetweb.gumlet.io/homewebsite/120827/thumb_2024_01_12_13_28_12_Donne_biryani.jpg?w=800&format=jpg&q=85',
    file: 'donne-chicken.jpg',
  },
]

await fs.mkdir(outDir, { recursive: true })

for (const item of items) {
  const response = await fetch(item.url)
  if (!response.ok) {
    throw new Error(`Failed to download ${item.file}: ${response.status}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  await fs.writeFile(path.join(outDir, item.file), buffer)
  console.log(`Saved ${item.file}`)
}

console.log('Done downloading original bestseller images')
