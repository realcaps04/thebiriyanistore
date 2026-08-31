import { useGoogleLogin } from '@react-oauth/google'
import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { BrandLockup } from '../components/BrandLockup'

type SplashPageProps = {
  onLoginSuccess: (accessToken: string) => void
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

type SplashPageViewProps = {
  loading: boolean
  error: string | null
  onLogin: () => void
  onDismissError: () => void
}

function SplashPageView({ loading, error, onLogin, onDismissError }: SplashPageViewProps) {
  return (
    <div className="shell shell--welcome">
      <main className="device welcome-page">
        <section className="welcome-top">
          <BrandLockup />
        </section>

        <svg className="welcome-curve" viewBox="0 0 430 48" preserveAspectRatio="none" aria-hidden>
          <path d="M0 48 C120 8 310 8 430 48 L430 48 L0 48 Z" fill="#dce4d3" />
        </svg>

        <section className="welcome-bottom">
          <button type="button" className="google-btn" onClick={onLogin} disabled={loading}>
            <GoogleIcon />
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p className="secure-badge">
            <ShieldCheck size={16} strokeWidth={2.25} />
            Secure &amp; Private
          </p>
        </section>

        {error && (
          <div className="login-popup-backdrop" role="presentation" onClick={onDismissError}>
            <div
              className="login-popup"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="login-popup-title"
              aria-describedby="login-popup-message"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 id="login-popup-title" className="login-popup-title">
                Sign-in failed
              </h3>
              <p id="login-popup-message" className="login-popup-message">
                {error}
              </p>
              <button type="button" className="login-popup-btn" onClick={onDismissError}>
                OK
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function SplashPageWithGoogle({ onLoginSuccess }: SplashPageProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setLoading(false)
      setError(null)
      const token = tokenResponse.access_token
      if (!token) {
        setError('Google sign-in completed but no token was returned. Please try again.')
        return
      }
      onLoginSuccess(token)
    },
    onError: () => {
      setLoading(false)
      setError('Google sign-in was cancelled or failed. Please try again.')
    },
    onNonOAuthError: () => {
      setLoading(false)
      setError('Could not open Google sign-in. Check your connection and try again.')
    },
  })

  const handleGoogleLogin = () => {
    setError(null)
    setLoading(true)
    googleLogin()
  }

  return (
    <SplashPageView
      loading={loading}
      error={error}
      onLogin={handleGoogleLogin}
      onDismissError={() => setError(null)}
    />
  )
}

export function SplashPage(props: SplashPageProps) {
  return <SplashPageWithGoogle {...props} />
}
