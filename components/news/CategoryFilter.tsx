"use client";

import type { NewsCategory } from "@/lib/news-types";

interface CategoryFilterProps {
  categories: NewsCategory[];
  value: string;
  onChange: (value: string) => void;
}

/** Category filter dropdown (All, MLB, Trade News, Injuries, Analysis, Interviews, History). */
export function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
  return (
    <label className="mn-select-wrap">
      <span className="visually-hidden">Filter by category</span>
      <select
        className="mn-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filter by category"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>
    </label>
  );
}
