import { Clock, MapPin, ShoppingBag, Table2 } from 'lucide-react'

export type OrderListItem = {
  id: string
  status: string
  orderType?: 'dine-in' | 'takeaway' | 'delivery'
  items: string[]
  itemCount: number
  price: number
  time: string
  table: string
}

function orderStatusClass(status: string) {
  const label = status.toLowerCase()
  if (label.includes('deliver')) return 'order-card__status--delivered'
  if (label.includes('ready')) return 'order-card__status--ready'
  if (label.includes('cancel')) return 'order-card__status--cancelled'
  return 'order-card__status--active'
}

function OrderPrice({ amount }: { amount: number }) {
  const [whole, dec] = amount.toFixed(2).split('.')

  return (
    <p className="order-card__price" aria-label={`₹${amount.toFixed(2)}`}>
      <span className="order-card__price-symbol">₹</span>
      {whole}
      <span className="order-card__price-dec">.{dec}</span>
    </p>
  )
}

export function OrderListCard({ order }: { order: OrderListItem }) {
  const thumbs = order.items.slice(0, 2)
  const itemLabel = `${order.itemCount} Item${order.itemCount === 1 ? '' : 's'}`
  const LocationIcon =
    order.orderType === 'delivery'
      ? MapPin
      : order.orderType === 'takeaway'
        ? ShoppingBag
        : Table2

  return (
    <article className="order-card">
      <div className="order-card__body">
        <div className="order-card__head">
          <p className="order-card__id">Order {order.id}</p>
          <span className={`order-card__status ${orderStatusClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="order-card__main">
          <div className="order-card__items">
            {thumbs.length > 0 && (
              <div className="order-card__thumbs" aria-hidden>
                {thumbs.map((src, index) => (
                  <div key={`${src}-${index}`} className="order-card__thumb">
                    <img src={src} alt="" />
                  </div>
                ))}
              </div>
            )}
            <span className="order-card__count">{itemLabel}</span>
          </div>
          <OrderPrice amount={order.price} />
        </div>
      </div>

      <div className="order-card__foot">
        <span className="order-card__meta">
          <Clock size={13} strokeWidth={2.25} aria-hidden />
          {order.time}
        </span>
        <span className="order-card__meta">
          <LocationIcon size={13} strokeWidth={2.25} aria-hidden />
          {order.table}
        </span>
      </div>
    </article>
  )
}
