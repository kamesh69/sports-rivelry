"use client";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2 4L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Generic reusable dropdown used by Season / Team / Player-position filters. */
export function Dropdown({ label, value, options, onChange, disabled }: DropdownProps) {
  return (
    <label className="tr-select-wrap">
      <span className="visually-hidden">{label}</span>
      <select
        className="tr-select"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown />
    </label>
  );
}
