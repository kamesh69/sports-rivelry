interface NewsHeaderProps {
  title: string;
  description?: string;
}

/** Large page title with the thin MLB-red separator rule from the design reference. */
export function NewsHeader({ title, description }: NewsHeaderProps) {
  return (
    <header className="mn-header">
      <h1 className="mn-header__title">{title}</h1>
      <div className="mn-header__rule" aria-hidden="true" />
      {description ? <p className="mn-header__desc">{description}</p> : null}
    </header>
  );
}
