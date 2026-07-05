import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuthorProfile } from "@/lib/cms";
import { articles } from "@/lib/mock-data";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildProfileJsonLd,
  type BreadcrumbItem,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorProfile(slug);

  if (!author) {
    return buildMetadata({
      title: "Not found | The Sports Rivalry",
      description: "The requested page could not be found.",
      canonicalPath: `/authors/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata(author.seo);
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorProfile(slug);

  if (!author) {
    notFound();
  }

  const authorStories = articles.filter((article) =>
    article.authors.some((entry) => entry.slug === author.slug),
  );
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "Authors", href: "/authors" },
    { name: author.name, href: `/authors/${author.slug}` },
  ];

  return (
    <div className="page-shell page-shell--detail">
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={buildProfileJsonLd(author)} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="author-profile">
        <Image
          src={author.avatar.src}
          alt={author.avatar.alt}
          width={author.avatar.width}
          height={author.avatar.height}
        />
        <div>
          <span className="eyebrow">{author.role}</span>
          <h1>{author.name}</h1>
          <p>{author.bio}</p>
          <p className="author-expertise">{author.expertise}</p>
          <div className="tag-row">
            <span className="tag-chip">{author.beat}</span>
            {author.socials.map((social) => (
              <Link key={social.url} href={social.url} className="tag-chip tag-chip--muted">
                {social.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="module-block">
        <SectionHeading title={`Latest from ${author.name}`} />
        <div className="story-grid story-grid--three">
          {authorStories.map((article) => (
            <Link
              key={article.id}
              href={`/${article.sport.slug}/${article.slug}`}
              className="text-card"
            >
              <span className="eyebrow">{article.sport.name}</span>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
