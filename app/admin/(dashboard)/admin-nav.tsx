"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/fan-zone", label: "Fan Zone" },
  { href: "/admin/polls", label: "Polls" },
  { href: "/admin/predictions", label: "Predictions" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/modules", label: "Homepage Modules" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav" aria-label="Admin sections">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav__link${isActive ? " admin-nav__link--active" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
