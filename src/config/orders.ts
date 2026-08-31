export type ActiveOrder = {
  id: string
  status: string
  orderType?: 'dine-in' | 'takeaway' | 'delivery'
  items: string[]
  itemCount: number
  price: number
  time: string
  table: string
}

const ORDERS_STORAGE_KEY = 'tbs_active_orders'

export function getActiveOrders(): ActiveOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ActiveOrder[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveActiveOrders(orders: ActiveOrder[]) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

export function addActiveOrder(order: ActiveOrder) {
  const orders = getActiveOrders()
  saveActiveOrders([order, ...orders])
}
