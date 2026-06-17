import Link from "next/link";
import type { NewsletterIssue } from "@/lib/types";

interface NewsletterBandProps {
  issue: NewsletterIssue;
}

export function NewsletterBand({ issue }: NewsletterBandProps) {
  return (
    <section className="newsletter-band">
      <div className="newsletter-band__visual" aria-hidden="true">
        <span>Sports Rivalry</span>
        <strong>Fan Zone</strong>
      </div>
      <div className="newsletter-band__content">
        <h2>Join the Fun in Sports Rivalry&apos;s Fan Zone</h2>
        <p>{issue.heroCopy}</p>
        <small>Sports Rivalry Staff | {issue.schedule}</small>
        <Link href={`/newsletters/${issue.slug}`} className="button button--primary">
          {issue.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
