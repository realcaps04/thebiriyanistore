const url = 'https://www.zomato.com/kochi/the-biryani-store-kaloor/order'
const res = await fetch(url, {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
})
const html = await res.text()
console.log('has 7 UP', html.includes('7 UP 330ml CAN'))
console.log('first idx', html.indexOf('7 UP 330ml CAN'))

const drinks = ['7 UP 330ml CAN', 'Fresh Lime', 'Mirinda 330ml CAN', 'Pepsi 330ml CAN', 'Zero Pepsi 330ml Can']

for (const drink of drinks) {
  let idx = 0
  const found = []
  while (true) {
    idx = html.indexOf(drink, idx)
    if (idx === -1) break
    const chunk = html.slice(Math.max(0, idx - 800), idx + 1200)
    const imgs = [...chunk.matchAll(/https:\/\/b\.zmtcdn\.com\/data\/dish_photos\/[^"'\\?]+(?:\.png|\.jpg|\.jpeg|\.webp)/g)].map((m) => m[0])
    found.push({ idx, imgs })
    idx += drink.length
  }
  const last = found.at(-1)?.imgs.at(-1)
  console.log(drink, 'occurrences', found.length, 'pick', last)
}
