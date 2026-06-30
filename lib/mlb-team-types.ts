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
