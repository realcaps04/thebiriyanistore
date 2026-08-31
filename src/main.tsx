import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { PwaPrompts } from './components/PwaPrompts.tsx'
import { GOOGLE_CLIENT_ID } from './config/auth.ts'
import { CONVEX_URL } from './config/convex.ts'
import './index.css'

const convex = new ConvexReactClient(CONVEX_URL)

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
    <ConvexProvider client={convex}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AppShell>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppShell>
      </GoogleOAuthProvider>
    </ConvexProvider>
  </StrictMode>,
)
