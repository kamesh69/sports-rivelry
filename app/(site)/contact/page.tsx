export default function ContactPage() {
  return (
    <div className="page-shell page-shell--detail">
      <section className="prose-panel">
        <span className="eyebrow">Contact</span>
        <h1>Contact the newsroom</h1>
        <p>
          Editorial inquiries: <a href="mailto:editor@sportsrivalry.com">editor@sportsrivalry.com</a>
        </p>
        <p>
          Partnerships and commercial:{" "}
          <a href="mailto:partners@sportsrivalry.com">partners@sportsrivalry.com</a>
        </p>
        <p>
          This page exists both for readers and for publisher trust signals expected by Google
          News and Discover.
        </p>
      </section>
    </div>
  );
}
