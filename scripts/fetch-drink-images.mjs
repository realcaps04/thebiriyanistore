import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'drinks')

const zomatoUrl = 'https://www.zomato.com/kochi/the-biryani-store-kaloor/order'

const drinkNames = {
  '7up-330ml.jpg': '7 UP 330ml CAN',
  'fresh-lime.jpg': 'Fresh Lime',
  'mirinda-330ml.jpg': 'Mirinda 330ml CAN',
  'pepsi-330ml.jpg': 'Pepsi 330ml CAN',
  'zero-pepsi-330ml.jpg': 'Zero Pepsi 330ml Can',
}

function imageForName(html, name) {
  const idx = html.indexOf(name)
  if (idx === -1) return null
  const chunk = html.slice(Math.max(0, idx - 1200), idx + 1200)
  const matches = [...chunk.matchAll(/https:\/\/b\.zmtcdn\.com\/data\/dish_photos\/[^"'\\?]+(?:\.png|\.jpg|\.jpeg|\.webp)/g)]
  if (!matches.length) return null

  const nameOffset = idx - Math.max(0, idx - 1200)
  let best = matches[0][0]
  let bestDistance = Infinity
  for (const match of matches) {
    const distance = Math.abs(match.index - nameOffset)
    if (distance < bestDistance) {
      bestDistance = distance
      best = match[0]
    }
  }
  return best
}

function highRes(url) {
  return `${url.split('?')[0]}?fit=around%7C800%3A800&crop=800%3A800%3B%2A%2C%2A`
}

async function download(url, file) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'thebiryanistore-menu-sync/1.0' },
  })
  if (!response.ok) throw new Error(`Failed ${file}: ${response.status}`)
  await fs.writeFile(path.join(outDir, file), Buffer.from(await response.arrayBuffer()))
  console.log(`Saved ${file}`)
}

const res = await fetch(zomatoUrl, {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
})
const html = await res.text()

await fs.mkdir(outDir, { recursive: true })

for (const [file, name] of Object.entries(drinkNames)) {
  const url = imageForName(html, name)
  if (!url) throw new Error(`No image found for ${name}`)
  console.log(name, url)
  await download(highRes(url), file)
}

console.log('Done downloading drink images')
