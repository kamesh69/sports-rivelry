import Link from "next/link";
import type { NavItem } from "@/lib/types";

interface CategoryStripProps {
  items: NavItem[];
}

export function CategoryStrip({ items }: CategoryStripProps) {
  return (
    <section className="category-strip" aria-label="Category-wise sports">
      <div className="category-strip__heading">
        <span className="eyebrow">Category-wise</span>
        <h2>Main sports</h2>
      </div>
      <div className="category-strip__items">
        {items.map((item) =>
          item.href && !item.disabled ? (
            <Link key={item.slug} href={item.href} className="category-strip__chip">
              {item.label}
            </Link>
          ) : (
            <span
              key={item.slug}
              className="category-strip__chip category-strip__chip--disabled"
            >
              {item.label}
            </span>
          ),
        )}
      </div>
    </section>
  );
}
