import type { Metadata } from "next";
import { getColleges } from "@/services/ncaa.service";
import { buildBreadcrumbJsonLd, buildMetadata, type BreadcrumbItem } from "@/lib/seo";
import { NCAA_PATH } from "@/lib/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { CollegeCard } from "@/components/ncaa/CollegeCard";
import { NcaaEmptyState } from "@/components/ncaa/NcaaStateViews";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "NCAA Colleges | The Sports Rivalry",
    description: "Every featured NCAA college and university, in one directory.",
    canonicalPath: `${NCAA_PATH}/colleges`,
  });
}

export default async function NcaaCollegesPage() {
  const colleges = await getColleges();
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "NCAA", href: NCAA_PATH },
    { name: "Colleges", href: `${NCAA_PATH}/colleges` },
  ];

  return (
    <div className="ncaa-page">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <div className="ncaa-shell ncaa-index">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="ncaa-index__title">NCAA Colleges</h1>

        {colleges.length === 0 ? (
          <NcaaEmptyState message="Colleges will appear here soon." />
        ) : (
          <div className="ncaa-college-row ncaa-college-row--index">
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
