import type { QuickFact } from "@/lib/mlb-team-types";

interface QuickFactsProps {
  facts: QuickFact[];
}

export function QuickFacts({ facts }: QuickFactsProps) {
  return (
    <section className="td-section" aria-label="MLB quick facts">
      <div className="td-section-head">
        <h2 className="td-section-title">MLB Quick Facts</h2>
      </div>

      <div className="td-facts__grid" role="list">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="td-fact-card"
            role="listitem"
            aria-label={`${fact.value} — ${fact.label}`}
          >
            <span className="td-fact-card__icon" aria-hidden="true">{fact.icon}</span>
            <span className="td-fact-card__value">{fact.value}</span>
            <span className="td-fact-card__label">{fact.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
