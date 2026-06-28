import Image from "next/image";
import Link from "next/link";
import type { StatLeader } from "@/lib/types";
import { SectionHead } from "@/components/sport-page/atoms";

const PORTRAITS = [
  "1577212017184-80cc0da11082",
  "1546519638-68e109498ffc",
  "1571019613454-1cb2f99b2d8b",
  "1517466787929-bc90951d0974",
  "1583454110551-21f2fa2afe61",
  "1526232761682-d26e85d9fa9e",
  "1599058917212-d750089bc07e",
  "1594381898411-846e7d193883",
  "1564415051543-1f8d2fd6e5b1",
  "1502904550040-7534597429ae",
];

function portrait(index: number) {
  const id = PORTRAITS[index % PORTRAITS.length];
  return `https://images.unsplash.com/photo-${id}?w=420&h=520&q=75&auto=format&fit=crop&crop=faces`;
}

export function StatLeaders({
  label,
  leaders,
  viewAllHref,
  sportSlug = "basketball",
}: {
  label: string;
  leaders: StatLeader[];
  viewAllHref: string;
  sportSlug?: string;
}) {
  if (!leaders.length) {
    return null;
  }

  return (
    <section className="sp-section" aria-label={label}>
      <SectionHead title={label} href={viewAllHref} actionLabel="All Stats" />
      <div className="sp-leaders">
        {leaders.map((leader, index) => {
          const playerHref = leader.slug
            ? `/${sportSlug}/player/${leader.slug}`
            : undefined;

          const inner = (
            <>
              <div className="sp-leader__main">
                <span className="sp-leader__label">{leader.category}</span>
                <span className="sp-leader__name">{leader.player}</span>
                <span className="sp-leader__value">{leader.value}</span>
                <span className="sp-leader__team">{leader.team}</span>
              </div>
              <div className="sp-leader__photo" aria-hidden="true">
                <Image
                  src={leader.image?.src || portrait(index)}
                  alt=""
                  fill
                  sizes="140px"
                  style={{ objectFit: "cover", objectPosition: "center 12%" }}
                />
              </div>
            </>
          );

          return playerHref ? (
            <Link
              key={`${leader.category}-${leader.slug ?? index}`}
              href={playerHref}
              className="sp-leader sp-leader--clickable"
              aria-label={`View ${leader.player} player profile`}
            >
              {inner}
            </Link>
          ) : (
            <div key={leader.category} className="sp-leader">
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
