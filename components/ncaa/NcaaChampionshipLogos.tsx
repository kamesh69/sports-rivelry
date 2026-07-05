import type { ReactNode } from "react";

const svgProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  "aria-hidden": true as const,
  className: "ncaa-champ-card__logo-svg",
};

/** NCAA Championship Series shield shown in the hero stats panel. */
export function NcaaChampionshipSeriesLogo() {
  return (
    <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className="ncaa-hero__panel-logo">
      <path d="M18 2 32 8v10c0 8.5-5.8 16.4-14 18.5C9.8 34.4 4 26.5 4 18V8L18 2Z" fill="#003087" />
      <path d="M18 6 28 10.5v7.5c0 6.2-4.2 12-10 13.6-5.8-1.6-10-7.4-10-13.6v-7.5L18 6Z" fill="#fff" />
      <circle cx="18" cy="17" r="5" fill="#003087" />
      <path d="M15 17h6M18 14v6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10 8h16" stroke="#c8102e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FootballChampionshipLogo() {
  return (
    <svg {...svgProps} viewBox="0 0 64 72">
      <path d="M32 4 56 14v18c0 16-12 30-24 36C20 56 8 42 8 32V14L32 4Z" fill="#1a2744" stroke="#c9a227" strokeWidth="1.5" />
      <ellipse cx="32" cy="34" rx="14" ry="9" stroke="#c9a227" strokeWidth="1.5" fill="none" />
      <path d="M20 34h24" stroke="#fff" strokeWidth="1.2" />
      <path d="M32 22v24" stroke="#fff" strokeWidth="1.2" />
      <text x="32" y="64" textAnchor="middle" fill="#c9a227" fontSize="5.5" fontWeight="800" fontFamily="Arial,sans-serif">FOOTBALL</text>
    </svg>
  );
}

function MarchMadnessLogo() {
  return (
    <svg {...svgProps} viewBox="0 0 64 72">
      <path d="M8 18h48v38H8V18Z" fill="#003087" rx="4" />
      <rect x="8" y="18" width="48" height="38" rx="4" fill="#003087" />
      <text x="32" y="36" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800" fontFamily="Arial,sans-serif">MARCH</text>
      <text x="32" y="48" textAnchor="middle" fill="#ff6b00" fontSize="8" fontWeight="800" fontFamily="Arial,sans-serif">MADNESS</text>
      <circle cx="32" cy="58" r="5" fill="#ff6b00" />
    </svg>
  );
}

function FinalFourLogo() {
  return (
    <svg {...svgProps}>
      <rect x="10" y="14" width="44" height="36" rx="3" fill="#003087" />
      <text x="32" y="30" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800" fontFamily="Arial,sans-serif">FINAL</text>
      <text x="32" y="42" textAnchor="middle" fill="#c9a227" fontSize="8" fontWeight="800" fontFamily="Arial,sans-serif">FOUR</text>
    </svg>
  );
}

function CollegeWorldSeriesLogo() {
  return (
    <svg {...svgProps}>
      <circle cx="32" cy="28" r="20" fill="#003087" />
      <text x="32" y="24" textAnchor="middle" fill="#fff" fontSize="5.5" fontWeight="800" fontFamily="Arial,sans-serif">COLLEGE</text>
      <text x="32" y="32" textAnchor="middle" fill="#c9a227" fontSize="5.5" fontWeight="800" fontFamily="Arial,sans-serif">WORLD</text>
      <text x="32" y="40" textAnchor="middle" fill="#fff" fontSize="5.5" fontWeight="800" fontFamily="Arial,sans-serif">SERIES</text>
      <rect x="22" y="48" width="20" height="8" rx="2" fill="#c9a227" />
    </svg>
  );
}

function DiBaseballLogo() {
  return (
    <svg {...svgProps}>
      <circle cx="32" cy="32" r="26" fill="#1a2744" stroke="#c9a227" strokeWidth="2" />
      <path d="M32 14c-6 4-10 10-10 18s4 14 10 18c6-4 10-10 10-18s-4-14-10-18Z" stroke="#fff" strokeWidth="1.5" fill="none" />
      <text x="32" y="58" textAnchor="middle" fill="#c9a227" fontSize="5" fontWeight="800" fontFamily="Arial,sans-serif">DI BASEBALL</text>
    </svg>
  );
}

function TrackFieldLogo() {
  return (
    <svg {...svgProps}>
      <ellipse cx="32" cy="32" rx="26" ry="18" stroke="#003087" strokeWidth="2.5" fill="none" />
      <ellipse cx="32" cy="32" rx="16" ry="10" stroke="#c8102e" strokeWidth="1.5" fill="none" />
      <text x="32" y="58" textAnchor="middle" fill="#003087" fontSize="5" fontWeight="800" fontFamily="Arial,sans-serif">TRACK & FIELD</text>
    </svg>
  );
}

function SoftballLogo() {
  return (
    <svg {...svgProps}>
      <circle cx="32" cy="30" r="22" fill="#ff6b00" />
      <circle cx="32" cy="30" r="14" fill="#fff" />
      <path d="M24 22c2 4 14 4 16 0M24 38c2-4 14-4 16 0" stroke="#ff6b00" strokeWidth="1.5" />
      <text x="32" y="58" textAnchor="middle" fill="#ff6b00" fontSize="5" fontWeight="800" fontFamily="Arial,sans-serif">SOFTBALL</text>
    </svg>
  );
}

function FrozenFourLogo() {
  return (
    <svg {...svgProps}>
      <rect x="12" y="16" width="40" height="32" rx="4" fill="#003087" />
      <path d="M20 36 32 20l12 16H20Z" fill="#5eb8ff" />
      <text x="32" y="56" textAnchor="middle" fill="#5eb8ff" fontSize="5.5" fontWeight="800" fontFamily="Arial,sans-serif">FROZEN FOUR</text>
    </svg>
  );
}

const LOGO_MAP: Record<string, () => ReactNode> = {
  football: FootballChampionshipLogo,
  "march-madness": MarchMadnessLogo,
  "final-four": FinalFourLogo,
  "college-world-series": CollegeWorldSeriesLogo,
  "di-baseball": DiBaseballLogo,
  "track-field": TrackFieldLogo,
  softball: SoftballLogo,
  "frozen-four": FrozenFourLogo,
};

export function ChampionshipLogo({ variant }: { variant: string }) {
  const Logo = LOGO_MAP[variant];
  if (!Logo) return null;
  return <Logo />;
}
