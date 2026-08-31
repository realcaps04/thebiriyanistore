import { Download, RefreshCw, Smartphone, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { registerSW } from 'virtual:pwa-register'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const INSTALL_DISMISS_KEY = 'tbs_pwa_install_dismissed'

function isMobileDevice() {
  return (
    window.matchMedia('(max-width: 768px)').matches ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  )
}

function isStandaloneApp() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIosSafari() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function PwaPrompts() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [showUpdate, setShowUpdate] = useState(false)
  const updateSWRef = useRef<(reload?: boolean) => Promise<void>>(() => Promise.resolve())

  useEffect(() => {
    try {
      updateSWRef.current = registerSW({
        onNeedRefresh() {
          setShowUpdate(true)
        },
      })
    } catch {
      // Service worker unavailable in this environment.
    }
  }, [])

  useEffect(() => {
    if (!isMobileDevice() || isStandaloneApp()) return
    if (sessionStorage.getItem(INSTALL_DISMISS_KEY) === '1') return

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    if (isIosSafari()) {
      setShowInstall(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  const dismissInstall = () => {
    sessionStorage.setItem(INSTALL_DISMISS_KEY, '1')
    setShowInstall(false)
  }

  const handleInstall = async () => {
    if (!installEvent) return

    await installEvent.prompt()
    const choice = await installEvent.userChoice
    if (choice.outcome === 'accepted') {
      setShowInstall(false)
    }
    setInstallEvent(null)
  }

  const handleRefresh = async () => {
    await updateSWRef.current(true)
    setShowUpdate(false)
  }

  return (
    <>
      {showInstall && (
        <div className="pwa-banner" role="region" aria-label="Install app">
          <div className="pwa-banner-content">
            <Smartphone size={20} className="pwa-banner-icon" aria-hidden />
            <div className="pwa-banner-copy">
              <p className="pwa-banner-title">Install as app</p>
              <p className="pwa-banner-text">
                {installEvent
                  ? 'Add The Biriyani Store to your home screen for quick access.'
                  : 'Tap Share, then choose Add to Home Screen to install the app.'}
              </p>
            </div>
          </div>
          <div className="pwa-banner-actions">
            {installEvent ? (
              <button type="button" className="pwa-banner-btn pwa-banner-btn--primary" onClick={handleInstall}>
                <Download size={16} aria-hidden />
                Install
              </button>
            ) : (
              <button type="button" className="pwa-banner-btn pwa-banner-btn--primary" onClick={dismissInstall}>
                Got it
              </button>
            )}
            <button
              type="button"
              className="pwa-banner-btn pwa-banner-btn--ghost"
              onClick={dismissInstall}
              aria-label="Dismiss install prompt"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {showUpdate && (
        <div className="pwa-update-backdrop" role="presentation">
          <div
            className="pwa-update-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="pwa-update-title"
            aria-describedby="pwa-update-message"
          >
            <div className="pwa-update-icon" aria-hidden>
              <RefreshCw size={22} strokeWidth={2.25} />
            </div>
            <h3 id="pwa-update-title" className="pwa-update-title">
              New version available
            </h3>
            <p id="pwa-update-message" className="pwa-update-message">
              We&apos;ve updated The Biriyani Store with improvements. Update now to continue with the latest version.
            </p>
            <div className="pwa-update-actions">
              <button type="button" className="pwa-update-btn pwa-update-btn--primary" onClick={handleRefresh}>
                Update now
              </button>
              <button
                type="button"
                className="pwa-update-btn pwa-update-btn--secondary"
                onClick={() => setShowUpdate(false)}
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
