import { Jimp } from 'jimp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const brandDir = path.join(__dirname, '..', 'public', 'brand')
const refPath = path.join(brandDir, 'welcome-reference.jpg')

function sampleBackgroundColor(image) {
  const samples = [
    [4, 4],
    [image.bitmap.width - 5, 4],
    [4, image.bitmap.height - 5],
    [image.bitmap.width - 5, image.bitmap.height - 5],
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
  if (r < 50 && g < 50 && b < 50) return true

  const dr = r - bg.r
  const dg = g - bg.g
  const db = b - bg.b
  return Math.sqrt(dr * dr + dg * dg + db * db) <= tolerance
}

async function exportCrop(x, y, w, h, outName, tolerance = 28) {
  const ref = await Jimp.read(refPath)
  const crop = ref.clone().crop({ x, y, w, h })
  const bg = sampleBackgroundColor(crop)

  crop.scan(0, 0, crop.bitmap.width, crop.bitmap.height, (px, py, idx) => {
    const r = crop.bitmap.data[idx]
    const g = crop.bitmap.data[idx + 1]
    const b = crop.bitmap.data[idx + 2]

    if (shouldBeTransparent(r, g, b, bg, tolerance)) {
      crop.bitmap.data[idx + 3] = 0
    }
  })

  await crop.write(path.join(brandDir, outName))
}

// Stop above the mockup home-indicator bar at the bottom of the reference.
await exportCrop(0, 835, 278, 165, 'food-biryani.png', 26)
await exportCrop(218, 840, 255, 160, 'food-sides.png', 26)

console.log('Saved clean food PNGs')
