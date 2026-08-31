import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import type { MutationCtx } from './_generated/server'
import type { Id } from './_generated/dataModel'
import { googleIdFromToken } from './session'
import { deliveryAddressFieldsValidator } from './validators'

function normalizeLabelKey(label: string) {
  return label.trim().toLowerCase()
}

function formatLabel(label: string) {
  const trimmed = label.trim()
  if (!trimmed) return trimmed
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

async function findAddressByLabelKey(
  ctx: { db: MutationCtx['db'] },
  googleId: string,
  labelKey: string,
  excludeId?: Id<'deliveryAddresses'>,
) {
  const indexed = await ctx.db
    .query('deliveryAddresses')
    .withIndex('by_google_id_and_label_key', (q) =>
      q.eq('googleId', googleId).eq('labelKey', labelKey),
    )
    .unique()

  if (indexed && indexed._id !== excludeId) {
    return indexed
  }

  const addresses = await ctx.db
    .query('deliveryAddresses')
    .withIndex('by_google_id', (q) => q.eq('googleId', googleId))
    .collect()

  return (
    addresses.find(
      (address) =>
        address._id !== excludeId &&
        normalizeLabelKey(address.label) === labelKey,
    ) ?? null
  )
}

export const listAddresses = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const addresses = await ctx.db
      .query('deliveryAddresses')
      .withIndex('by_google_id', (q) => q.eq('googleId', googleId))
      .collect()

    return addresses.sort((a, b) => {
      if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1
      return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    })
  },
})

export const addAddress = mutation({
  args: {
    token: v.string(),
    address: deliveryAddressFieldsValidator,
  },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const label = formatLabel(args.address.label)
    const labelKey = normalizeLabelKey(label)

    if (!labelKey) {
      throw new Error('Address title is required.')
    }

    const duplicate = await findAddressByLabelKey(ctx, googleId, labelKey)
    if (duplicate) {
      throw new Error(`An address titled "${duplicate.label}" already exists. Choose a different title.`)
    }

    const existing = await ctx.db
      .query('deliveryAddresses')
      .withIndex('by_google_id', (q) => q.eq('googleId', googleId))
      .collect()

    const isFirst = existing.length === 0
    const addressId = await ctx.db.insert('deliveryAddresses', {
      googleId,
      label,
      labelKey,
      contactName: args.address.contactName.trim(),
      phone: args.address.phone.trim(),
      addressLine: args.address.addressLine.trim(),
      pincode: args.address.pincode?.trim() || undefined,
      isDefault: isFirst,
      createdAt: Date.now(),
    })

    return { addressId, label }
  },
})

export const updateAddress = mutation({
  args: {
    token: v.string(),
    addressId: v.id('deliveryAddresses'),
    address: deliveryAddressFieldsValidator,
  },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const current = await ctx.db.get(args.addressId)

    if (!current || current.googleId !== googleId) {
      throw new Error('Address not found.')
    }

    const label = formatLabel(args.address.label)
    const labelKey = normalizeLabelKey(label)

    if (!labelKey) {
      throw new Error('Address title is required.')
    }

    const duplicate = await findAddressByLabelKey(ctx, googleId, labelKey, args.addressId)
    if (duplicate) {
      throw new Error(`An address titled "${duplicate.label}" already exists. Choose a different title.`)
    }

    await ctx.db.patch(args.addressId, {
      label,
      labelKey,
      contactName: args.address.contactName.trim(),
      phone: args.address.phone.trim(),
      addressLine: args.address.addressLine.trim(),
      pincode: args.address.pincode?.trim() || undefined,
    })

    return { ok: true as const, label }
  },
})

export const setDefaultAddress = mutation({
  args: {
    token: v.string(),
    addressId: v.id('deliveryAddresses'),
  },
  handler: async (ctx, args) => {
    const googleId = await googleIdFromToken(ctx, args.token)
    const target = await ctx.db.get(args.addressId)
    if (!target || target.googleId !== googleId) {
      throw new Error('Address not found.')
    }

    const addresses = await ctx.db
      .query('deliveryAddresses')
      .withIndex('by_google_id', (q) => q.eq('googleId', googleId))
      .collect()

    for (const address of addresses) {
      await ctx.db.patch(address._id, { isDefault: address._id === args.addressId })
    }

    return { ok: true as const }
  },
})
