import {
  Bell,
  ChevronRight,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { useCartSync, useOrdersSync } from '../hooks/useCartSync'
import { bestSellers, biryanis, categories as categoryData, drinks, egg, products, store } from '../data/home'

export function HomePage() {
  const navigate = useNavigate()
  const openProduct = (id: string) => navigate(`/product/${id}`)
  const [activeCategory, setActiveCategory] = useState('biryanis')
  const [mapOpen, setMapOpen] = useState(false)
  const { count: cartCount, total: cartTotal } = useCartSync()
  const orders = useOrdersSync() ?? []

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

  const categoryMenus: Record<string, typeof biryanis> = {
    biryanis,
    drinks,
    egg,
  }

  const categoryItems =
    categoryMenus[activeCategory] ?? [
      ...bestSellers.filter((item) => item.categoryId === activeCategory),
      ...products.filter((item) => item.categoryId === activeCategory),
    ]

  const openCart = () => {
    if (cartCount > 0) navigate('/cart')
  }

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
          <button
            type="button"
            className="cart-btn"
            aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
            onClick={openCart}
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="cart-btn__badge" aria-hidden>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
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
                        <p className="text-sm font-bold text-ink">₹{Math.round(order.price)}</p>
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

          {/* Trending */}
          <section className={`bestsellers-section ${orders.length > 0 ? 'mt-6' : ''}`}>
            <h2 className="section-title">Trending</h2>
            <div className="bestsellers-carousel" aria-live="polite">
              <div
                className="bestsellers-track"
                style={{ transform: `translateX(-${bestSellerIndex * 100}%)` }}
              >
                {bestSellers.map((item) => (
                  <article
                    key={item.id}
                    className="bestseller-card bestseller-card--link"
                    role="button"
                    tabIndex={0}
                    onClick={() => openProduct(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openProduct(item.id)
                      }
                    }}
                  >
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
                        <span className="bestseller-card__view" aria-hidden>
                          <ChevronRight size={16} />
                        </span>
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
            <h2 className="section-title">Search By Categories</h2>
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

          {categoryItems.length > 0 && (
            <section className="mt-6">
              <h2 className="section-title">All {activeLabel}</h2>
              <div className="product-grid">
                {categoryItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="product-card product-card--link"
                    onClick={() => openProduct(item.id)}
                  >
                    <div className="product-image-wrap">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-ink leading-snug">{item.name}</h3>
                      <p className="text-[11.2px] text-muted mt-0.5">{item.desc}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-brand">₹{item.price.toFixed(2)}</span>
                        {item.customizable && (
                          <span className="text-[10px] text-muted">Customizable</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Cart bar */}
        {cartCount > 0 && (
          <button type="button" className="cart-bar" onClick={openCart}>
            <span className="text-sm font-medium">
              {String(cartCount).padStart(2, '0')} Items selected
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">₹{Math.round(cartTotal)}</span>
              <ChevronRight size={18} />
            </div>
          </button>
        )}

        <BottomNav active="home" />

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
