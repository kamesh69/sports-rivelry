import type { Metadata } from "next";
import { getConferences } from "@/services/ncaa.service";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { NCAA_PATH } from "@/lib/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ConferenceCard } from "@/components/ncaa/ConferenceCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "NCAA Conferences | The Sports Rivalry",
    description: "Every NCAA conference The Sports Rivalry covers, in one directory.",
    canonicalPath: `${NCAA_PATH}/conferences`,
  });
}

export default async function NcaaConferencesPage() {
  const conferences = await getConferences();
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "Conferences", href: `${NCAA_PATH}/conferences` },
  ];

  return (
    <div className="ncaa-page">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="ncaa-shell ncaa-index">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="ncaa-index__title">NCAA Conferences</h1>

        {conferences.length === 0 ? (
          <NcaaEmptyState message="Conferences will appear here soon." />
        ) : (
          <div className="ncaa-conf-grid ncaa-conf-grid--index">
            {conferences.map((conference) => (
              <ConferenceCard key={conference.id} conference={conference} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
