import {
  ClipboardList,
  Home,
  ScanLine,
  Store,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export type NavTab = 'home' | 'combo' | 'orders' | 'profile'

type BottomNavProps = {
  active: NavTab
}

export function BottomNav({ active }: BottomNavProps) {
  const navigate = useNavigate()
  const [comboComingSoonOpen, setComboComingSoonOpen] = useState(false)

  return (
    <>
      <nav className="bottom-nav" aria-label="Main navigation">
        <button
          type="button"
          className={`nav-item ${active === 'home' ? 'nav-item--active' : ''}`}
          aria-current={active === 'home' ? 'page' : undefined}
          onClick={() => navigate('/home')}
        >
          <Home size={20} strokeWidth={active === 'home' ? 2.25 : 2} />
          <span>Home</span>
        </button>
        <button
          type="button"
          className={`nav-item ${active === 'combo' ? 'nav-item--active' : ''}`}
          onClick={() => setComboComingSoonOpen(true)}
        >
          <Store size={20} strokeWidth={2} />
          <span>Combo</span>
        </button>
        <button type="button" className="nav-scan" aria-label="Quick order">
          <ScanLine size={22} strokeWidth={2.25} />
        </button>
        <button
          type="button"
          className={`nav-item ${active === 'orders' ? 'nav-item--active' : ''}`}
          onClick={() => navigate('/home')}
        >
          <ClipboardList size={20} strokeWidth={2} />
          <span>Orders</span>
        </button>
        <button
          type="button"
          className={`nav-item ${active === 'profile' ? 'nav-item--active' : ''}`}
          aria-current={active === 'profile' ? 'page' : undefined}
          onClick={() => navigate('/profile')}
        >
          <User size={20} strokeWidth={active === 'profile' ? 2.25 : 2} />
          <span>Profile</span>
        </button>
      </nav>

      {comboComingSoonOpen && (
        <div
          className="login-popup-backdrop"
          role="presentation"
          onClick={() => setComboComingSoonOpen(false)}
        >
          <div
            className="login-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="combo-popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="combo-popup-title" className="login-popup-title">
              Combo meals
            </h3>
            <p className="login-popup-message">Coming soon — curated biriyani combos.</p>
            <button
              type="button"
              className="login-popup-btn"
              onClick={() => setComboComingSoonOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  )
}
