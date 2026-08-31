import {
  ArrowLeft,
  ChevronRight,
  Flame,
  Heart,
  Share2,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  getMenuItemById,
  getProductSizes,
  isBestSeller,
  productAddons,
} from '../data/menu'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const item = id ? getMenuItemById(id) : undefined

  const sizes = useMemo(() => (item ? getProductSizes(item) : []), [item])
  const [sizeId, setSizeId] = useState(sizes[0]?.id ?? 'standard')
  const [addons, setAddons] = useState<string[]>([])

  if (!item) {
    return <Navigate to="/home" replace />
  }

  const selectedSize = sizes.find((size) => size.id === sizeId) ?? sizes[0]
  const addonTotal = productAddons
    .filter((addon) => addons.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0)
  const total = (selectedSize?.price ?? item.price) + addonTotal

  const toggleAddon = (addonId: string) => {
    setAddons((current) =>
      current.includes(addonId) ? current.filter((id) => id !== addonId) : [...current, addonId],
    )
  }

  return (
    <div className="shell">
      <main className="device product-page">
        <header className="product-header">
          <button
            type="button"
            className="product-header__btn"
            aria-label="Go back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="product-header__actions">
            <button type="button" className="product-header__btn" aria-label="Save to favorites">
              <Heart size={18} />
            </button>
            <button type="button" className="product-header__btn" aria-label="Share">
              <Share2 size={18} />
            </button>
          </div>
        </header>

        <div className="product-scroll">
          <section className="product-hero">
            <div className="product-hero__panel">
              {isBestSeller(item.id) && (
                <span className="product-hero__badge">
                  <TrendingUp size={14} aria-hidden />
                  Trending
                </span>
              )}
              <h1 className="product-hero__title">{item.name}</h1>
              <p className="product-hero__subtitle">{item.desc}</p>
              <div className="product-hero__meta">
                <span className="product-hero__meta-item">
                  <Star size={14} className="product-hero__star" aria-hidden />
                  4.9 (2.4k)
                </span>
                {item.customizable && (
                  <span className="product-hero__meta-item">
                    <Flame size={14} aria-hidden />
                    Customizable
                  </span>
                )}
              </div>
            </div>
            <div className="product-hero__image-wrap">
              <img src={item.image} alt={item.name} className="product-hero__image" />
            </div>
          </section>

          {sizes.length > 1 && (
            <section className="product-section">
              <h2 className="product-section__title">Select Size</h2>
              <div className="product-size-row scrollbar-hide">
                {sizes.map((size) => {
                  const active = size.id === sizeId
                  return (
                    <button
                      key={size.id}
                      type="button"
                      className={`product-size-card ${active ? 'product-size-card--active' : ''}`}
                      onClick={() => setSizeId(size.id)}
                    >
                      <span className={`product-size-card__radio ${active ? 'product-size-card__radio--active' : ''}`} />
                      <span className="product-size-card__label">{size.label}</span>
                      <span className="product-size-card__detail">{size.detail}</span>
                      <span className="product-size-card__price">₹{size.price.toFixed(2)}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {item.customizable && (
            <section className="product-section">
              <h2 className="product-section__title">Add Ingredients</h2>
              <div className="product-addon-grid">
                {productAddons.map((addon) => {
                  const active = addons.includes(addon.id)
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      className={`product-addon-card ${active ? 'product-addon-card--active' : ''}`}
                      onClick={() => toggleAddon(addon.id)}
                    >
                      <span className="product-addon-card__icon">{addon.icon}</span>
                      <span className="product-addon-card__name">{addon.name}</span>
                      <span className="product-addon-card__price">+₹{addon.price.toFixed(2)}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          <section className="product-section product-section--last">
            <h2 className="product-section__title">Description</h2>
            <p className="product-description">{item.desc}</p>
            {item.customizable && (
              <p className="product-description">
                Slow-cooked with aromatic spices and premium rice. Customize with add-ons before adding
                to your cart.
              </p>
            )}
          </section>
        </div>

        <div className="product-cart-bar">
          <div className="product-cart-bar__text">
            <p className="product-cart-bar__count">01 Item selected</p>
            <p className="product-cart-bar__summary">
              {item.name}
              {addons.length > 0 ? `, +${addons.length} add-on${addons.length > 1 ? 's' : ''}` : ''}
            </p>
          </div>
          <button type="button" className="product-cart-bar__cta">
            <span>₹{total.toFixed(2)}</span>
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </main>
    </div>
  )
}
