const reactions = [
  { label: "Like", mark: "+1" },
  { label: "Fan pick", mark: "#1" },
  { label: "Winner", mark: "W" },
];

export function ArticleReactionRow() {
  return (
    <section className="article-reactions" aria-labelledby="article-reactions-heading">
      <h2 id="article-reactions-heading">What did you think of this story?</h2>
      <div className="article-reactions__items">
        {reactions.map((reaction) => (
          <button key={reaction.label} type="button" className="article-reactions__button">
            <span aria-hidden="true">{reaction.mark}</span>
            <span className="sr-only">{reaction.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
