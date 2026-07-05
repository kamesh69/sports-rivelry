import type { ReactNode } from "react";

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 32 32",
  fill: "none",
  "aria-hidden": true as const,
};

function SoccerIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
      <path d="M16 9l5 3.6-2 5.9h-6l-2-5.9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function LacrosseIcon() {
  return (
    <svg {...iconProps}>
      <ellipse cx="16" cy="10" rx="6" ry="7" stroke="currentColor" strokeWidth="2" />
      <path d="M16 17v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 10c0-3 1.8-5 4-5s4 2 4 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function GymnasticsIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="16" cy="6" r="2.4" fill="currentColor" />
      <path
        d="M16 9v7l-6 9M16 16l6 9M9 13l7 3 7-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function TrackFieldIcon() {
  return (
    <svg {...iconProps}>
      <ellipse cx="16" cy="16" rx="13" ry="9" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="16" cy="16" rx="7.5" ry="5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function SwimmingIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 24c2-2 4-2 6 0s4 2 6 0 4-2 6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <circle cx="21" cy="9" r="2.2" fill="currentColor" />
      <path d="M9 15l7-3 3 4-4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function TennisIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" />
      <path d="M4.5 11c5 3 5 7 0 10M27.5 11c-5 3-5 7 0 10" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function GolfIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10 29V6l12 5-12 5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <ellipse cx="10" cy="29.5" rx="6" ry="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CrossCountryIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="10" cy="7" r="2.2" fill="currentColor" />
      <path
        d="M10 10l-3 6 4 3-1 8M10 10l5 4-2 5 6 4M7 16l6-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

const SPORT_ICON_MAP: Record<string, () => ReactNode> = {
  soccer: SoccerIcon,
  lacrosse: LacrosseIcon,
  gymnastics: GymnasticsIcon,
  "track-field": TrackFieldIcon,
  "swimming-diving": SwimmingIcon,
  tennis: TennisIcon,
  golf: GolfIcon,
  "cross-country": CrossCountryIcon,
};

export function NcaaSportIcon({ id }: { id: string }) {
  const Icon = SPORT_ICON_MAP[id];
  if (!Icon) return null;
  return <Icon />;
}
