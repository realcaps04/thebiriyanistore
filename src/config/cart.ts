export type CartAddon = {
  id: string
  groupId: string
  name: string
  price: number
}

export type CartLineItem = {
  id: string
  menuItemId: string
  name: string
  image: string
  sizeId: string
  sizeLabel: string
  basePrice: number
  addons: CartAddon[]
  specialInstructions: string
  quantity: number
}

const CART_STORAGE_KEY = 'tbs_cart'

export function getCartItems(): CartLineItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLineItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveCartItems(items: CartLineItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export function lineItemTotal(item: CartLineItem): number {
  const addonTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0)
  return (item.basePrice + addonTotal) * item.quantity
}

export function getCartSummary() {
  const items = getCartItems()
  return {
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + lineItemTotal(item), 0),
    items,
  }
}

export function addCartItem(item: Omit<CartLineItem, 'id'>) {
  const items = getCartItems()
  saveCartItems([...items, { ...item, id: crypto.randomUUID() }])
}

export function removeCartItem(id: string) {
  saveCartItems(getCartItems().filter((item) => item.id !== id))
}

export function clearCart() {
  saveCartItems([])
}
