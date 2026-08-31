import {
  Bell,
  ChevronRight,
  Home,
  MapPin,
  Menu,
  ScanLine,
  Search,
  SlidersHorizontal,
  Store,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { activeOrders, categories as categoryData, products, store } from '../data/home'

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState('chicken')
  const cartCount = 1
  const cartTotal = 439.17

  const activeLabel =
    categoryData.find((c) => c.id === activeCategory)?.label ?? 'Chicken'

  return (
    <div className="shell">
      <main className="device home-page">
        {/* Header */}
        <header className="home-header">
          <div className="flex items-center gap-3 min-w-0">
            <div className="store-logo">
              <img src="/brand/logo.png" alt="" className="w-full h-full object-contain p-1" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-ink leading-tight truncate">{store.name}</h1>
              <button className="flex items-center gap-1 text-[11.2px] text-muted mt-0.5 max-w-full">
                <MapPin size={12} className="shrink-0 text-brand" />
                <span className="truncate">{store.locationDetail}</span>
                <ChevronRight size={12} className="shrink-0 rotate-90" />
              </button>
            </div>
          </div>
          <button type="button" className="icon-btn" aria-label="Notifications">
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
          {/* Orders */}
          <section>
            <h2 className="section-title">Order&apos;s List</h2>
            <div className="orders-row scrollbar-hide">
              {activeOrders.map((order) => (
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

          {/* Categories */}
          <section className="mt-6">
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
                      {cat.icon}
                    </span>
                    <span className="text-xs font-semibold">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Products */}
          <section className="mt-6 pb-36">
            <h2 className="section-title">All {activeLabel}&apos;s</h2>
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
      </main>
    </div>
  )
}
