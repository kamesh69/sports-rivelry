const reactions = [
  { emoji: "🔥", label: "Fire", count: 342 },
  { emoji: "👏", label: "Clapping", count: 128 },
  { emoji: "🤔", label: "Thinking", count: 56 },
  { emoji: "❤️", label: "Heart", count: 89 },
];

export function ArticleReactionRow() {
  return (
    <section className="article-reactions" aria-labelledby="article-reactions-heading">
      <h2 id="article-reactions-heading">What do you think?</h2>
      <div className="article-reactions__items">
        {reactions.map((reaction) => (
          <button key={reaction.label} type="button" className="article-reactions__button">
            <span aria-hidden="true">{reaction.emoji}</span>
            <span>{reaction.count}</span>
            <span className="sr-only">{reaction.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
