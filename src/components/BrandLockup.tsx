export const BRAND_LOGO_SRC = '/brand/logo.png'

/** Official logo + tagline for welcome / splash screens */
export function BrandLockup() {
  return (
    <div className="brand-lockup">
      <img
        src={BRAND_LOGO_SRC}
        alt="The Biriyani Store, established 1975"
        className="brand-logo"
        draggable={false}
      />
      <div className="brand-rule" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <p className="brand-tagline">Authentic Flavors. Timeless Legacy.</p>
    </div>
  )
}
