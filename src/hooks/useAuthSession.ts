import { useQuery } from 'convex/react'
import { useEffect } from 'react'
import { api } from '../../convex/_generated/api'
import { clearAuth, getAuthToken, type StoredUser } from '../config/auth'

export function useAuthSession() {
  const token = getAuthToken()
  const session = useQuery(api.auth.getSession, token ? { token } : 'skip')

  useEffect(() => {
    if (token && session === null) {
      clearAuth()
    }
  }, [token, session])

  return {
    token: session ? token : null,
    user: (session?.user ?? null) as StoredUser | null,
    isLoading: Boolean(token) && session === undefined,
    isAuthenticated: Boolean(session),
  }
}
