"use client";

import type { NewsSortOption } from "@/lib/news-types";

const SORT_OPTIONS: Array<{ value: NewsSortOption; label: string }> = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most Popular" },
];

interface SortDropdownProps {
  value: NewsSortOption;
  onChange: (value: NewsSortOption) => void;
}

/** Sort-order dropdown for the news listing. Ready to drive a real API sort parameter. */
export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <label className="mn-select-wrap">
      <span className="visually-hidden">Sort articles</span>
      <select
        className="mn-select"
        value={value}
        onChange={(event) => onChange(event.target.value as NewsSortOption)}
        aria-label="Sort articles"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
