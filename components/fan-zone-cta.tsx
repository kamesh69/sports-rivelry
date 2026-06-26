import Link from "next/link";
import { FanPollWidget } from "@/components/fan-poll-widget";
import type { FanPoll, FanZoneContent } from "@/lib/types";

const ICONS: Record<string, string> = {
  trophy: "M6 3h12v3a6 6 0 0 1-12 0V3Zm0 3H3v1a4 4 0 0 0 4 4M18 6h3v1a4 4 0 0 1-4 4M9 16h6M12 12v4M8 21h8",
  poll: "M5 21V9m7 12V3m7 18v-7",
  target: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M12 12v0",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z",
  star: "M12 3l2.9 6 6.1.9-4.5 4.3 1.1 6.1L12 17.8 6.4 20.3l1.1-6.1L3 9.9 9.1 9 12 3Z",
  flame: "M12 3c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1 1.5 1.5 2 1 0-2-1-4 1-6Z",
};

function FanZoneIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d={ICONS[name] || ICONS.trophy} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface FanZoneCtaProps {
  content: FanZoneContent;
  poll?: FanPoll | null;
}

export function FanZoneCta({ content, poll }: FanZoneCtaProps) {
  return (
    <section className="fan-zone" aria-labelledby="fan-zone-heading">
      <div className="fan-zone__intro">
        <p className="fan-zone__kicker">Join the</p>
        <h2 id="fan-zone-heading">Fan Zone</h2>
        <p className="fan-zone__copy">{content.subheading}</p>
        <Link href={content.ctaHref} className="fan-zone__cta">
          {content.ctaLabel}
        </Link>
      </div>

      <ul className="fan-zone__cards">
        {content.cards.map((card) => {
          const body = (
            <>
              <span className="fan-zone__icon">
                <FanZoneIcon name={card.icon} />
              </span>
              <span className="fan-zone__card-copy">
                <strong>{card.title}</strong>
                <span>{card.description}</span>
              </span>
            </>
          );

          return (
            <li key={card.id} className="fan-zone__card">
              {card.href ? <Link href={card.href}>{body}</Link> : body}
            </li>
          );
        })}
      </ul>

      {poll ? (
        <div className="fan-zone__poll">
          <FanPollWidget poll={poll} />
        </div>
      ) : null}
    </section>
  );
}
