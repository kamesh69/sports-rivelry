import Link from "next/link";
import type { NewsletterIssue } from "@/lib/types";

interface NewsletterBandProps {
  issue: NewsletterIssue;
}

export function NewsletterBand({ issue }: NewsletterBandProps) {
  return (
    <section className="newsletter-band">
      <div>
        <span className="eyebrow">Newsletter</span>
        <h2>{issue.title}</h2>
        <p>{issue.heroCopy}</p>
        <small>{issue.schedule}</small>
      </div>
      <div className="newsletter-actions">
        <Link href={`/newsletters/${issue.slug}`} className="button button--primary">
          {issue.ctaLabel}
        </Link>
        <span>No-code placeholder form. Connect to Mailchimp, Beehiiv, or ConvertKit in v1.</span>
      </div>
    </section>
  );
}
