import type { MutationCtx, QueryCtx } from './_generated/server'

type DbCtx = QueryCtx | MutationCtx

export async function googleIdFromToken(ctx: DbCtx, token: string) {
  const session = await ctx.db
    .query('sessions')
    .withIndex('by_token', (q) => q.eq('token', token))
    .unique()

  if (!session || session.expiresAt < Date.now()) {
    throw new Error('Session expired. Sign in again.')
  }

  return session.googleId
}
