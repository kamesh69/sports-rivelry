export interface MLBTeam {
  id: string;
  slug: string;
  name: string;
  city: string;
  shortName: string;
  primaryColor: string;
  accentColor: string;
  textColor?: string;
  stadiumImage: string;
  stadium: string;
  stadiumCapacity: number;
  founded: number;
  championships: number;
  league: "American" | "National";
  division: "East" | "Central" | "West";
  description: string;
  /** Optional roster-page extras — resolved with sensible fallbacks by the team service. */
  logo?: string;
  bannerImage?: string;
  manager?: string;
}

/**
 * Shape requested for the Team Roster feature. `Team` is a lightweight,
 * roster-page-focused projection of `MLBTeam` — every `MLBTeam` already
 * satisfies it, so no separate data source is required.
 */
export interface Team {
  id: string;
  slug: string;
  name: string;
  city: string;
  league: "American" | "National";
  division: "East" | "Central" | "West";
  logo: string;
  stadium: string;
  stadiumImage: string;
  bannerImage: string;
  manager: string;
}

export interface TeamCategory {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  filter: (team: MLBTeam) => boolean;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface QuickFact {
  icon: string;
  value: string;
  label: string;
}
