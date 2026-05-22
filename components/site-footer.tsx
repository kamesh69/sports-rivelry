import Link from "next/link";
import { SPORTS_NAV, TRUST_LINKS } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <div className="footer-brand">
          <h2>Sports Rivalry</h2>
          <p>
            Built for search, speed, and the stories that make sports feel bigger than
            scorelines.
          </p>
        </div>
        <div>
          <h3>Sports</h3>
          <ul className="footer-list">
            {SPORTS_NAV.map((item) => (
              <li key={item.slug}>
                <Link href={`/${item.slug}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Trust</h3>
          <ul className="footer-list">
            {TRUST_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
