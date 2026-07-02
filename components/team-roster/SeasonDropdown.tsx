"use client";

import { Dropdown } from "@/components/team-roster/Dropdown";

export const SEASON_OPTIONS = ["2026", "2025", "2024"];

interface SeasonDropdownProps {
  value: string;
  onChange: (season: string) => void;
}

export function SeasonDropdown({ value, onChange }: SeasonDropdownProps) {
  return (
    <Dropdown
      label="Season"
      value={value}
      onChange={onChange}
      options={SEASON_OPTIONS.map((season) => ({ value: season, label: season }))}
    />
  );
}
