import type { ReactNode } from "react";

const iconProps = {
  width: 32,
  height: 32,
  viewBox: "0 0 32 32",
  fill: "none",
  "aria-hidden": true as const,
};

function AllTeamsIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="11" cy="12" r="4" fill="#1e3a5f" />
      <circle cx="21" cy="12" r="4" fill="#1e3a5f" />
      <path d="M6 24c0-3.3 2.7-6 6-6h8c3.3 0 6 2.7 6 6" stroke="#1e3a5f" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function AmericanLeagueIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="16" cy="16" r="14" fill="#002366" />
      <path d="M10 18c2-4 10-4 12 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 14c1.5-3 6-5 8-5s6.5 2 8 5" stroke="#c8102e" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="16" cy="21" r="3.5" fill="#fff" />
      <path d="M14.5 20.5c.5 1 2.5 1 3 0" stroke="#c8102e" strokeWidth="0.8" />
    </svg>
  );
}

function NationalLeagueIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 3 29 16 16 29 3 16Z" fill="#fff" stroke="#c8102e" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="5" fill="#002366" />
      <path d="M11 16h10M16 11v10" stroke="#fff" strokeWidth="1.2" />
    </svg>
  );
}

function DivisionLetterIcon({ letter }: { letter: string }) {
  return (
    <svg {...iconProps}>
      <circle cx="16" cy="16" r="14" fill="#1e3a5f" />
      <text x="16" y="21" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">
        {letter}
      </text>
    </svg>
  );
}

function ExpansionIcon() {
  return (
    <svg {...iconProps}>
      <path
        d="M16 4l2.8 6.8 7.2.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7-5.4-4.7 7.2-.6Z"
        fill="#1e3a5f"
      />
    </svg>
  );
}

function OriginalIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 26V10l8-5 8 5v16" stroke="#1e3a5f" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 26h16" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 10v16" stroke="#c8102e" strokeWidth="1.5" />
    </svg>
  );
}

function ChampionsIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10 12h12v4c0 4.4-2.7 8.2-6.5 9.8" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 12h3v3c0 2.2-1 4.1-2.5 5.5" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 12H7v3c0 2.2 1 4.1 2.5 5.5" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 26h10" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
      <rect x="13" y="7" width="6" height="5" rx="1" fill="#c9a227" stroke="#1e3a5f" strokeWidth="1.2" />
    </svg>
  );
}

function HallOfFameIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6 26h20" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 26V14l8-4 8 4v12" stroke="#1e3a5f" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 26v-8h8v8" stroke="#1e3a5f" strokeWidth="1.5" />
      <path d="M11 14h10" stroke="#1e3a5f" strokeWidth="1.5" />
    </svg>
  );
}

const CATEGORY_ICON_MAP: Record<string, () => ReactNode> = {
  all: AllTeamsIcon,
  al: AmericanLeagueIcon,
  nl: NationalLeagueIcon,
  east: () => <DivisionLetterIcon letter="E" />,
  central: () => <DivisionLetterIcon letter="C" />,
  west: () => <DivisionLetterIcon letter="W" />,
  expansion: ExpansionIcon,
  original: OriginalIcon,
  champions: ChampionsIcon,
  hof: HallOfFameIcon,
};

export function CategoryIcon({ id }: { id: string }) {
  const Icon = CATEGORY_ICON_MAP[id];
  if (!Icon) return null;
  return <Icon />;
}
