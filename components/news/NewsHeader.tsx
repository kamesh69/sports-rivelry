interface NewsHeaderProps {
  title: string;
  description?: string;
}

/** Page title with an accent rule extending to the right edge. */
export function NewsHeader({ title, description }: NewsHeaderProps) {
  return (
    <header className="mn-header">
      <div className="mn-header__row">
        <h1 className="mn-header__title">{title}</h1>
        <div className="mn-header__rule" aria-hidden="true" />
      </div>
      {description ? <p className="mn-header__desc">{description}</p> : null}
    </header>
  );
}
