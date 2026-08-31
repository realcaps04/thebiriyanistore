import {
  ArrowLeft,
  ChevronRight,
  Download,
  HandCoins,
  MapPin,
  Clock,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  Utensils,
  Users,
} from 'lucide-react'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import {
  DeliveryAddressSheet,
  formatAddressLine,
  isAddressFormValid,
  useDeliveryAddresses,
} from '../components/DeliveryAddressSheet'
import { getMenuItemById } from '../data/menu'
import { orderTotals } from '../config/cart'
import { store } from '../data/home'
import { useAuthSession } from '../hooks/useAuthSession'
import { useCartSync } from '../hooks/useCartSync'

type OrderType = 'dine-in' | 'takeaway' | 'delivery'

function Price({
  amount,
  className = '',
  integer = false,
}: {
  amount: number
  className?: string
  integer?: boolean
}) {
  return (
    <span className={`cart-price ${className}`.trim()}>
      ₹{integer ? Math.round(amount).toString() : amount.toFixed(2)}
    </span>
  )
}

function createOrderId() {
  return `#${Math.floor(10000 + Math.random() * 89999)}`
}

function getOrderInfo(orderType: OrderType) {
  switch (orderType) {
    case 'takeaway':
      return {
        title: 'Takeaway',
        subtitle: `Pickup · ${store.location}`,
        SubtitleIcon: Clock,
        actionLabel: 'Change pickup',
      }
    case 'delivery':
      return {
        title: 'Home Delivery',
        subtitle: 'Add a delivery address',
        SubtitleIcon: MapPin,
        actionLabel: 'Add address',
      }
    default:
      return {
        title: 'Table 12',
        subtitle: '04 persons',
        SubtitleIcon: Users,
        actionLabel: 'Change table',
      }
  }
}

export function CartPage() {
  const navigate = useNavigate()
  const { user, token } = useAuthSession()
  const { items, count, lineItemTotal, removeItem, clearCart, isLoading } = useCartSync()
  const placeOrder = useMutation(api.orders.placeOrder)
  const [orderType, setOrderType] = useState<OrderType>('dine-in')
  const [orderId] = useState(createOrderId)
  const [submitting, setSubmitting] = useState(false)
  const [addressSheetOpen, setAddressSheetOpen] = useState(false)
  const [addressSheetMode, setAddressSheetMode] = useState<'pick' | 'add'>('pick')
  const [savingAddress, setSavingAddress] = useState(false)
  const [addressLabelError, setAddressLabelError] = useState<string | null>(null)

  const customerName = user?.name ?? 'Guest'
  const {
    addresses,
    selectedAddress,
    selectedId,
    selectAddress,
    saveAddress,
    emptyForm,
  } = useDeliveryAddresses(token, customerName)
  const [addressForm, setAddressForm] = useState(() => emptyForm())

  if (!isLoading && items.length === 0) {
    return <Navigate to="/home" replace />
  }

  const { subtotal, total: grandTotal } = orderTotals(
    items.reduce((sum, item) => sum + lineItemTotal(item), 0),
  )
  const orderInfo = getOrderInfo(orderType)
  const SubtitleIcon = orderInfo.SubtitleIcon
  const deliveryNeedsAddress = orderType === 'delivery' && !selectedAddress

  const openAddressSheet = (mode: 'pick' | 'add' = 'pick') => {
    setAddressLabelError(null)
    if (mode === 'add') {
      setAddressForm(emptyForm())
    }
    setAddressSheetMode(mode)
    setAddressSheetOpen(true)
  }

  const handleSaveAddress = async () => {
    if (!isAddressFormValid(addressForm) || savingAddress) return

    setSavingAddress(true)
    setAddressLabelError(null)
    try {
      await saveAddress(addressForm)
      setAddressSheetOpen(false)
      setAddressSheetMode('pick')
    } catch (error) {
      setAddressLabelError(
        error instanceof Error ? error.message : 'Could not save this address.',
      )
    } finally {
      setSavingAddress(false)
    }
  }

  const handleCheckout = async () => {
    if (!token || submitting || deliveryNeedsAddress) return

    setSubmitting(true)
    try {
      await placeOrder({
        token,
        displayOrderId: orderId,
        orderType,
        tableNumber: '12',
        guestCount: 4,
        customerName,
        deliveryAddressId:
          orderType === 'delivery' && selectedId
            ? (selectedId as Id<'deliveryAddresses'>)
            : undefined,
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
              <div className="cart-info__primary">
                {orderType === 'delivery' ? (
                  selectedAddress ? (
                    <>
                      <p className="cart-info__table">{selectedAddress.label}</p>
                      <p className="cart-info__persons">
                        <MapPin size={13} aria-hidden />
                        <span className="cart-info__persons-text--address">
                          {formatAddressLine(selectedAddress)}
                        </span>
                      </p>
                      <p className="cart-info__phone">
                        <Phone size={13} aria-hidden />
                        {selectedAddress.phone}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="cart-info__table">Home Delivery</p>
                      <p className="cart-info__persons">
                        <MapPin size={13} aria-hidden />
                        <span>Add your delivery address and contact number</span>
                      </p>
                    </>
                  )
                ) : (
                  <>
                    <p className="cart-info__table">{orderInfo.title}</p>
                    <p className="cart-info__persons">
                      <SubtitleIcon size={13} aria-hidden />
                      <span>{orderInfo.subtitle}</span>
                    </p>
                  </>
                )}
              </div>
              {orderType === 'delivery' ? (
                selectedAddress ? (
                  <button
                    type="button"
                    className="cart-link-btn"
                    onClick={() => openAddressSheet('pick')}
                  >
                    Change address
                    <ChevronRight size={14} aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="cart-link-btn cart-link-btn--primary"
                    onClick={() => openAddressSheet('add')}
                  >
                    <Plus size={14} aria-hidden />
                    Add address
                  </button>
                )
              ) : (
                <button type="button" className="cart-link-btn">
                  {orderInfo.actionLabel}
                  <ChevronRight size={14} aria-hidden />
                </button>
              )}
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
                const specialNote = line.specialInstructions.trim()
                const showMenuDesc = line.addons.length === 0 && menuItem?.desc

                return (
                  <article key={line.id} className="cart-menu-item">
                    <div className="cart-menu-item__thumb-wrap">
                      <img src={line.image} alt="" className="cart-menu-item__thumb" />
                      <span className="cart-menu-item__qty">x{line.quantity}</span>
                    </div>
                    <div className="cart-menu-item__body">
                      <h3 className="cart-menu-item__name">{line.name}</h3>
                      {showMenuDesc && (
                        <p className="cart-menu-item__desc">{menuItem.desc}</p>
                      )}
                      {line.addons.length > 0 && (
                        <ul className="cart-menu-item__addons">
                          {line.addons.map((addon) => (
                            <li key={addon.id}>{addon.name}</li>
                          ))}
                        </ul>
                      )}
                      {specialNote && (
                        <p className="cart-menu-item__note">Note: {specialNote}</p>
                      )}
                    </div>
                    <div className="cart-menu-item__actions">
                      <Price amount={lineItemTotal(line)} className="cart-menu-item__price" />
                      <button
                        type="button"
                        className="cart-menu-item__remove"
                        aria-label={`Remove ${line.name}`}
                        onClick={() => void removeItem(line.id)}
                      >
                        <Trash2 size={15} aria-hidden />
                      </button>
                    </div>
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
            <div className="cart-summary-row cart-summary-row--total">
              <span>Total amount</span>
              <Price amount={grandTotal} className="cart-price--lg" integer />
            </div>
          </section>
        </div>

        <button
          type="button"
          className="cart-checkout-btn"
          onClick={handleCheckout}
          disabled={submitting || !token || deliveryNeedsAddress}
        >
          <HandCoins size={18} aria-hidden />
          <span>
            {submitting
              ? 'Processing…'
              : deliveryNeedsAddress
                ? 'Add delivery address'
                : 'Process Payout'}
          </span>
        </button>

        <DeliveryAddressSheet
          open={addressSheetOpen}
          mode={addressSheetMode}
          addresses={addresses}
          selectedId={selectedId}
          form={addressForm}
          saving={savingAddress}
          labelError={addressLabelError}
          onClose={() => setAddressSheetOpen(false)}
          onSwitchToAdd={() => {
            setAddressLabelError(null)
            setAddressForm(emptyForm())
            setAddressSheetMode('add')
          }}
          onSelect={selectAddress}
          onFormChange={(form) => {
            setAddressLabelError(null)
            setAddressForm(form)
          }}
          onSave={() => void handleSaveAddress()}
        />
      </main>
    </div>
  )
}
