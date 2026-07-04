"use client";

import type { NewsCategory, NewsSortOption } from "@/lib/news-types";
import { SearchBar } from "@/components/news/SearchBar";
import { SortDropdown } from "@/components/news/SortDropdown";
import { CategoryFilter } from "@/components/news/CategoryFilter";

interface NewsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: NewsCategory[];
  category: string;
  onCategoryChange: (value: string) => void;
  sortBy: NewsSortOption;
  onSortChange: (value: NewsSortOption) => void;
  resultCount: number;
}

/** Search + category + sort controls for the MLB news listing. */
export function NewsFilters({
  search,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  resultCount,
}: NewsFiltersProps) {
  return (
    <div className="mn-filters" role="search">
      <SearchBar value={search} onChange={onSearchChange} placeholder="Search articles…" />

      <div className="mn-filters__controls">
        <CategoryFilter categories={categories} value={category} onChange={onCategoryChange} />
        <SortDropdown value={sortBy} onChange={onSortChange} />
        <span className="mn-filters__count" role="status" aria-live="polite">
          {resultCount} {resultCount === 1 ? "article" : "articles"}
        </span>
      </div>
    </div>
  );
}
