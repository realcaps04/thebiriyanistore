import { useMutation, useQuery } from 'convex/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../../convex/_generated/api'
import {
  getCartItems,
  lineItemTotal,
  saveCartItems,
  type CartLineItem,
} from '../config/cart'
import { useAuthSession } from './useAuthSession'

export function useCartSync() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuthSession()
  const remoteCart = useQuery(
    api.cart.getCart,
    isAuthenticated && token ? { token } : 'skip',
  )
  const replaceCart = useMutation(api.cart.replaceCart)
  const addItemRemote = useMutation(api.cart.addItem)
  const removeItemRemote = useMutation(api.cart.removeItem)
  const clearCartRemote = useMutation(api.cart.clearCart)
  const syncedRef = useRef(false)
  const [localItems, setLocalItems] = useState<CartLineItem[]>(() => getCartItems())

  useEffect(() => {
    syncedRef.current = false
  }, [token])

  useEffect(() => {
    const refresh = () => setLocalItems(getCartItems())
    window.addEventListener('cart-updated', refresh)
    return () => window.removeEventListener('cart-updated', refresh)
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !token || remoteCart === undefined || syncedRef.current) return

    const localItemsOnLoad = getCartItems()

    if (remoteCart.items.length === 0 && localItemsOnLoad.length > 0) {
      void replaceCart({ token, items: localItemsOnLoad })
    } else if (remoteCart.items.length > 0) {
      saveCartItems(remoteCart.items)
      setLocalItems(remoteCart.items)
    }

    syncedRef.current = true
  }, [isAuthenticated, token, remoteCart, replaceCart])

  useEffect(() => {
    if (!isAuthenticated || !token || remoteCart === undefined || !syncedRef.current) return
    if (remoteCart.updatedAt === null) return

    const remoteKey = JSON.stringify(remoteCart.items)
    const localKey = JSON.stringify(getCartItems())

    if (remoteKey !== localKey) {
      saveCartItems(remoteCart.items)
      setLocalItems(remoteCart.items)
    }
  }, [isAuthenticated, token, remoteCart])

  const items =
    isAuthenticated && remoteCart !== undefined && syncedRef.current
      ? remoteCart.items
      : localItems

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const total = useMemo(
    () => items.reduce((sum, item) => sum + lineItemTotal(item), 0),
    [items],
  )

  const addItem = useCallback(
    async (item: Omit<CartLineItem, 'id'>) => {
      const line: CartLineItem = { ...item, id: crypto.randomUUID() }
      const nextItems = [...getCartItems(), line]
      saveCartItems(nextItems)
      setLocalItems(nextItems)

      if (isAuthenticated && token) {
        await addItemRemote({ token, item: line })
      }

      return line
    },
    [isAuthenticated, token, addItemRemote],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      const nextItems = getCartItems().filter((item) => item.id !== itemId)
      saveCartItems(nextItems)
      setLocalItems(nextItems)

      if (isAuthenticated && token) {
        await removeItemRemote({ token, itemId })
      }
    },
    [isAuthenticated, token, removeItemRemote],
  )

  const clearCart = useCallback(async () => {
    saveCartItems([])
    setLocalItems([])

    if (isAuthenticated && token) {
      await clearCartRemote({ token })
    }
  }, [isAuthenticated, token, clearCartRemote])

  return {
    token,
    items,
    count,
    total,
    lineItemTotal,
    addItem,
    removeItem,
    clearCart,
    isLoading: authLoading || (isAuthenticated && remoteCart === undefined),
  }
}

export function useOrdersSync() {
  const { token, isAuthenticated } = useAuthSession()
  return useQuery(
    api.orders.listActiveOrders,
    isAuthenticated && token ? { token } : 'skip',
  )
}
