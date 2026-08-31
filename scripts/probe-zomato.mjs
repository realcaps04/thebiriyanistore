import fs from 'node:fs/promises'

const url = 'https://www.zomato.com/kochi/the-biryani-store-kaloor/order'
const res = await fetch(url, {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
})
const html = await res.text()
await fs.writeFile('scripts/zomato.html', html)

const drinks = ['7 UP 330ml CAN', 'Fresh Lime', 'Mirinda 330ml CAN', 'Pepsi 330ml CAN', 'Zero Pepsi 330ml Can']
for (const drink of drinks) {
  let idx = 0
  while (true) {
    idx = html.indexOf(drink, idx)
    if (idx === -1) break
    const chunk = html.slice(idx, idx + 2500)
    const imgs = [...chunk.matchAll(/https:\/\/b\.zmtcdn\.com\/data\/[^"'\\]+/g)].map((m) => m[0])
    if (imgs.length) console.log(drink, imgs[0])
    idx += drink.length
  }
}

const allMenuImgs = [...html.matchAll(/https:\/\/b\.zmtcdn\.com\/data\/[^"'\\]*(?:jpg|jpeg|png|webp)[^"'\\]*/g)].map((m) => m[0])
const unique = [...new Set(allMenuImgs)]
console.log('unique menu-ish images', unique.length)
for (const img of unique.slice(0, 40)) console.log(img.slice(0, 180))
