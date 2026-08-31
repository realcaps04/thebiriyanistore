import {
  ArrowLeft,
  ChevronRight,
  Download,
  HandCoins,
  ShoppingBag,
  Truck,
  Utensils,
  Users,
} from 'lucide-react'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../../convex/_generated/api'
import { getMenuItemById } from '../data/menu'
import { useAuthSession } from '../hooks/useAuthSession'
import { useCartSync } from '../hooks/useCartSync'

type OrderType = 'dine-in' | 'takeaway' | 'delivery'

function formatPrice(amount: number) {
  const [whole, fraction = '00'] = amount.toFixed(2).split('.')
  return { whole, fraction }
}

function Price({ amount, className = '' }: { amount: number; className?: string }) {
  const { whole, fraction } = formatPrice(amount)
  return (
    <span className={`cart-price ${className}`.trim()}>
      ₹{whole}.<sup>{fraction}</sup>
    </span>
  )
}

function createOrderId() {
  return `#${Math.floor(10000 + Math.random() * 89999)}`
}

export function CartPage() {
  const navigate = useNavigate()
  const { user, token } = useAuthSession()
  const { items, count, lineItemTotal, clearCart, isLoading } = useCartSync()
  const placeOrder = useMutation(api.orders.placeOrder)
  const [orderType, setOrderType] = useState<OrderType>('dine-in')
  const [orderId] = useState(createOrderId)
  const [submitting, setSubmitting] = useState(false)

  if (!isLoading && items.length === 0) {
    return <Navigate to="/home" replace />
  }

  const subtotal = items.reduce((sum, item) => sum + lineItemTotal(item), 0)
  const taxRate = 0.025
  const tax = subtotal * taxRate
  const grandTotal = subtotal + tax
  const customerName = user?.name ?? 'Guest'

  const handleCheckout = async () => {
    if (!token || submitting) return

    setSubmitting(true)
    try {
      await placeOrder({
        token,
        displayOrderId: orderId,
        orderType,
        tableNumber: '12',
        guestCount: 4,
        customerName,
      })
      await clearCart()
      navigate('/home')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="shell">
      <main className="device cart-page">
        <header className="cart-header">
          <button
            type="button"
            className="product-header__btn"
            aria-label="Go back"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="cart-header__title">Payout Details</h1>
          <button type="button" className="product-header__btn" aria-label="Download receipt">
            <Download size={18} />
          </button>
        </header>

        <div className="cart-scroll">
          <div className="cart-mode-tabs" role="tablist" aria-label="Order type">
            {(
              [
                { id: 'dine-in' as const, label: 'Dine in', icon: Utensils },
                { id: 'takeaway' as const, label: 'Take away', icon: ShoppingBag },
                { id: 'delivery' as const, label: 'Delivery', icon: Truck },
              ] as const
            ).map(({ id, label, icon: Icon }) => {
              const active = orderType === id
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`cart-mode-tab ${active ? 'cart-mode-tab--active' : ''}`}
                  onClick={() => setOrderType(id)}
                >
                  <Icon size={15} aria-hidden />
                  <span>{label}</span>
                </button>
              )
            })}
          </div>

          <section className="cart-card cart-card--info">
            <div className="cart-info__top">
              <div>
                <p className="cart-info__table">Table 12</p>
                <p className="cart-info__persons">
                  <Users size={13} aria-hidden />
                  04 persons
                </p>
              </div>
              <button type="button" className="cart-link-btn">
                Change table
                <ChevronRight size={14} aria-hidden />
              </button>
            </div>
            <div className="cart-info__divider" aria-hidden />
            <div className="cart-info__bottom">
              <div>
                <p className="cart-info__label">Customer&apos;s Name</p>
                <p className="cart-info__value">{customerName}</p>
              </div>
              <div className="cart-info__order">
                <p className="cart-info__label">Order ID</p>
                <p className="cart-info__value">{orderId}</p>
              </div>
            </div>
          </section>

          <section className="cart-card">
            <div className="cart-card__head">
              <div className="cart-card__title-wrap">
                <h2 className="cart-card__title">Ordered Menu</h2>
                <span className="cart-badge">{String(count).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="cart-menu-list">
              {items.map((line) => {
                const menuItem = getMenuItemById(line.menuItemId)
                const desc =
                  line.addons.length > 0
                    ? line.addons.map((addon) => addon.name).join(', ')
                    : menuItem?.desc ?? line.specialInstructions
                return (
                  <article key={line.id} className="cart-menu-item">
                    <div className="cart-menu-item__thumb-wrap">
                      <img src={line.image} alt="" className="cart-menu-item__thumb" />
                      <span className="cart-menu-item__qty">x{line.quantity}</span>
                    </div>
                    <div className="cart-menu-item__body">
                      <h3 className="cart-menu-item__name">{line.name}</h3>
                      {desc && <p className="cart-menu-item__desc">{desc}</p>}
                    </div>
                    <Price amount={lineItemTotal(line)} className="cart-menu-item__price" />
                  </article>
                )
              })}
            </div>
          </section>

          <section className="cart-card cart-card--summary">
            <h2 className="cart-card__title">Order Summary</h2>
            <div className="cart-summary-row">
              <span>Total Item ({String(count).padStart(2, '0')})</span>
              <Price amount={subtotal} />
            </div>
            <div className="cart-summary-row">
              <span>Tax (2.5%)</span>
              <Price amount={tax} />
            </div>
            <div className="cart-summary-row cart-summary-row--total">
              <span>Total amount</span>
              <Price amount={grandTotal} className="cart-price--lg" />
            </div>
          </section>
        </div>

        <button
          type="button"
          className="cart-checkout-btn"
          onClick={handleCheckout}
          disabled={submitting || !token}
        >
          <HandCoins size={18} aria-hidden />
          <span>{submitting ? 'Processing…' : 'Process Payout'}</span>
        </button>
      </main>
    </div>
  )
}
