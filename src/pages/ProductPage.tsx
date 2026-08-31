import {
  ArrowLeft,
  Check,
  ChevronRight,
  Flame,
  Heart,
  Share2,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { addCartItem } from '../config/cart'
import {
  getMenuItemById,
  getProductAddonGroups,
  getProductDetails,
  isBestSeller,
  type ProductAddonGroup,
} from '../data/menu'

function toggleGroupSelection(
  group: ProductAddonGroup,
  selected: string[],
  addonId: string,
): string[] {
  if (selected.includes(addonId)) {
    return selected.filter((id) => id !== addonId)
  }
  if (selected.length >= group.max) return selected
  return [...selected, addonId]
}

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const item = id ? getMenuItemById(id) : undefined

  const addonGroups = useMemo(() => (item ? getProductAddonGroups(item) : []), [item])
  const details = item ? getProductDetails(item) : ''

  const [groupSelections, setGroupSelections] = useState<Record<string, string[]>>({})
  const [specialInstructions, setSpecialInstructions] = useState('')

  if (!item) {
    return <Navigate to="/home" replace />
  }

  const selectedAddons = addonGroups.flatMap((group) => {
    const ids = groupSelections[group.id] ?? []
    return group.items
      .filter((addon) => ids.includes(addon.id))
      .map((addon) => ({
        id: addon.id,
        groupId: group.id,
        name: addon.name,
        price: addon.price,
      }))
  })

  const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0)
  const total = item.price + addonTotal
  const addonCount = selectedAddons.length

  const handleGroupToggle = (group: ProductAddonGroup, addonId: string) => {
    setGroupSelections((current) => ({
      ...current,
      [group.id]: toggleGroupSelection(group, current[group.id] ?? [], addonId),
    }))
  }

  const handleAddToCart = () => {
    addCartItem({
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      sizeId: 'standard',
      sizeLabel: 'Standard',
      basePrice: item.price,
      addons: selectedAddons,
      specialInstructions: specialInstructions.trim(),
      quantity: 1,
    })
    navigate('/home')
  }

  const summaryParts = [
    item.name,
    addonCount > 0 ? `+${addonCount} add-on${addonCount > 1 ? 's' : ''}` : null,
  ].filter(Boolean)

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
                <span className="product-hero__meta-item">₹{item.price.toFixed(2)}</span>
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

          <section className="product-section">
            <h2 className="product-section__title">Description</h2>
            <p className="product-description">{details}</p>
          </section>

          {addonGroups.map((group) => {
            const selected = groupSelections[group.id] ?? []
            const isDrinkGroup = group.id === 'drinks'
            return (
              <section key={group.id} className="product-section">
                <div className="product-addon-group__head">
                  <h2 className="product-section__title product-section__title--inline">
                    {group.title}
                  </h2>
                  <span className="product-addon-group__count">
                    {selected.length}/{group.max}
                  </span>
                </div>
                {isDrinkGroup ? (
                  <div className="product-addon-card-grid scrollbar-hide">
                    {group.items.map((addon) => {
                      const active = selected.includes(addon.id)
                      const disabled = !active && selected.length >= group.max
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          className={`product-addon-card ${active ? 'product-addon-card--active' : ''} ${disabled ? 'product-addon-card--disabled' : ''}`}
                          onClick={() => handleGroupToggle(group, addon.id)}
                          disabled={disabled}
                        >
                          <div className="product-addon-card__image-wrap">
                            {addon.image && (
                              <img src={addon.image} alt="" className="product-addon-card__image" />
                            )}
                            <span
                              className={`product-addon-card__check ${active ? 'product-addon-card__check--active' : ''}`}
                              aria-hidden
                            >
                              {active && <Check size={11} strokeWidth={3} />}
                            </span>
                          </div>
                          <span className="product-addon-card__name">{addon.name}</span>
                          <span className="product-addon-card__price">₹{addon.price.toFixed(2)}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="product-addon-list">
                    {group.items.map((addon) => {
                      const active = selected.includes(addon.id)
                      const disabled = !active && selected.length >= group.max
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          className={`product-addon-row ${active ? 'product-addon-row--active' : ''} ${disabled ? 'product-addon-row--disabled' : ''}`}
                          onClick={() => handleGroupToggle(group, addon.id)}
                          disabled={disabled}
                        >
                          <span
                            className={`product-addon-row__check ${active ? 'product-addon-row__check--active' : ''}`}
                            aria-hidden
                          >
                            {active && <Check size={12} strokeWidth={3} />}
                          </span>
                          <span className="product-addon-row__name">{addon.name}</span>
                          <span className="product-addon-row__price">₹{addon.price.toFixed(2)}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}

          <section className="product-section product-section--last">
            <h2 className="product-section__title">Special Instructions</h2>
            <textarea
              className="product-instructions"
              placeholder="e.g. less spicy, no onion, extra gravy on side..."
              value={specialInstructions}
              onChange={(event) => setSpecialInstructions(event.target.value)}
              rows={3}
              maxLength={200}
            />
            <p className="product-instructions__hint">{specialInstructions.length}/200</p>
          </section>
        </div>

        <div className="product-cart-bar">
          <div className="product-cart-bar__text">
            <p className="product-cart-bar__count">01 Item selected</p>
            <p className="product-cart-bar__summary">{summaryParts.join(', ')}</p>
          </div>
          <button type="button" className="product-cart-bar__cta" onClick={handleAddToCart}>
            <span>₹{total.toFixed(2)}</span>
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      </main>
    </div>
  )
}
