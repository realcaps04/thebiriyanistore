import { useAction } from 'convex/react'
import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { api } from '../convex/_generated/api'
import { isLoggedIn, saveAuthSession } from './config/auth'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { SplashPage } from './pages/SplashPage'

function WelcomeRoute() {
  const navigate = useNavigate()
  const signIn = useAction(api.auth.signInWithGoogleAccessToken)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  if (isLoggedIn()) {
    return <Navigate to="/home" replace />
  }

  const handleLoginSuccess = async (accessToken: string) => {
    setLoginError(null)
    setSyncing(true)
    try {
      const result = await signIn({ accessToken })
      saveAuthSession(result.token, result.user)
      navigate('/home', { replace: true })
    } catch {
      setLoginError('Could not save your account. Check your connection and try again.')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <>
      <SplashPage onLoginSuccess={handleLoginSuccess} loading={syncing} />
      {loginError && (
        <div className="login-popup-backdrop" role="presentation" onClick={() => setLoginError(null)}>
          <div
            className="login-popup"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sync-popup-title"
            aria-describedby="sync-popup-message"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="sync-popup-title" className="login-popup-title">
              Sign-in incomplete
            </h3>
            <p id="sync-popup-message" className="login-popup-message">
              {loginError}
            </p>
            <button type="button" className="login-popup-btn" onClick={() => setLoginError(null)}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function HomeRoute() {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />
  }

  return <HomePage />
}

function ProductRoute() {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />
  }

  return <ProductPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeRoute />} />
      <Route path="/home" element={<HomeRoute />} />
      <Route path="/product/:id" element={<ProductRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
