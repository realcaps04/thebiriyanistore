const FALLBACK_CONVEX_URL = 'https://graceful-jay-80.convex.cloud'

const envConvexUrl = import.meta.env.VITE_CONVEX_URL
export const CONVEX_URL =
  typeof envConvexUrl === 'string' && envConvexUrl.trim().length > 0
    ? envConvexUrl.trim()
    : FALLBACK_CONVEX_URL

export const hasConvexUrl = CONVEX_URL.length > 0
