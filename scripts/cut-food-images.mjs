import { Jimp } from 'jimp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const brandDir = path.join(__dirname, '..', 'public', 'brand')
const refPath = path.join(brandDir, 'welcome-reference.jpg')

function sampleBackgroundColor(image) {
  const samples = [
    [2, 2],
    [image.bitmap.width - 3, 2],
    [2, image.bitmap.height - 3],
    [image.bitmap.width - 3, image.bitmap.height - 3],
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

function isBackground(r, g, b, bg, tolerance) {
  const dr = r - bg.r
  const dg = g - bg.g
  const db = b - bg.b
  return Math.sqrt(dr * dr + dg * dg + db * db) <= tolerance
}

async function exportCrop(x, y, w, h, outName, tolerance = 34) {
  const ref = await Jimp.read(refPath)
  const crop = ref.clone().crop({ x, y, w, h })
  const bg = sampleBackgroundColor(crop)

  crop.scan(0, 0, crop.bitmap.width, crop.bitmap.height, (px, py, idx) => {
    const r = crop.bitmap.data[idx]
    const g = crop.bitmap.data[idx + 1]
    const b = crop.bitmap.data[idx + 2]

    if (isBackground(r, g, b, bg, tolerance)) {
      crop.bitmap.data[idx + 3] = 0
    }
  })

  await crop.write(path.join(brandDir, outName))
}

await exportCrop(0, 905, 215, 119, 'food-biryani.png', 30)
await exportCrop(268, 915, 205, 109, 'food-sides.png', 30)

console.log('Saved transparent food PNGs')
