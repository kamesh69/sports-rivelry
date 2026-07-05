import type { Metadata } from "next";
import { getRankings } from "@/services/rankings.service";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { NCAA_PATH } from "@/lib/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { RankingCard } from "@/components/ncaa/RankingCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "NCAA Rankings | The Sports Rivalry",
    description: "Full top-25-style rankings across every major NCAA sport.",
    canonicalPath: `${NCAA_PATH}/rankings`,
  });
}

export default async function NcaaRankingsPage() {
  const rankings = await getRankings();
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "Rankings", href: `${NCAA_PATH}/rankings` },
  ];

  return (
    <div className="ncaa-page">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="ncaa-shell ncaa-index">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="ncaa-index__title">NCAA Rankings</h1>

        {rankings.length === 0 ? (
          <NcaaEmptyState message="Rankings will appear here once the season begins." />
        ) : (
          <div className="ncaa-rank-grid ncaa-rank-grid--index">
            {rankings.map((group) => (
              <RankingCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
