import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_DOMAIN, SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";
import type { Article, AuthorProfile, MediaAsset, SeoMeta } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

function imageForMeta(image?: MediaAsset) {
  if (!image) {
    return undefined;
  }

  return [
    {
      url: absoluteUrl(image.src),
      width: image.width,
      height: image.height,
      alt: image.alt,
    },
  ];
}

export function buildMetadata(seo: SeoMeta): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    metadataBase: new URL(SITE_DOMAIN),
    alternates: {
      canonical: seo.canonicalPath,
    },
    keywords: seo.keywords,
    robots: seo.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: seo.title,
      description: seo.description,
      url: seo.canonicalPath,
      images: imageForMeta(seo.ogImage),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [absoluteUrl(seo.ogImage.src)] : undefined,
    },
  };
}

export function buildArticleMetadata(article: Article): Metadata {
  return {
    ...buildMetadata({
      ...article.seo,
      ogImage: article.featuredImage,
    }),
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: article.seo.title,
      description: article.seo.description,
      url: article.seo.canonicalPath,
      images: imageForMeta(article.featuredImage),
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.authors.map((author) => author.name),
      section: article.sport.name,
      tags: article.tags,
    },
  };
}

export function buildPageTitle(title: string) {
  return `${title} | ${SITE_NAME}`;
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_DOMAIN,
    description: SITE_DESCRIPTION,
    slogan: SITE_TAGLINE,
    logo: absoluteUrl("/images/brand/tsr-logo-circle.png"),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_DOMAIN,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_DOMAIN}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function buildArticleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [absoluteUrl(article.featuredImage.src)],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    articleSection: article.sport.name,
    keywords: article.tags.join(", "),
    mainEntityOfPage: absoluteUrl(article.seo.canonicalPath),
    author: article.authors.map((author) => ({
      "@type": "Person",
      name: author.name,
      url: absoluteUrl(author.seo.canonicalPath),
      description: author.expertise,
    })),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/brand/tsr-logo-circle.png"),
      },
    },
  };
}

export function buildProfileJsonLd(author: AuthorProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.name,
      description: author.bio,
      jobTitle: author.role,
      knowsAbout: [author.beat, author.expertise],
      image: absoluteUrl(author.avatar.src),
      url: absoluteUrl(author.seo.canonicalPath),
      sameAs: author.socials.map((social) => social.url),
    },
  };
}
