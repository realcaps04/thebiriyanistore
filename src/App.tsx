import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AUTH_STORAGE_KEY, isLoggedIn } from './config/auth'
import { HomePage } from './pages/HomePage'
import { SplashPage } from './pages/SplashPage'

function WelcomeRoute() {
  const navigate = useNavigate()

  if (isLoggedIn()) {
    return <Navigate to="/home" replace />
  }

  const handleLoginSuccess = (accessToken: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, accessToken)
    navigate('/home', { replace: true })
  }

  return <SplashPage onLoginSuccess={handleLoginSuccess} />
}

function HomeRoute() {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />
  }

  return <HomePage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeRoute />} />
      <Route path="/home" element={<HomeRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
