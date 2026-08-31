import { action, internalMutation, mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'

const SESSION_DAYS = 30
const MAX_DEVICES_PER_ACCOUNT = 4

type SignInResult = {
  token: string
  expiresAt: number
  user: {
    id: string
    email: string
    name: string
    picture: string | null
  }
}

function makeSessionToken() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function mapUser(user: {
  googleId: string
  email: string
  name: string
  picture: string | null
}) {
  return {
    id: user.googleId,
    email: user.email,
    name: user.name,
    picture: user.picture,
  }
}

export const upsertFromGoogle = internalMutation({
  args: {
    googleId: v.string(),
    email: v.string(),
    name: v.string(),
    picture: v.union(v.string(), v.null()),
    emailVerified: v.boolean(),
    locale: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const existing = await ctx.db
      .query('users')
      .withIndex('by_google_id', (q) => q.eq('googleId', args.googleId))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        picture: args.picture,
        emailVerified: args.emailVerified,
        locale: args.locale,
        lastLoginAt: now,
      })
    } else {
      await ctx.db.insert('users', {
        googleId: args.googleId,
        email: args.email,
        name: args.name,
        picture: args.picture,
        emailVerified: args.emailVerified,
        locale: args.locale,
        lastLoginAt: now,
        createdAt: now,
      })
    }

    const sessions = await ctx.db
      .query('sessions')
      .withIndex('by_google_id', (q) => q.eq('googleId', args.googleId))
      .collect()

    const activeSessions = []
    for (const session of sessions) {
      if (session.expiresAt < now) {
        await ctx.db.delete(session._id)
      } else {
        activeSessions.push(session)
      }
    }

    if (activeSessions.length >= MAX_DEVICES_PER_ACCOUNT) {
      const sessionsToRemove = activeSessions
        .sort((a, b) => a.lastSeenAt - b.lastSeenAt)
        .slice(0, activeSessions.length - MAX_DEVICES_PER_ACCOUNT + 1)

      for (const session of sessionsToRemove) {
        await ctx.db.delete(session._id)
      }
    }

    const token = makeSessionToken()
    const expiresAt = now + SESSION_DAYS * 24 * 60 * 60 * 1000
    await ctx.db.insert('sessions', {
      token,
      googleId: args.googleId,
      createdAt: now,
      expiresAt,
      lastSeenAt: now,
    })

    return { token, expiresAt, user: mapUser(args) }
  },
})

export const signInWithGoogleAccessToken = action({
  args: { accessToken: v.string() },
  handler: async (ctx, args): Promise<SignInResult> => {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(args.accessToken)}`,
    )
    if (!res.ok) {
      throw new Error('Google sign-in failed. Try again.')
    }

    const payload = (await res.json()) as {
      aud?: string
      azp?: string
      sub?: string
      email?: string
      email_verified?: string | boolean
      name?: string
      picture?: string
      locale?: string
      error?: string
    }

    if (payload.error || !payload.sub || !payload.email) {
      throw new Error('Google could not verify this account.')
    }

    const expectedClientId =
      typeof process !== 'undefined' ? process.env.GOOGLE_CLIENT_ID?.trim() : undefined
    const clientOk =
      !expectedClientId || payload.aud === expectedClientId || payload.azp === expectedClientId
    const verified = payload.email_verified === true || payload.email_verified === 'true'

    if (!clientOk || !verified) {
      throw new Error('Google could not verify this account.')
    }

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${args.accessToken}` },
    })

    const profile = profileRes.ok
      ? ((await profileRes.json()) as { name?: string; picture?: string; locale?: string })
      : {}

    return await ctx.runMutation(internal.auth.upsertFromGoogle, {
      googleId: payload.sub,
      email: payload.email,
      name: profile.name?.trim() || payload.name?.trim() || payload.email.split('@')[0] || 'Guest',
      picture: profile.picture ?? payload.picture ?? null,
      emailVerified: verified,
      locale: profile.locale,
    })
  },
})

export const getSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique()

    if (!session || session.expiresAt < Date.now()) return null

    const user = await ctx.db
      .query('users')
      .withIndex('by_google_id', (q) => q.eq('googleId', session.googleId))
      .unique()

    if (!user) return null

    return {
      token: session.token,
      expiresAt: session.expiresAt,
      user: mapUser(user),
    }
  },
})

export const touchSession = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique()

    if (!session || session.expiresAt < Date.now()) {
      return { ok: false as const }
    }

    await ctx.db.patch(session._id, { lastSeenAt: Date.now() })
    return { ok: true as const }
  },
})

export const revokeSession = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('sessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique()
    if (session) await ctx.db.delete(session._id)
    return { ok: true as const }
  },
})
