"use client";

import type { MLBTeam } from "@/lib/mlb-team-types";
import { Dropdown } from "@/components/team-roster/Dropdown";

interface TeamDropdownProps {
  teams: MLBTeam[];
  value: string;
  onChange: (teamSlug: string) => void;
}

/** Lets the user jump straight to another team's roster without a full page reload. */
export function TeamDropdown({ teams, value, onChange }: TeamDropdownProps) {
  return (
    <Dropdown
      label="Team"
      value={value}
      onChange={onChange}
      options={teams.map((team) => ({ value: team.slug, label: team.name }))}
    />
  );
}
