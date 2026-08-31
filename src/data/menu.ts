import { bestSellers, biryanis, drinks, egg, products, type MenuItem } from './home'

const allItems = [...bestSellers, ...biryanis, ...drinks, ...egg, ...products]

export function getMenuItemById(id: string): MenuItem | undefined {
  return allItems.find((item) => item.id === id)
}

export type ProductSizeOption = {
  id: string
  label: string
  detail: string
  price: number
}

export type ProductAddon = {
  id: string
  name: string
  price: number
  icon: string
}

export const productAddons: ProductAddon[] = [
  { id: 'egg', name: 'Boiled Egg', price: 14.29, icon: '🥚' },
  { id: 'chicken-fry', name: 'Chicken Fry', price: 40, icon: '🍗' },
  { id: 'raita', name: 'Extra Raita', price: 25, icon: '🥣' },
  { id: 'salad', name: 'Onion Salad', price: 15, icon: '🥗' },
]

export function getProductSizes(item: MenuItem): ProductSizeOption[] {
  const name = item.name.toLowerCase()

  if (name.includes('mini') || name.includes('rice only')) {
    return [{ id: 'standard', label: 'Standard', detail: item.desc, price: item.price }]
  }

  if (!item.customizable) {
    return [{ id: 'standard', label: 'Standard', detail: item.desc, price: item.price }]
  }

  return [
    { id: 'regular', label: 'Regular', detail: 'Full portion serving', price: item.price },
    { id: 'mini', label: 'Mini', detail: 'Single piece serving', price: 152.38 },
  ]
}

export function isBestSeller(id: string): boolean {
  return bestSellers.some((item) => item.id === id)
}
