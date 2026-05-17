import Link from "next/link";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  href?: string;
  actionLabel?: string;
  description?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  href,
  actionLabel = "View all",
  description,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div className="section-heading__copy">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="section-action">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
