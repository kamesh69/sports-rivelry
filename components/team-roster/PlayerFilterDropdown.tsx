"use client";

import type { PositionGroup } from "@/lib/player-types";
import { Dropdown } from "@/components/team-roster/Dropdown";

export type PlayerFilterValue = "All Players" | PositionGroup;

const OPTIONS: PlayerFilterValue[] = ["All Players", "Pitchers", "Catchers", "Infielders", "Outfielders"];

interface PlayerFilterDropdownProps {
  value: PlayerFilterValue;
  onChange: (value: PlayerFilterValue) => void;
}

export function PlayerFilterDropdown({ value, onChange }: PlayerFilterDropdownProps) {
  return (
    <Dropdown
      label="Player position"
      value={value}
      onChange={(next) => onChange(next as PlayerFilterValue)}
      options={OPTIONS.map((option) => ({ value: option, label: option }))}
    />
  );
}
