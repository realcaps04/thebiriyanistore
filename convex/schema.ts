import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { cartLineItemValidator, orderTypeValidator } from './validators'

export default defineSchema({
  users: defineTable({
    googleId: v.string(),
    email: v.string(),
    name: v.string(),
    picture: v.union(v.string(), v.null()),
    emailVerified: v.boolean(),
    locale: v.optional(v.string()),
    lastLoginAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_google_id', ['googleId'])
    .index('by_email', ['email']),

  sessions: defineTable({
    token: v.string(),
    googleId: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    lastSeenAt: v.number(),
  })
    .index('by_token', ['token'])
    .index('by_google_id', ['googleId']),

  carts: defineTable({
    googleId: v.string(),
    items: v.array(cartLineItemValidator),
    updatedAt: v.number(),
  }).index('by_google_id', ['googleId']),

  orders: defineTable({
    googleId: v.string(),
    displayOrderId: v.string(),
    orderType: orderTypeValidator,
    tableNumber: v.string(),
    guestCount: v.number(),
    customerName: v.string(),
    items: v.array(cartLineItemValidator),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    status: v.string(),
    statusLabel: v.string(),
    statusColor: v.string(),
    timeLabel: v.string(),
    tableLabel: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_google_id', ['googleId'])
    .index('by_display_order_id', ['displayOrderId']),
})
