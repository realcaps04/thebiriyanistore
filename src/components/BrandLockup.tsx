/** Brand fortress mark + wordmark for welcome / splash screens */
export function FortressMark() {
  return (
    <svg
      width="72"
      height="88"
      viewBox="0 0 100 122"
      fill="none"
      role="img"
      aria-label="The Biriyani Store, established 1975"
    >
      <rect x="49" y="6" width="2.8" height="28" fill="#2d472c" />
      <path d="M51.8 6.5 L66 12 L51.8 17.5 Z" fill="#2d472c" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#2d472c"
        d="M0 122 L0 52 L16 52 L16 58 L28 58 L28 46 L72 46 L72 58 L84 58 L84 52 L100 52 L100 122 Z
           M38 122 L38 94 A12 16 0 0 1 62 94 L62 122 Z"
      />
      <line x1="28" y1="78" x2="42" y2="78" stroke="#bfa34b" strokeWidth="1.5" />
      <line x1="58" y1="78" x2="72" y2="78" stroke="#bfa34b" strokeWidth="1.5" />
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fill="#bfa34b"
        fontSize="11"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        1975
      </text>
      <line x1="28" y1="86" x2="42" y2="86" stroke="#bfa34b" strokeWidth="1.5" />
      <line x1="58" y1="86" x2="72" y2="86" stroke="#bfa34b" strokeWidth="1.5" />
    </svg>
  )
}

export function BrandLockup() {
  return (
    <div className="brand-lockup">
      <FortressMark />
      <h2 className="brand-wordmark">
        <span>THE</span>
        <span className="brand-wordmark-main">
          BIRIYANI
          <sup>TM</sup>
        </span>
        <span>STORE</span>
      </h2>
      <div className="brand-rule" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <p className="brand-tagline">Authentic Flavors. Timeless Legacy.</p>
    </div>
  )
}
