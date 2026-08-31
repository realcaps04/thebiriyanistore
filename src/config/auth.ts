export const GOOGLE_CLIENT_ID = (
  import.meta.env.VITE_GOOGLE_CLIENT_ID ??
  '830409557108-a88kdqif6bt5pvv66k9ao5t7om448ur5.apps.googleusercontent.com'
).trim()

export const hasGoogleClientId = GOOGLE_CLIENT_ID.length > 0

export const AUTH_STORAGE_KEY = 'tbs_google_token'

export function isLoggedIn() {
  return Boolean(localStorage.getItem(AUTH_STORAGE_KEY))
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
