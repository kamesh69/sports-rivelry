export function AmericanLeagueLogo() {
  return (
    <svg
      viewBox="0 0 80 80"
      width="80"
      height="80"
      fill="none"
      aria-hidden="true"
      className="td-league-card__logo-svg"
    >
      <circle cx="40" cy="40" r="38" fill="rgba(255,255,255,0.12)" />
      <path
        d="M18 48c4-10 20-10 24 0M22 36c3-6 13-10 18-10s15 4 18 10"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M20 40c2-5 9-8 14-8s12 3 14 8"
        stroke="#c8102e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="24" y="28" width="32" height="8" rx="2" fill="#fff" />
      <text x="40" y="34.5" textAnchor="middle" fill="#002366" fontSize="6.5" fontWeight="800" fontFamily="Arial, sans-serif">
        AMERICAN
      </text>
      <circle cx="40" cy="56" r="10" fill="#fff" />
      <path d="M36 55c1.5 2 6.5 2 8 0" stroke="#c8102e" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function NationalLeagueLogo() {
  return (
    <svg
      viewBox="0 0 80 80"
      width="80"
      height="80"
      fill="none"
      aria-hidden="true"
      className="td-league-card__logo-svg"
    >
      <path d="M40 6 72 40 40 74 8 40Z" fill="#fff" stroke="#c8102e" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="14" fill="#002366" />
      <path d="M30 40h20M40 30v20" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 22l8 8M58 22l-8 8M22 58l8-8M58 58l-8-8" stroke="#c8102e" strokeWidth="2.5" strokeLinecap="round" />
      <text x="40" y="44" textAnchor="middle" fill="#fff" fontSize="5.5" fontWeight="800" fontFamily="Arial, sans-serif">
        NL
      </text>
    </svg>
  );
}
