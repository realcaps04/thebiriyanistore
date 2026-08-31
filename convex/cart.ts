import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import type { QueryCtx } from './_generated/server'
import { googleIdFromToken } from './session'
import { cartLineItemValidator } from './validators'

function lineItemTotal(item: {
  basePrice: number
  quantity: number
  addons: { price: number }[]
}) {
  const addonTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0)
  return (item.basePrice + addonTotal) * item.quantity
}

async function getCartRow(ctx: { db: QueryCtx['db'] }, googleId: string) {
  return ctx.db
    .query('carts')
    .withIndex('by_google_id', (q) => q.eq('googleId', googleId))
    .unique()
}

export const getCart = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const cart = await getCartRow(ctx, googleId)
    const items = cart?.items ?? []
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const total = items.reduce((sum, item) => sum + lineItemTotal(item), 0)
    return { items, count, total, updatedAt: cart?.updatedAt ?? null }
  },
})

export const replaceCart = mutation({
  args: {
    token: v.string(),
    items: v.array(cartLineItemValidator),
  },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const now = Date.now()
    const existing = await getCartRow(ctx, googleId)

    if (existing) {
      await ctx.db.patch(existing._id, { items: args.items, updatedAt: now })
    } else {
      await ctx.db.insert('carts', {
        googleId,
        items: args.items,
        updatedAt: now,
      })
    }

    return { ok: true as const }
  },
})

export const addItem = mutation({
  args: {
    token: v.string(),
    item: cartLineItemValidator,
  },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const now = Date.now()
    const existing = await getCartRow(ctx, googleId)
    const items = [...(existing?.items ?? []), args.item]

    if (existing) {
      await ctx.db.patch(existing._id, { items, updatedAt: now })
    } else {
      await ctx.db.insert('carts', { googleId, items, updatedAt: now })
    }

    return { ok: true as const }
  },
})

export const removeItem = mutation({
  args: {
    token: v.string(),
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const existing = await getCartRow(ctx, googleId)
    if (!existing) return { ok: true as const }

    const items = existing.items.filter((item) => item.id !== args.itemId)
    await ctx.db.patch(existing._id, { items, updatedAt: Date.now() })
    return { ok: true as const }
  },
})

export const clearCart = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const existing = await getCartRow(ctx, googleId)
    if (!existing) return { ok: true as const }

    await ctx.db.patch(existing._id, { items: [], updatedAt: Date.now() })
    return { ok: true as const }
  },
})
