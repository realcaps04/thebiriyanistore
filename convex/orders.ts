import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { googleIdFromToken } from './session'
import { orderTypeValidator } from './validators'

function lineItemTotal(item: {
  basePrice: number
  quantity: number
  addons: { price: number }[]
}) {
  const addonTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0)
  return (item.basePrice + addonTotal) * item.quantity
}

export const listActiveOrders = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const orders = await ctx.db
      .query('orders')
      .withIndex('by_google_id', (q) => q.eq('googleId', googleId))
      .order('desc')
      .take(20)

    return orders
      .filter((order) => order.status !== 'completed' && order.status !== 'cancelled')
      .map((order) => ({
        id: order.displayOrderId,
        status: order.statusLabel,
        orderType: order.orderType,
        items: order.items.map((item) => item.image),
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        price: order.total,
        time: order.timeLabel,
        table: order.tableLabel,
      }))
  },
})

export const placeOrder = mutation({
  args: {
    token: v.string(),
    displayOrderId: v.string(),
    orderType: orderTypeValidator,
    tableNumber: v.string(),
    guestCount: v.number(),
    customerName: v.string(),
    deliveryAddressId: v.optional(v.id('deliveryAddresses')),
  },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const cart = await ctx.db
      .query('carts')
      .withIndex('by_google_id', (q) => q.eq('googleId', googleId))
      .unique()

    const items = cart?.items ?? []
    if (items.length === 0) {
      throw new Error('Cart is empty.')
    }

    let deliveryAddress:
      | {
          label: string
          contactName: string
          phone: string
          addressLine: string
          pincode?: string
        }
      | undefined

    if (args.orderType === 'delivery') {
      if (!args.deliveryAddressId) {
        throw new Error('Add a delivery address to continue.')
      }

      const address = await ctx.db.get(args.deliveryAddressId)
      if (!address || address.googleId !== googleId) {
        throw new Error('Delivery address not found.')
      }

      deliveryAddress = {
        label: address.label,
        contactName: address.contactName,
        phone: address.phone,
        addressLine: address.addressLine,
        pincode: address.pincode,
      }
    }

    const subtotal = items.reduce((sum, item) => sum + lineItemTotal(item), 0)
    const tax = 0
    const total = Math.round(subtotal)
    const now = Date.now()

    const tableLabel =
      args.orderType === 'dine-in'
        ? `Table ${args.tableNumber}`
        : args.orderType === 'delivery' && deliveryAddress
          ? `Delivery · ${deliveryAddress.label}`
          : args.orderType

    const orderId = await ctx.db.insert('orders', {
      googleId,
      displayOrderId: args.displayOrderId,
      orderType: args.orderType,
      tableNumber: args.tableNumber,
      guestCount: args.guestCount,
      customerName: args.customerName,
      items,
      subtotal,
      tax,
      total,
      status: 'confirmed',
      statusLabel: 'Confirmed',
      statusColor: 'bg-emerald-100 text-emerald-700',
      timeLabel: 'Just now',
      tableLabel,
      deliveryAddressLabel: deliveryAddress?.label,
      deliveryContactName: deliveryAddress?.contactName,
      deliveryPhone: deliveryAddress?.phone,
      deliveryAddressLine: deliveryAddress?.addressLine,
      deliveryPincode: deliveryAddress?.pincode,
      createdAt: now,
      updatedAt: now,
    })

    if (cart) {
      await ctx.db.patch(cart._id, { items: [], updatedAt: now })
    }

    return { orderId, displayOrderId: args.displayOrderId, total }
  },
})
