import {
  ChevronRight,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMutation } from 'convex/react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../convex/_generated/api'
import { BottomNav } from '../components/BottomNav'
import { useDeliveryAddresses } from '../components/DeliveryAddressSheet'
import { clearAuth } from '../config/auth'
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

type ProfileRowProps = {
  icon: LucideIcon
  label: string
  hint: string
  onClick?: () => void
}

function ProfileRow({ icon: Icon, label, hint, onClick }: ProfileRowProps) {
  return (
    <button type="button" className="profile-row" onClick={onClick}>
      <span className="profile-row__icon" aria-hidden>
        <Icon size={17} strokeWidth={2} />
      </span>
      <span className="profile-row__body">
        <span className="profile-row__label">{label}</span>
        <span className="profile-row__hint">{hint}</span>
      </span>
      <span className="profile-row__action" aria-hidden>
        <ChevronRight size={14} strokeWidth={2.25} />
      </span>
    </button>
  )
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

  const addressHint =
    addresses.length > 0
      ? `${addresses.length} saved address${addresses.length === 1 ? '' : 'es'}`
      : 'Add home, work & more'

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
        <div className="profile-scroll">
          <section className="profile-identity cart-card">
            <div className="profile-identity__avatar-ring">
              {user?.picture ? (
                <img src={user.picture} alt="" className="profile-identity__avatar" />
              ) : (
                <span className="profile-identity__initials">{initials}</span>
              )}
            </div>

            <span className="profile-identity__tier">Member</span>
            <h1 className="profile-identity__name">{displayName}</h1>
            {email && <p className="profile-identity__email">{email}</p>}

            <div className="profile-identity__stats">
              <div className="profile-identity__stat">
                <span className="profile-identity__stat-value">{orders.length}</span>
                <span className="profile-identity__stat-label">Active orders</span>
              </div>
              <div className="profile-identity__stat-divider" aria-hidden />
              <div className="profile-identity__stat">
                <span className="profile-identity__stat-value">{addresses.length}</span>
                <span className="profile-identity__stat-label">Saved addresses</span>
              </div>
            </div>
          </section>

          <section className="profile-group">
            <h2 className="profile-group__label">Account</h2>
            <div className="profile-list cart-card">
              <ProfileRow
                icon={Package}
                label="My orders"
                hint="Track active and past orders"
                onClick={() => navigate('/home')}
              />
              <ProfileRow
                icon={MapPin}
                label="Delivery addresses"
                hint={addressHint}
                onClick={() => navigate('/cart')}
              />
            </div>
          </section>

          <section className="profile-group">
            <h2 className="profile-group__label">Support</h2>
            <div className="profile-list cart-card">
              <ProfileRow
                icon={HelpCircle}
                label="Help & support"
                hint="FAQs and restaurant contact"
              />
              <ProfileRow
                icon={Settings}
                label="Preferences"
                hint="Notifications and language"
              />
            </div>
          </section>

          <section className="profile-group profile-group--signout">
            <button
              type="button"
              className="profile-signout"
              onClick={() => void handleSignOut()}
            >
              <LogOut size={16} strokeWidth={2} aria-hidden />
              Sign out
            </button>
          </section>

          <footer className="profile-footer">
            <span className="profile-footer__badge">G</span>
            <p className="profile-footer__text">
              Signed in with Google
              <span className="profile-footer__dot" aria-hidden>
                ·
              </span>
              Up to 4 devices
            </p>
          </footer>
        </div>

        <BottomNav active="profile" />
      </main>
    </div>
  )
}
