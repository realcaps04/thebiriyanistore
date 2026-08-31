const url =
  'https://www.zomato.com/webroutes/getPage?page_url=%2Fkochi%2Fthe-biryani-store-kaloor%2Forder&location=kochi'

const response = await fetch(url, {
  headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
})
const data = JSON.parse(await response.text())

const targets = [
  'I Need More Salad',
  'I Need More Gravy',
  'I Need Extra Boiled Egg',
  'I Need Dates Pickle',
  'Chicken Fry - Small',
]

function walk(node, out = []) {
  if (!node || typeof node !== 'object') return out
  if (Array.isArray(node)) {
    for (const item of node) walk(item, out)
    return out
  }
  const name = node.name
  if (typeof name === 'string' && targets.includes(name)) {
    out.push({
      name,
      show_item_image: node.show_item_image,
      item_image_url: node.item_image_url,
      media: node.media,
    })
  }
  for (const value of Object.values(node)) walk(value, out)
  return out
}

console.log(JSON.stringify(walk(data), null, 2))
