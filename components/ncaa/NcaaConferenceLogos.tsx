import type { ReactNode } from "react";

const svgProps = {
  viewBox: "0 0 80 48",
  fill: "none",
  "aria-hidden": true as const,
  className: "ncaa-conf-card__logo-svg",
};

function AccLogo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#003087" />
      <text x="40" y="32" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="Arial,sans-serif">ACC</text>
    </svg>
  );
}

function BigTenLogo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#0a1e63" />
      <text x="40" y="22" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800" fontFamily="Arial,sans-serif">BIG</text>
      <text x="40" y="36" textAnchor="middle" fill="#c9a227" fontSize="11" fontWeight="800" fontFamily="Arial,sans-serif">TEN</text>
    </svg>
  );
}

function SecLogo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#1a1a1a" />
      <text x="40" y="32" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800" fontFamily="Arial,sans-serif">SEC</text>
      <rect x="8" y="8" width="64" height="4" fill="#a91d23" />
    </svg>
  );
}

function Big12Logo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#1a1a1a" />
      <text x="40" y="22" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800" fontFamily="Arial,sans-serif">BIG</text>
      <text x="40" y="38" textAnchor="middle" fill="#c8102e" fontSize="16" fontWeight="800" fontFamily="Arial,sans-serif">12</text>
    </svg>
  );
}

function Pac12Logo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#004a7f" />
      <text x="40" y="22" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800" fontFamily="Arial,sans-serif">PAC</text>
      <text x="40" y="38" textAnchor="middle" fill="#c9a227" fontSize="14" fontWeight="800" fontFamily="Arial,sans-serif">12</text>
    </svg>
  );
}

function AacLogo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#00293f" />
      <text x="40" y="32" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800" fontFamily="Arial,sans-serif">AAC</text>
    </svg>
  );
}

function CUsaLogo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#8a5a00" />
      <text x="40" y="22" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="Arial,sans-serif">C</text>
      <text x="40" y="36" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="Arial,sans-serif">USA</text>
    </svg>
  );
}

function MaacLogo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#5c2d91" />
      <text x="40" y="32" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800" fontFamily="Arial,sans-serif">MAAC</text>
    </svg>
  );
}

function MvcLogo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#0f4c3a" />
      <text x="40" y="32" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800" fontFamily="Arial,sans-serif">MVC</text>
    </svg>
  );
}

function WccLogo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#003c5a" />
      <text x="40" y="32" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800" fontFamily="Arial,sans-serif">WCC</text>
    </svg>
  );
}

function Atlantic10Logo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#7f1016" />
      <text x="40" y="22" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="Arial,sans-serif">ATLANTIC</text>
      <text x="40" y="36" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800" fontFamily="Arial,sans-serif">10</text>
    </svg>
  );
}

function SunBeltLogo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#c25400" />
      <text x="40" y="22" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800" fontFamily="Arial,sans-serif">SUN</text>
      <text x="40" y="36" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800" fontFamily="Arial,sans-serif">BELT</text>
    </svg>
  );
}

function AmericaEastLogo() {
  return (
    <svg {...svgProps}>
      <rect width="80" height="48" rx="4" fill="#2c2c54" />
      <text x="40" y="22" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800" fontFamily="Arial,sans-serif">AMERICA</text>
      <text x="40" y="36" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800" fontFamily="Arial,sans-serif">EAST</text>
    </svg>
  );
}

const LOGO_MAP: Record<string, () => ReactNode> = {
  acc: AccLogo,
  "big-ten": BigTenLogo,
  sec: SecLogo,
  "big-12": Big12Logo,
  "pac-12": Pac12Logo,
  aac: AacLogo,
  "c-usa": CUsaLogo,
  maac: MaacLogo,
  mvc: MvcLogo,
  wcc: WccLogo,
  "atlantic-10": Atlantic10Logo,
  "sun-belt": SunBeltLogo,
  "american-east": AmericaEastLogo,
};

export function ConferenceLogo({ slug }: { slug: string }) {
  const Logo = LOGO_MAP[slug];
  if (!Logo) return null;
  return <Logo />;
}
