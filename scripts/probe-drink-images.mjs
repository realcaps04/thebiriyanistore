const url = 'https://www.zomato.com/kochi/the-biryani-store-kaloor/order'
const res = await fetch(url, {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
})
const html = await res.text()

function getImage(drink) {
  const marker = `\\"name\\":\\"${drink.replace(/\\/g, '\\\\')}\\"`
  const idx = html.indexOf(marker)
  if (idx === -1) return null
  const chunk = html.slice(idx, idx + 1500)
  const itemImage = chunk.match(/item_image_url\\":\\"(.*?)\\"/)?.[1]?.replace(/\\\//g, '/')
  const mediaImage = chunk.match(/\\"url\\":\\"(https:\\\/\\\/b\.zmtcdn\.com\\\/data\\\/dish_photos\\\/[^\\]+)\\"/)?.[1]?.replace(/\\\//g, '/')
  return mediaImage || itemImage || null
}

for (const drink of ['Fresh Lime', 'Mint Lime', 'Pineapple Lime Juice', 'Mirinda 330ml CAN']) {
  console.log(drink, '->', getImage(drink))
}
