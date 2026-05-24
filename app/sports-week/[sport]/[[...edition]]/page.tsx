import Link from "next/link";
import { notFound } from "next/navigation";
import { SPORTS_WEEK_ITEMS } from "@/lib/sports-week";
import { SITE_NAME } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";

interface SportsWeekPageProps {
  params: Promise<{ sport: string; edition?: string[] }>;
}

function findSportsWeekEntry(sport: string, edition?: string[]) {
  const item = SPORTS_WEEK_ITEMS.find((entry) => entry.slug === sport);

  if (!item) {
    return null;
  }

  if (!edition?.length) {
    return { item, badge: item.badges[0] };
  }

  const href = `/sports-week/${sport}/${edition.join("/")}`;
  const badge = item.badges.find((entry) => entry.href === href);

  return badge ? { item, badge } : null;
}

export async function generateStaticParams() {
  const routes: Array<{ sport: string; edition?: string[] }> = [];

  SPORTS_WEEK_ITEMS.forEach((item) => {
    routes.push({ sport: item.slug });

    item.badges.forEach((badge) => {
      const segments = badge.href.replace("/sports-week/", "").split("/");

      if (segments.length > 1) {
        routes.push({ sport: segments[0], edition: segments.slice(1) });
      }
    });
  });

  return routes;
}

export async function generateMetadata({ params }: SportsWeekPageProps) {
  const { sport, edition } = await params;
  const entry = findSportsWeekEntry(sport, edition);

  if (!entry) {
    return { title: `Not found | ${SITE_NAME}` };
  }

  const label = entry.badge.label;

  return buildMetadata({
    title: `${label} | Sports Week | ${SITE_NAME}`,
    description: `${entry.item.sportLabel} Sports Week hub for ${label}.`,
    canonicalPath: entry.badge.href,
  });
}

export default async function SportsWeekPage({ params }: SportsWeekPageProps) {
  const { sport, edition } = await params;
  const entry = findSportsWeekEntry(sport, edition);

  if (!entry) {
    notFound();
  }

  const { item, badge } = entry;

  return (
    <div className="page-shell page-shell--detail">
      <article className="prose-panel">
        <span className="eyebrow">Sports Week</span>
        <h1>{badge.label}</h1>
        <p>
          This {item.sportLabel} Sports Week hub is ready to be wired to editorial content. Use this
          route for weekly coverage, curated links, and sport-specific landing modules.
        </p>
        <p>
          <Link href="/">Back to homepage</Link>
        </p>
      </article>
    </div>
  );
}
