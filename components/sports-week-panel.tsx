import Link from "next/link";
import { SPORTS_WEEK_ITEMS } from "@/lib/sports-week";

export function SportsWeekPanel() {
  return (
    <aside className="sports-week-panel" aria-labelledby="sports-week-heading">
      <h2 id="sports-week-heading" className="sports-week-panel__title">
        Sports Week
      </h2>
      <ul className="sports-week-list">
        {SPORTS_WEEK_ITEMS.map((item) => (
          <li key={item.slug} className="sports-week-list__row">
            <span className="sports-week-list__sport">{item.sportLabel}</span>
            <div className="sports-week-list__badges">
              {item.badges.map((badge) => (
                <Link
                  key={badge.href}
                  href={badge.href}
                  className="sports-week-badge"
                  style={{
                    backgroundColor: badge.background,
                    color: badge.color,
                  }}
                >
                  {badge.label}
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
