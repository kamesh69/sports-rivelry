interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong while loading this roster.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="tr-error" role="alert">
      <span className="tr-error__icon" aria-hidden="true">⚠️</span>
      <p className="tr-error__title">{message}</p>
      {onRetry ? (
        <button type="button" className="tr-error__retry" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
