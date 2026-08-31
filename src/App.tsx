import { useState } from 'react'
import { AUTH_STORAGE_KEY, isLoggedIn } from './config/auth'
import { HomePage } from './pages/HomePage'
import { SplashPage } from './pages/SplashPage'

export default function App() {
  const [entered, setEntered] = useState(isLoggedIn)

  const handleLoginSuccess = (accessToken: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, accessToken)
    setEntered(true)
  }

  if (!entered) {
    return <SplashPage onLoginSuccess={handleLoginSuccess} />
  }

  return <HomePage />
}
