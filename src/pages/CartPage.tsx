import { ArrowLeft, ChevronRight, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  getCartSummary,
  lineItemTotal,
  removeCartItem,
  type CartLineItem,
} from '../config/cart'

export function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartLineItem[]>([])
  const [total, setTotal] = useState(0)

  const refresh = () => {
    const summary = getCartSummary()
    setItems(summary.items)
    setTotal(summary.total)
  }

  useEffect(() => {
    refresh()
    window.addEventListener('cart-updated', refresh)
    return () => window.removeEventListener('cart-updated', refresh)
  }, [])

  if (items.length === 0) {
    return <Navigate to="/home" replace />
  }

  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="shell">
      <main className="device cart-page">
        <header className="product-header">
          <button
            type="button"
            className="product-header__btn"
            aria-label="Go back"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="cart-page__title">Your Cart</h1>
          <span className="cart-page__header-spacer" aria-hidden />
        </header>

        <div className="cart-scroll">
          {items.map((line) => (
            <article key={line.id} className="cart-line">
              <div className="cart-line__image-wrap">
                <img src={line.image} alt="" className="cart-line__image" />
              </div>
              <div className="cart-line__body">
                <h2 className="cart-line__name">{line.name}</h2>
                {line.addons.length > 0 && (
                  <p className="cart-line__addons">
                    {line.addons.map((addon) => addon.name).join(', ')}
                  </p>
                )}
                {line.specialInstructions && (
                  <p className="cart-line__note">Note: {line.specialInstructions}</p>
                )}
                <p className="cart-line__price">₹{lineItemTotal(line).toFixed(2)}</p>
              </div>
              <button
                type="button"
                className="cart-line__remove"
                aria-label={`Remove ${line.name}`}
                onClick={() => removeCartItem(line.id)}
              >
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>

        <button type="button" className="product-cart-bar cart-page__bar" onClick={() => navigate('/home')}>
          <div className="product-cart-bar__text">
            <p className="product-cart-bar__count">
              {String(count).padStart(2, '0')} Items selected
            </p>
            <p className="product-cart-bar__summary">Review and continue ordering</p>
          </div>
          <span className="product-cart-bar__cta">
            <span>₹{total.toFixed(2)}</span>
            <ChevronRight size={18} aria-hidden />
          </span>
        </button>
      </main>
    </div>
  )
}
