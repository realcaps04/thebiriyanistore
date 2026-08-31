import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

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
})
