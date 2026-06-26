import Link from "next/link";
import {
  listFanZoneCards,
  listHomeModules,
  listPolls,
  listPredictions,
  listSubscribers,
} from "@/lib/supabase/admin-data";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export default async function AdminDashboardPage() {
  if (!isSupabaseAdminConfigured) {
    return (
      <section className="admin-page">
        <h1>Dashboard</h1>
        <div className="admin-notice admin-notice--warning">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> (and the public keys) to{" "}
          <code>.env.local</code> and run the SQL migration to enable content management.
        </div>
      </section>
    );
  }

  const [cards, polls, predictions, subscribers, modules] = await Promise.all([
    listFanZoneCards(),
    listPolls(),
    listPredictions(),
    listSubscribers(),
    listHomeModules(),
  ]);

  const stats = [
    { label: "Fan Zone cards", value: cards.length, href: "/admin/fan-zone" },
    { label: "Polls", value: polls.length, href: "/admin/polls" },
    { label: "Predictions", value: predictions.length, href: "/admin/predictions" },
    { label: "Subscribers", value: subscribers.length, href: "/admin/subscribers" },
    { label: "Home modules", value: modules.length, href: "/admin/modules" },
  ];

  return (
    <section className="admin-page">
      <h1>Dashboard</h1>
      <p className="admin-page__lead">
        Articles are authored in WordPress. Use this panel for the Supabase-driven Fan Zone,
        polls, predictions, media uploads, subscribers, and homepage modules.
      </p>
      <div className="admin-stats">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="admin-stat">
            <span className="admin-stat__value">{stat.value}</span>
            <span className="admin-stat__label">{stat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
