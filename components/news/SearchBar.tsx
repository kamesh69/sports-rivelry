"use client";

import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/** Debounced search input — keeps typing snappy while avoiding a re-filter on every keystroke. */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search articles…",
  debounceMs = 300,
}: SearchBarProps) {
  const [draft, setDraft] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(next: string) {
    setDraft(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(next), debounceMs);
  }

  return (
    <label className="mn-search">
      <span className="visually-hidden">Search articles</span>
      <svg className="mn-search__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        className="mn-search__input"
        placeholder={placeholder}
        value={draft}
        onChange={(event) => handleChange(event.target.value)}
        aria-label="Search articles"
      />
    </label>
  );
}
