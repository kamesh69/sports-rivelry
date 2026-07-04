interface NewsErrorStateProps {
  message?: string;
  onRetry: () => void;
}

/** Reusable error state with a retry action, used whenever news data fails to load. */
export function NewsErrorState({
  message = "We couldn't load the latest MLB news. Please try again.",
  onRetry,
}: NewsErrorStateProps) {
  return (
    <div className="mn-error" role="alert">
      <span className="mn-error__icon" aria-hidden="true">
        !
      </span>
      <p className="mn-error__title">Something went wrong</p>
      <p className="mn-error__desc">{message}</p>
      <button type="button" className="mn-error__retry" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
