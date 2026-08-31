import {
  ChevronRight,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  Settings,
  Sparkles,
} from 'lucide-react'
import { useMutation } from 'convex/react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../convex/_generated/api'
import { BottomNav } from '../components/BottomNav'
import { useDeliveryAddresses } from '../components/DeliveryAddressSheet'
import { clearAuth } from '../config/auth'
import { store } from '../data/home'
import { useAuthSession } from '../hooks/useAuthSession'
import { useOrdersSync } from '../hooks/useCartSync'

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, token } = useAuthSession()
  const orders = useOrdersSync() ?? []
  const { addresses } = useDeliveryAddresses(token, user?.name ?? 'Guest')
  const revokeSession = useMutation(api.auth.revokeSession)

  const displayName = user?.name ?? 'Guest'
  const email = user?.email ?? ''
  const initials = getInitials(displayName) || 'TB'

  const handleSignOut = async () => {
    if (token) {
      await revokeSession({ token })
    }
    clearAuth()
    navigate('/', { replace: true })
  }

  return (
    <div className="shell">
      <main className="device profile-page">
        <header className="profile-header">
          <h1 className="profile-header__title">Profile</h1>
        </header>

        <div className="profile-scroll">
          <section className="profile-hero cart-card">
            <div className="profile-hero__avatar-wrap">
              {user?.picture ? (
                <img src={user.picture} alt="" className="profile-hero__avatar" />
              ) : (
                <span className="profile-hero__initials">{initials}</span>
              )}
              <span className="profile-hero__badge">
                <Sparkles size={11} aria-hidden />
                Member
              </span>
            </div>
            <div className="profile-hero__body">
              <h2 className="profile-hero__name">{displayName}</h2>
              {email && <p className="profile-hero__email">{email}</p>}
              <p className="profile-hero__store">{store.name} · {store.location}</p>
            </div>
          </section>

          <div className="profile-stats">
            <div className="profile-stat cart-card">
              <span className="profile-stat__value">{String(orders.length).padStart(2, '0')}</span>
              <span className="profile-stat__label">Active orders</span>
            </div>
            <div className="profile-stat cart-card">
              <span className="profile-stat__value">{String(addresses.length).padStart(2, '0')}</span>
              <span className="profile-stat__label">Saved addresses</span>
            </div>
          </div>

          <section className="profile-section">
            <h2 className="profile-section__title">Account</h2>
            <div className="profile-menu cart-card">
              <button
                type="button"
                className="profile-menu__item"
                onClick={() => navigate('/home')}
              >
                <span className="profile-menu__icon profile-menu__icon--orders">
                  <Package size={17} aria-hidden />
                </span>
                <span className="profile-menu__text">
                  <span className="profile-menu__label">My orders</span>
                  <span className="profile-menu__hint">Track active & past orders</span>
                </span>
                <ChevronRight size={16} className="profile-menu__chevron" aria-hidden />
              </button>
              <button
                type="button"
                className="profile-menu__item"
                onClick={() => navigate('/cart')}
              >
                <span className="profile-menu__icon profile-menu__icon--address">
                  <MapPin size={17} aria-hidden />
                </span>
                <span className="profile-menu__text">
                  <span className="profile-menu__label">Delivery addresses</span>
                  <span className="profile-menu__hint">
                    {addresses.length > 0
                      ? `${addresses.length} saved address${addresses.length === 1 ? '' : 'es'}`
                      : 'Add home, work & more'}
                  </span>
                </span>
                <ChevronRight size={16} className="profile-menu__chevron" aria-hidden />
              </button>
            </div>
          </section>

          <section className="profile-section">
            <h2 className="profile-section__title">Support</h2>
            <div className="profile-menu cart-card">
              <button type="button" className="profile-menu__item">
                <span className="profile-menu__icon profile-menu__icon--help">
                  <HelpCircle size={17} aria-hidden />
                </span>
                <span className="profile-menu__text">
                  <span className="profile-menu__label">Help & support</span>
                  <span className="profile-menu__hint">FAQs and restaurant contact</span>
                </span>
                <ChevronRight size={16} className="profile-menu__chevron" aria-hidden />
              </button>
              <button type="button" className="profile-menu__item">
                <span className="profile-menu__icon profile-menu__icon--settings">
                  <Settings size={17} aria-hidden />
                </span>
                <span className="profile-menu__text">
                  <span className="profile-menu__label">Preferences</span>
                  <span className="profile-menu__hint">Notifications & language</span>
                </span>
                <ChevronRight size={16} className="profile-menu__chevron" aria-hidden />
              </button>
            </div>
          </section>

          <button type="button" className="profile-signout" onClick={() => void handleSignOut()}>
            <LogOut size={18} aria-hidden />
            Sign out
          </button>

          <p className="profile-footer">Signed in with Google · Up to 4 devices</p>
        </div>

        <BottomNav active="profile" />
      </main>
    </div>
  )
}
