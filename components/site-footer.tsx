import Link from "next/link";
import { FOOTER_LINK_GROUPS } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-grid">
        <div className="footer-brand">
          <h2>Sports Rivalry</h2>
          <p>
            Built for fans who track the feud as closely as the score. Sports Rivalry packages
            the week’s pressure points, grudges, and title-shaping swings into a cleaner
            editorial experience.
          </p>
        </div>
        {FOOTER_LINK_GROUPS.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <ul className="footer-list">
              {group.links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
