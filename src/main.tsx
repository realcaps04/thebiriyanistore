import { GoogleOAuthProvider } from '@react-oauth/google'
import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { PwaPrompts } from './components/PwaPrompts.tsx'
import { GOOGLE_CLIENT_ID } from './config/auth.ts'
import './index.css'

function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <PwaPrompts />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppShell>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppShell>
    </GoogleOAuthProvider>
  </StrictMode>,
)
