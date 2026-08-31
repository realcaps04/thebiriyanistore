const FALLBACK_GOOGLE_CLIENT_ID =
  '830409557108-a88kdqif6bt5pvv66k9ao5t7om448ur5.apps.googleusercontent.com'

const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const resolvedClientId =
  typeof envClientId === 'string' && envClientId.trim().length > 0
    ? envClientId.trim()
    : FALLBACK_GOOGLE_CLIENT_ID

export const GOOGLE_CLIENT_ID = resolvedClientId

export const hasGoogleClientId = GOOGLE_CLIENT_ID.length > 0

export const AUTH_STORAGE_KEY = 'tbs_session_token'
export const USER_STORAGE_KEY = 'tbs_user'

export type StoredUser = {
  id: string
  email: string
  name: string
  picture: string | null
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

export function saveAuthSession(token: string, user: StoredUser) {
  localStorage.setItem(AUTH_STORAGE_KEY, token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem(AUTH_STORAGE_KEY))
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEY)
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
}
