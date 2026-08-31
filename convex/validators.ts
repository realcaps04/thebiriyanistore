import { v } from 'convex/values'

export const cartAddonValidator = v.object({
  id: v.string(),
  groupId: v.string(),
  name: v.string(),
  price: v.number(),
})

export const cartLineItemValidator = v.object({
  id: v.string(),
  menuItemId: v.string(),
  name: v.string(),
  image: v.string(),
  sizeId: v.string(),
  sizeLabel: v.string(),
  basePrice: v.number(),
  addons: v.array(cartAddonValidator),
  specialInstructions: v.string(),
  quantity: v.number(),
})

export const orderTypeValidator = v.union(
  v.literal('dine-in'),
  v.literal('takeaway'),
  v.literal('delivery'),
)
