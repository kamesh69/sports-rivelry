import Link from "next/link";
import type { NewsletterIssue } from "@/lib/types";
import { SITE_NAME } from "@/lib/site-config";

interface NewsletterBandProps {
  issue: NewsletterIssue;
}

export function NewsletterBand({ issue }: NewsletterBandProps) {
  return (
    <section className="newsletter-band">
      <div className="newsletter-band__visual" aria-hidden="true">
        <span>{SITE_NAME}</span>
        <strong>Fan Zone</strong>
      </div>
      <div className="newsletter-band__content">
        <h2>Join the Fun in {SITE_NAME}&apos;s Fan Zone</h2>
        <p>{issue.heroCopy}</p>
        <small>{SITE_NAME} Staff | {issue.schedule}</small>
        <Link href={`/newsletters/${issue.slug}`} className="button button--primary">
          {issue.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
