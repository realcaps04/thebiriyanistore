export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

export const AUTH_STORAGE_KEY = 'tbs_google_token'

export function isLoggedIn() {
  return Boolean(localStorage.getItem(AUTH_STORAGE_KEY))
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
