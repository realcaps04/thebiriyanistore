import {
  Bell,
  ChevronRight,
  Home,
  Menu,
  ScanLine,
  Search,
  SlidersHorizontal,
  Store,
  User,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { getActiveOrders, type ActiveOrder } from '../config/orders'
import { bestSellers, categories as categoryData, products, store } from '../data/home'

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState('biryanis')
  const [mapOpen, setMapOpen] = useState(false)
  const [orders, setOrders] = useState<ActiveOrder[]>([])
  const cartCount = 0
  const cartTotal = 0

  useEffect(() => {
    setOrders(getActiveOrders())
  }, [])

  const [bestSellerIndex, setBestSellerIndex] = useState(0)

  useEffect(() => {
    if (bestSellers.length <= 1) return
    const timer = window.setInterval(() => {
      setBestSellerIndex((index) => (index + 1) % bestSellers.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [])

  const activeLabel =
    categoryData.find((c) => c.id === activeCategory)?.label ?? 'Biryanis'

  return (
    <div className="shell">
      <main className="device home-page">
        {/* Header */}
        <header className="home-header">
          <div className="home-header__left">
            <div className="store-logo store-logo--sm">
              <img src="/brand/logo.png" alt="" className="w-full h-full object-contain p-0.5" />
            </div>
          </div>
          <div className="home-header__text">
            <h1 className="home-header__title">{store.name}</h1>
            <span className="home-header__location">
              <span className="home-header__sep" aria-hidden>
                ·
              </span>
              <span className="home-header__address">{store.locationDetail}</span>
              <button
                type="button"
                className="home-header__map-btn"
                aria-label="Open in Google Maps"
                onClick={() => setMapOpen(true)}
              >
                <img src="/brand/google-maps.svg" alt="" className="home-header__map-logo" />
              </button>
            </span>
          </div>
          <button type="button" className="icon-btn home-header__notify" aria-label="Notifications">
            <Bell size={20} />
          </button>
        </header>

        {/* Search */}
        <div className="home-search">
          <div className="search-field">
            <Search size={18} className="text-muted shrink-0" />
            <input type="search" placeholder="What are you looking for?" />
          </div>
          <button type="button" className="filter-btn" aria-label="Filters">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="home-scroll">
          {orders.length > 0 && (
            <section>
              <h2 className="section-title">Order&apos;s List</h2>
              <div className="orders-row scrollbar-hide">
                {orders.map((order) => (
                  <article key={order.id} className="order-card">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11.2px] text-muted">Order {order.id}</p>
                        <span className={`inline-block mt-1 text-[9.2px] font-semibold px-2 py-0.5 rounded-full ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-3">
                      {order.items.map((src, i) => (
                        <div key={i} className="order-thumb">
                          <img src={src} alt="" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-end justify-between mt-3">
                      <div>
                        <p className="text-sm font-bold text-ink">₹{order.price}</p>
                        <p className="text-[10px] text-muted">{order.time}</p>
                      </div>
                      <p className="text-[10px] font-medium text-brand bg-brand/10 px-2 py-1 rounded-lg">
                        {order.table}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Best Sellers */}
          <section className={`bestsellers-section ${orders.length > 0 ? 'mt-6' : ''}`}>
            <h2 className="section-title">Best Sellers</h2>
            <div className="bestsellers-carousel" aria-live="polite">
              <div
                className="bestsellers-track"
                style={{ transform: `translateX(-${bestSellerIndex * 100}%)` }}
              >
                {bestSellers.map((item) => (
                  <article key={item.id} className="bestseller-card">
                    <div className="bestseller-card__image">
                      <img src={item.image} alt="" />
                    </div>
                    <div className="bestseller-card__body">
                      <h3 className="bestseller-card__title">{item.name}</h3>
                      <p className="bestseller-card__desc">{item.desc}</p>
                      <div className="bestseller-card__footer">
                        <div>
                          <p className="bestseller-card__price">₹{item.price.toFixed(2)}</p>
                          {item.customizable && (
                            <p className="bestseller-card__custom">Customization available</p>
                          )}
                        </div>
                        <button type="button" className="bestseller-card__add">
                          + Add
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="bestsellers-dots" aria-hidden={bestSellers.length <= 1}>
                {bestSellers.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`bestsellers-dot ${index === bestSellerIndex ? 'bestsellers-dot--active' : ''}`}
                    aria-label={`Show ${item.name}`}
                    aria-current={index === bestSellerIndex ? 'true' : undefined}
                    onClick={() => setBestSellerIndex(index)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="categories-section mt-6">
            <div className="section-header">
              <h2 className="section-title section-title--inline">Search By Categories</h2>
              <button type="button" className="section-view-all">
                View all
                <ChevronRight size={14} strokeWidth={2.25} aria-hidden />
              </button>
            </div>
            <div className="categories-row scrollbar-hide">
              {categoryData.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`category-pill ${isActive ? 'category-pill--active' : ''}`}
                  >
                    <span className={`category-icon ${isActive ? 'category-icon--active' : ''}`}>
                      <img src={cat.image} alt="" className="category-icon__img" />
                    </span>
                    <span className="text-xs font-semibold">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Products */}
          <section className="mt-6 pb-36">
            <h2 className="section-title">All {activeLabel}</h2>
            <div className="product-grid">
              {products.map((item) => (
                <article key={item.id} className="product-card">
                  <div className="product-image-wrap">
                    <img src={item.image} alt={item.name} />
                    {item.isNew && <span className="badge-new">NEW</span>}
                    <span className="badge-off">{item.discount}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-ink leading-snug">{item.name}</h3>
                    <p className="text-[11.2px] text-muted mt-0.5">{item.desc}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-brand">₹{item.price}</span>
                      <span className="text-[10px] text-muted">★ {item.rating}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Cart bar */}
        {cartCount > 0 && (
          <div className="cart-bar">
            <span className="text-sm font-medium">
              {String(cartCount).padStart(2, '0')} Items selected
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">₹{cartTotal.toFixed(2)}</span>
              <ChevronRight size={18} />
            </div>
          </div>
        )}

        {/* Bottom nav — floating pill */}
        <nav className="bottom-nav" aria-label="Main navigation">
          <button type="button" className="nav-item nav-item--active" aria-current="page">
            <Home size={20} strokeWidth={2.25} />
            <span>Home</span>
          </button>
          <button type="button" className="nav-item">
            <Store size={20} strokeWidth={2} />
            <span>Stores</span>
          </button>
          <button type="button" className="nav-scan" aria-label="Quick order">
            <ScanLine size={22} strokeWidth={2.25} />
          </button>
          <button type="button" className="nav-item">
            <Menu size={20} strokeWidth={2} />
            <span>Menu</span>
          </button>
          <button type="button" className="nav-item">
            <User size={20} strokeWidth={2} />
            <span>Profile</span>
          </button>
        </nav>

        {mapOpen && (
          <div
            className="map-popup-backdrop"
            role="presentation"
            onClick={() => setMapOpen(false)}
          >
            <div
              className="map-popup"
              role="dialog"
              aria-modal="true"
              aria-labelledby="map-popup-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="map-popup__head">
                <h2 id="map-popup-title" className="map-popup__title">
                  {store.name}
                </h2>
                <button
                  type="button"
                  className="map-popup__close"
                  aria-label="Close map"
                  onClick={() => setMapOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <p className="map-popup__address">{store.locationDetail}</p>
              <div className="map-popup__frame">
                <iframe
                  src={store.mapEmbedUrl}
                  title={`${store.name} on Google Maps`}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
