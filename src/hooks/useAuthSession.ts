import { useMutation, useQuery } from 'convex/react'
import { useEffect, useRef } from 'react'
import { api } from '../../convex/_generated/api'
import { clearAuth, getAuthToken, type StoredUser } from '../config/auth'

export function useAuthSession() {
  const token = getAuthToken()
  const session = useQuery(api.auth.getSession, token ? { token } : 'skip')
  const touchSession = useMutation(api.auth.touchSession)
  const touchedRef = useRef(false)

  useEffect(() => {
    if (token && session === null) {
      clearAuth()
    }
  }, [token, session])

  useEffect(() => {
    if (!token || !session || touchedRef.current) return
    touchedRef.current = true
    void touchSession({ token })
  }, [token, session, touchSession])

  return {
    token: session ? token : null,
    user: (session?.user ?? null) as StoredUser | null,
    isLoading: Boolean(token) && session === undefined,
    isAuthenticated: Boolean(session),
  }
}
