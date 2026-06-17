interface InfoPageProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
}

export function InfoPage({ eyebrow, title, paragraphs }: InfoPageProps) {
  return (
    <div className="page-shell page-shell--detail">
      <section className="prose-panel">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </div>
  );
}
