interface ArticleEssentialsProps {
  items: string[];
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 16 20"
      aria-hidden="true"
      className="article-essentials__icon"
      fill="currentColor"
    >
      <path d="M2 0h12a2 2 0 0 1 2 2v18l-8-4-8 4V2a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function ArticleEssentials({ items }: ArticleEssentialsProps) {
  if (!items.length) {
    return null;
  }

  return (
    <aside className="article-essentials" aria-labelledby="article-essentials-heading">
      <div className="article-essentials__title-row">
        <BookmarkIcon />
        <h2 id="article-essentials-heading">Essentials Inside The Story</h2>
      </div>
      <ul className="article-essentials__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
