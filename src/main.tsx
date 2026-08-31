import { GoogleOAuthProvider } from '@react-oauth/google'
import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { PwaPrompts } from './components/PwaPrompts.tsx'
import { GOOGLE_CLIENT_ID, hasGoogleClientId } from './config/auth.ts'
import './index.css'

function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <PwaPrompts />
    </>
  )
}

const app = hasGoogleClientId ? (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AppShell>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppShell>
  </GoogleOAuthProvider>
) : (
  <AppShell>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppShell>
)

createRoot(document.getElementById('root')!).render(<StrictMode>{app}</StrictMode>)
