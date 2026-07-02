interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No players found.",
  description = "Try another season or team.",
}: EmptyStateProps) {
  return (
    <div className="tr-empty" role="status" aria-live="polite">
      <span className="tr-empty__icon" aria-hidden="true">⚾</span>
      <p className="tr-empty__title">{title}</p>
      <p className="tr-empty__desc">{description}</p>
    </div>
  );
}
