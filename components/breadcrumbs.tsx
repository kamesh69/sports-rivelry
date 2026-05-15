import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {items.map((item, index) => (
        <span key={item.href}>
          {index > 0 ? <span className="breadcrumbs__divider">/</span> : null}
          <Link href={item.href}>{item.name}</Link>
        </span>
      ))}
    </nav>
  );
}
