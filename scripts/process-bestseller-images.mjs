import { Jimp } from 'jimp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'bestsellers')

const items = [
  {
    url: 'https://dineinpetweb.gumlet.io/homewebsite/120827/thumb_2024_01_12_13_21_17_Malabar_biryani.jpg?w=400&format=auto&q=80',
    file: 'chicken-malabar.png',
    tolerance: 42,
  },
  {
    url: 'https://dineinpetweb.gumlet.io/homewebsite/120827/thumb_2024_01_12_13_21_39_Beef_Biryani.jpg?w=400&format=auto&q=80',
    file: 'beef-malabar.png',
    tolerance: 42,
  },
  {
    url: 'https://dineinpetweb.gumlet.io/homewebsite/120827/thumb_2024_01_12_13_28_43_Chicken_Fry_small.jpg?w=400&format=auto&q=80',
    file: 'chicken-fry.png',
    tolerance: 38,
  },
  {
    url: 'https://dineinpetweb.gumlet.io/homewebsite/120827/thumb_2024_01_12_13_28_12_Donne_biryani.jpg?w=400&format=auto&q=80',
    file: 'donne-chicken.png',
    tolerance: 40,
  },
]

function sampleBackgroundColor(image) {
  const { width, height } = image.bitmap
  const samples = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
    [Math.floor(width / 2), 2],
    [Math.floor(width / 2), height - 3],
  ]

  let r = 0
  let g = 0
  let b = 0

  for (const [x, y] of samples) {
    const idx = image.getPixelIndex(x, y)
    r += image.bitmap.data[idx]
    g += image.bitmap.data[idx + 1]
    b += image.bitmap.data[idx + 2]
  }

  return {
    r: Math.round(r / samples.length),
    g: Math.round(g / samples.length),
    b: Math.round(b / samples.length),
  }
}

function shouldBeTransparent(r, g, b, bg, tolerance) {
  const dr = r - bg.r
  const dg = g - bg.g
  const db = b - bg.b
  const distance = Math.sqrt(dr * dr + dg * dg + db * db)

  const isWoodLike =
    r > 150 &&
    g > 120 &&
    b > 90 &&
    r >= g &&
    g >= b &&
    r - b < 90

  return distance <= tolerance || isWoodLike
}

async function processImage({ url, file, tolerance }) {
  const image = await Jimp.read(url)
  const bg = sampleBackgroundColor(image)

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const r = image.bitmap.data[idx]
    const g = image.bitmap.data[idx + 1]
    const b = image.bitmap.data[idx + 2]

    if (shouldBeTransparent(r, g, b, bg, tolerance)) {
      image.bitmap.data[idx + 3] = 0
    }
  })

  await image.write(path.join(outDir, file))
}

await fs.mkdir(outDir, { recursive: true })

for (const item of items) {
  await processImage(item)
  console.log(`Saved ${item.file}`)
}

console.log('Done processing bestseller images')
